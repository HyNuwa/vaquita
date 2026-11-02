// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// Condiciones de una campaña. No cambian nunca: un error exige otra campaña.
struct Terminos {
    /// Referencia a la oferta aceptada, para comprobarla desde afuera.
    bytes32 referencia;
    address proveedor;
    uint256 precio;
    /// Cargo fijo por unidad; puede ser cero.
    uint256 cargo;
    address destinatarioCargo;
    uint32 minimo;
    uint32 maximo;
    uint64 fechaLimite;
}

/**
 * Una compra colectiva (D11): cada comprador se compromete con una transacción propia y
 * conserva su plata hasta `ejecutar()`, que le cobra a cada uno y le paga directo al
 * proveedor en la misma transacción. Si algo falla, no se mueve nada.
 *
 * No tiene admin, actualizaciones ni retiros, y nunca guarda plata. Cualquiera puede llamar
 * a `ejecutar()` y a `vencer()`, porque las reglas no dependen de quién las llame.
 */
contract CompraColectiva is ReentrancyGuard {
    using SafeERC20 for IERC20;

    enum Estado {
        Abierta,
        Ejecutada,
        Vencida
    }

    enum Adhesion {
        Ninguna,
        Activa,
        Cancelada
    }

    enum MotivoExclusion {
        SinSaldo,
        SinAutorizacion,
        SinCupo
    }

    /// Lista acotada: hay que poder recorrerla entera en una sola transacción.
    uint256 public constant MAX_COMPRADORES = 50;

    IERC20 public immutable token;
    bytes32 public immutable referencia;
    address public immutable proveedor;
    uint256 public immutable precio;
    uint256 public immutable cargo;
    address public immutable destinatarioCargo;
    uint32 public immutable minimo;
    uint32 public immutable maximo;
    uint64 public immutable fechaLimite;

    /// Abierta en almacenamiento; ver `estadoActual()` para el estado efectivo.
    Estado public estado;
    mapping(address comprador => bool) public habilitado;
    mapping(address comprador => Adhesion) public adhesion;
    mapping(address comprador => bool) public comprado;
    address[] private _compradores;

    event CompromisoRegistrado(address indexed comprador, uint256 precio, uint256 cargo);
    event CompromisoCancelado(address indexed comprador);
    event CompradorExcluido(address indexed comprador, MotivoExclusion motivo);
    event CompraConfirmada(address indexed comprador, uint256 precio, uint256 cargo);
    event CampanaEjecutada(address indexed ejecutor, uint256 unidades);
    event CampanaVencida();

    error TokenInvalido();
    error ProveedorInvalido();
    error PrecioInvalido();
    error CargoInvalido();
    error CupoInvalido();
    error FechaInvalida();
    error SuperaElTope();
    error ListaInvalida();
    error CompradorInvalido(address comprador);
    error CompradorDuplicado(address comprador);
    error NoEstaHabilitado();
    error NoEstaAbierta();
    error FueraDePlazo();
    error TodaviaEnPlazo();
    error AdhesionPrevia();
    error SinCompromisoActivo();
    error AutorizacionNoExacta();
    error NoAlcanzaElMinimo(uint256 seleccionados, uint256 minimo);
    error TransferenciaIncompleta(address comprador);

    constructor(IERC20 token_, uint256 tope, Terminos memory t, address[] memory compradores_) {
        if (address(token_).code.length == 0) revert TokenInvalido();
        if (
            t.proveedor == address(0) || t.proveedor == address(this) || t.proveedor == address(token_)
        ) revert ProveedorInvalido();
        if (t.precio == 0) revert PrecioInvalido();
        if (t.cargo == 0) {
            if (t.destinatarioCargo != address(0)) revert CargoInvalido();
        } else if (
            t.destinatarioCargo == address(0) || t.destinatarioCargo == t.proveedor
                || t.destinatarioCargo == address(this) || t.destinatarioCargo == address(token_)
        ) {
            revert CargoInvalido();
        }
        if (t.minimo == 0 || t.maximo < t.minimo) revert CupoInvalido();
        if (t.fechaLimite <= block.timestamp) revert FechaInvalida();
        if (t.precio + t.cargo > tope) revert SuperaElTope();

        uint256 total = compradores_.length;
        if (total > MAX_COMPRADORES || total < t.minimo) revert ListaInvalida();
        for (uint256 i = 0; i < total; i++) {
            address c = compradores_[i];
            // Un comprador que también cobra rompería la comprobación de débitos y créditos.
            if (
                c == address(0) || c == address(this) || c == address(token_) || c == t.proveedor
                    || c == t.destinatarioCargo
            ) revert CompradorInvalido(c);
            if (habilitado[c]) revert CompradorDuplicado(c);
            habilitado[c] = true;
        }

        token = token_;
        referencia = t.referencia;
        proveedor = t.proveedor;
        precio = t.precio;
        cargo = t.cargo;
        destinatarioCargo = t.destinatarioCargo;
        minimo = t.minimo;
        maximo = t.maximo;
        fechaLimite = t.fechaLimite;
        _compradores = compradores_;
    }

    /// Lo que autoriza cada comprador: una unidad más el cargo.
    function totalPorComprador() public view returns (uint256) {
        return precio + cargo;
    }

    function compradores() external view returns (address[] memory) {
        return _compradores;
    }

    /// Pasada la fecha límite la campaña está vencida, aunque nadie haya llamado a `vencer()`.
    function estadoActual() external view returns (Estado) {
        if (estado == Estado.Abierta && block.timestamp >= fechaLimite) return Estado.Vencida;
        return estado;
    }

    /// Exige un `approve` previo por el importe exacto.
    function comprometer() external nonReentrant {
        _comprometer();
    }

    /**
     * Presenta el `permit` en la misma transacción. La firma autoriza el gasto; el
     * consentimiento lo da esta transacción. Si otro ya presentó la firma, el `permit`
     * falla pero la autorización existe, y por eso se decide mirando la autorización.
     */
    function comprometerConPermit(uint256 vence, uint8 v, bytes32 r, bytes32 s) external nonReentrant {
        try IERC20Permit(address(token)).permit(msg.sender, address(this), totalPorComprador(), vence, v, r, s) {}
        catch {}
        _comprometer();
    }

    function _comprometer() private {
        _exigirAbierta();
        if (!habilitado[msg.sender]) revert NoEstaHabilitado();
        if (adhesion[msg.sender] != Adhesion.Ninguna) revert AdhesionPrevia();
        uint256 total = totalPorComprador();
        // Sin permisos infinitos: autorizar de más también se rechaza.
        if (token.allowance(msg.sender, address(this)) != total) revert AutorizacionNoExacta();
        adhesion[msg.sender] = Adhesion.Activa;
        emit CompromisoRegistrado(msg.sender, precio, cargo);
    }

    /// Irreversible: quien cancela no puede volver a sumarse ni ser cobrado.
    function cancelarCompromiso() external nonReentrant {
        _exigirAbierta();
        if (adhesion[msg.sender] != Adhesion.Activa) revert SinCompromisoActivo();
        adhesion[msg.sender] = Adhesion.Cancelada;
        emit CompromisoCancelado(msg.sender);
    }

    /**
     * Selecciona por el orden fijo de la lista y cobra una sola vez. Solo se saltea a quien
     * canceló o no tiene saldo o autorización comprobados. Las lecturas no se capturan:
     * una lectura fallida no prueba nada y revierte todo, igual que cualquier error del token.
     */
    function ejecutar() external nonReentrant {
        _exigirAbierta();
        uint256 total = totalPorComprador();
        uint256 lista = _compradores.length;
        address[] memory elegidos = new address[](lista);
        uint256 cantidad = 0;

        for (uint256 i = 0; i < lista; i++) {
            address c = _compradores[i];
            if (adhesion[c] != Adhesion.Activa) continue;
            if (cantidad == maximo) {
                emit CompradorExcluido(c, MotivoExclusion.SinCupo);
            } else if (token.balanceOf(c) < total) {
                emit CompradorExcluido(c, MotivoExclusion.SinSaldo);
            } else if (token.allowance(c, address(this)) < total) {
                emit CompradorExcluido(c, MotivoExclusion.SinAutorizacion);
            } else {
                elegidos[cantidad++] = c;
            }
        }
        if (cantidad < minimo) revert NoAlcanzaElMinimo(cantidad, minimo);

        // Todo el estado queda escrito antes de la primera llamada externa que mueve plata.
        estado = Estado.Ejecutada;
        for (uint256 i = 0; i < cantidad; i++) {
            comprado[elegidos[i]] = true;
        }

        uint256 saldoPropio = token.balanceOf(address(this));
        for (uint256 i = 0; i < cantidad; i++) {
            _cobrar(elegidos[i], total);
        }
        if (token.balanceOf(address(this)) != saldoPropio) revert TransferenciaIncompleta(address(this));

        emit CampanaEjecutada(msg.sender, cantidad);
    }

    function _cobrar(address comprador, uint256 total) private {
        uint256 antesComprador = token.balanceOf(comprador);
        uint256 antesProveedor = token.balanceOf(proveedor);

        token.safeTransferFrom(comprador, proveedor, precio);
        if (cargo > 0) {
            uint256 antesCargo = token.balanceOf(destinatarioCargo);
            token.safeTransferFrom(comprador, destinatarioCargo, cargo);
            if (token.balanceOf(destinatarioCargo) != antesCargo + cargo) revert TransferenciaIncompleta(comprador);
        }

        // Un token que cobra comisión o mueve de menos no pasa: se compara lo que llegó.
        if (token.balanceOf(comprador) != antesComprador - total || token.balanceOf(proveedor) != antesProveedor + precio) {
            revert TransferenciaIncompleta(comprador);
        }
        emit CompraConfirmada(comprador, precio, cargo);
    }

    /// Solo cambia el estado: la plata nunca salió de las wallets, no hay nada que devolver.
    function vencer() external nonReentrant {
        if (estado != Estado.Abierta) revert NoEstaAbierta();
        if (block.timestamp < fechaLimite) revert TodaviaEnPlazo();
        estado = Estado.Vencida;
        emit CampanaVencida();
    }

    function _exigirAbierta() private view {
        if (estado != Estado.Abierta) revert NoEstaAbierta();
        if (block.timestamp >= fechaLimite) revert FueraDePlazo();
    }
}
