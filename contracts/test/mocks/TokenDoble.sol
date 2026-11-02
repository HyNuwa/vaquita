// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

/// Doble de wARS: se le puede pedir cada forma de fallar que importa. wARS real va en el spike.
contract TokenDoble is ERC20Permit {
    enum Falla {
        Ninguna,
        Pausado,
        DevuelveFalse,
        SinRetorno,
        ComisionEnTransferencia,
        DebitaDeMas,
        LecturaRota,
        Reentrada
    }

    Falla public falla;
    mapping(address => bool) public bloqueado;
    /// A partir de cuántas transferencias empieza a fallar.
    uint256 public fallarDesde;
    uint256 public transferencias;

    address public objetivo;
    bytes public llamada;
    bool public reentradaFallo;

    error Pausado();
    error Bloqueado(address cuenta);
    error LecturaRota();

    constructor() ERC20("Doble de wARS", "wARS") ERC20Permit("Doble de wARS") {}

    function acunar(address a, uint256 monto) external {
        _mint(a, monto);
    }

    function configurar(Falla f, uint256 desde) external {
        falla = f;
        fallarDesde = desde;
        transferencias = 0;
    }

    function bloquear(address cuenta) external {
        bloqueado[cuenta] = true;
    }

    function prepararReentrada(address objetivo_, bytes calldata llamada_) external {
        objetivo = objetivo_;
        llamada = llamada_;
    }

    function balanceOf(address cuenta) public view override returns (uint256) {
        if (falla == Falla.LecturaRota) revert LecturaRota();
        return super.balanceOf(cuenta);
    }

    function _activa() private view returns (bool) {
        return transferencias >= fallarDesde;
    }

    function transferFrom(address de, address a, uint256 monto) public override returns (bool) {
        bool activa = _activa();
        transferencias++;
        if (activa && falla == Falla.Pausado) revert Pausado();
        if (bloqueado[de]) revert Bloqueado(de);
        if (bloqueado[a]) revert Bloqueado(a);
        if (bloqueado[msg.sender]) revert Bloqueado(msg.sender);
        if (activa && falla == Falla.DevuelveFalse) return false;
        if (activa && falla == Falla.SinRetorno) {
            super.transferFrom(de, a, monto);
            assembly {
                return(0, 0)
            }
        }
        if (activa && falla == Falla.ComisionEnTransferencia) {
            super.transferFrom(de, a, monto);
            _burn(a, monto / 100);
            return true;
        }
        if (activa && falla == Falla.DebitaDeMas) {
            super.transferFrom(de, a, monto);
            _burn(de, monto / 100);
            return true;
        }
        if (activa && falla == Falla.Reentrada) {
            (bool ok,) = objetivo.call(llamada);
            if (!ok) reentradaFallo = true;
        }
        return super.transferFrom(de, a, monto);
    }
}
