// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {Test, Vm} from "forge-std/Test.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {CompraColectiva, Terminos} from "../src/CompraColectiva.sol";
import {FabricaCompraColectiva} from "../src/FabricaCompraColectiva.sol";
import {TokenDoble} from "./mocks/TokenDoble.sol";

abstract contract Base is Test {
    uint256 internal constant PRECIO = 1_000e18;
    uint256 internal constant CARGO = 10e18;
    uint256 internal constant TOTAL = PRECIO + CARGO;
    uint64 internal limite;

    TokenDoble internal token;
    FabricaCompraColectiva internal fabrica;
    address internal proveedor = makeAddr("proveedor");
    address internal destinoCargo = makeAddr("destinoCargo");
    address internal ana;
    uint256 internal anaClave;
    address internal beto = makeAddr("beto");
    address internal caro = makeAddr("caro");
    address internal dani = makeAddr("dani");

    function setUp() public virtual {
        (ana, anaClave) = makeAddrAndKey("ana");
        limite = uint64(block.timestamp + 7 days);
        token = new TokenDoble();
        fabrica = new FabricaCompraColectiva(IERC20(address(token)));
        token.acunar(ana, 2 * TOTAL);
        token.acunar(beto, 2 * TOTAL);
        token.acunar(caro, 2 * TOTAL);
        token.acunar(dani, 2 * TOTAL);
    }

    function terminos() internal view returns (Terminos memory) {
        return Terminos({
            referencia: keccak256("oferta-1"),
            proveedor: proveedor,
            precio: PRECIO,
            cargo: CARGO,
            destinatarioCargo: destinoCargo,
            minimo: 2,
            maximo: 3,
            fechaLimite: limite
        });
    }

    function lista() internal view returns (address[] memory l) {
        l = new address[](4);
        l[0] = ana;
        l[1] = beto;
        l[2] = caro;
        l[3] = dani;
    }

    function crear() internal returns (CompraColectiva) {
        return fabrica.createCampaign(terminos(), lista());
    }

    function comprometer(CompraColectiva c, address quien) internal {
        vm.startPrank(quien);
        token.approve(address(c), c.totalPorComprador());
        c.comprometer();
        vm.stopPrank();
    }

    function firmaPermit(CompraColectiva c, uint256 clave, uint256 valor, uint256 vence)
        internal
        view
        returns (uint8 v, bytes32 r, bytes32 s)
    {
        address dueno = vm.addr(clave);
        return firmaPara(address(c), clave, dueno, valor, vence, token.nonces(dueno), token.DOMAIN_SEPARATOR());
    }

    function firmaPara(address gastador, uint256 clave, address dueno, uint256 valor, uint256 vence, uint256 nonce, bytes32 dominio)
        internal
        pure
        returns (uint8, bytes32, bytes32)
    {
        bytes32 tipo = keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)");
        bytes32 estructura = keccak256(abi.encode(tipo, dueno, gastador, valor, nonce, vence));
        return vm.sign(clave, keccak256(abi.encodePacked("\x19\x01", dominio, estructura)));
    }
}

contract FabricaTest is Base {
    function test_DespliegaInicializadaYSinPermisos() public {
        vm.recordLogs();
        CompraColectiva c = crear();
        assertTrue(fabrica.esCampana(address(c)));
        assertEq(address(c.token()), address(token));
        assertEq(c.proveedor(), proveedor);
        assertEq(c.precio(), PRECIO);
        assertEq(c.fechaLimite(), limite);
        assertEq(c.compradores().length, 4);
        assertEq(uint8(c.estado()), uint8(CompraColectiva.Estado.Abierta));
        assertEq(vm.getRecordedLogs().length, 1);
    }

    function test_TokenSinCodigoRevierte() public {
        vm.expectRevert(FabricaCompraColectiva.TokenInvalido.selector);
        new FabricaCompraColectiva(IERC20(makeAddr("nada")));
    }

    function test_ProveedorInvalido() public {
        Terminos memory t = terminos();
        t.proveedor = address(0);
        vm.expectRevert(CompraColectiva.ProveedorInvalido.selector);
        fabrica.createCampaign(t, lista());
        t.proveedor = address(token);
        vm.expectRevert(CompraColectiva.ProveedorInvalido.selector);
        fabrica.createCampaign(t, lista());
    }

    function test_PrecioCeroRevierte() public {
        Terminos memory t = terminos();
        t.precio = 0;
        vm.expectRevert(CompraColectiva.PrecioInvalido.selector);
        fabrica.createCampaign(t, lista());
    }

    function test_CargoInvalido() public {
        Terminos memory t = terminos();
        t.destinatarioCargo = address(0);
        vm.expectRevert(CompraColectiva.CargoInvalido.selector);
        fabrica.createCampaign(t, lista());

        t = terminos();
        t.destinatarioCargo = proveedor;
        vm.expectRevert(CompraColectiva.CargoInvalido.selector);
        fabrica.createCampaign(t, lista());

        t = terminos();
        t.cargo = 0;
        vm.expectRevert(CompraColectiva.CargoInvalido.selector);
        fabrica.createCampaign(t, lista());
    }

    function test_CupoInvalido() public {
        Terminos memory t = terminos();
        t.minimo = 0;
        vm.expectRevert(CompraColectiva.CupoInvalido.selector);
        fabrica.createCampaign(t, lista());

        t = terminos();
        t.maximo = 1;
        vm.expectRevert(CompraColectiva.CupoInvalido.selector);
        fabrica.createCampaign(t, lista());
    }

    function test_FechaEnElPasadoRevierte() public {
        Terminos memory t = terminos();
        t.fechaLimite = uint64(block.timestamp);
        vm.expectRevert(CompraColectiva.FechaInvalida.selector);
        fabrica.createCampaign(t, lista());
    }

    function test_ElTopeIncluyeElCargo() public {
        Terminos memory t = terminos();
        t.precio = fabrica.TOPE_POR_COMPRADOR() - CARGO;
        fabrica.createCampaign(t, lista());

        t.precio += 1;
        vm.expectRevert(CompraColectiva.SuperaElTope.selector);
        fabrica.createCampaign(t, lista());
    }

    function test_ListaInvalida() public {
        address[] memory corta = new address[](1);
        corta[0] = ana;
        vm.expectRevert(CompraColectiva.ListaInvalida.selector);
        fabrica.createCampaign(terminos(), corta);

        address[] memory larga = new address[](51);
        for (uint256 i = 0; i < larga.length; i++) {
            larga[i] = address(uint160(i + 1000));
        }
        vm.expectRevert(CompraColectiva.ListaInvalida.selector);
        fabrica.createCampaign(terminos(), larga);
    }

    function test_CompradoresInvalidos() public {
        address[] memory l = lista();
        l[1] = ana;
        vm.expectRevert(abi.encodeWithSelector(CompraColectiva.CompradorDuplicado.selector, ana));
        fabrica.createCampaign(terminos(), l);

        for (uint256 i = 0; i < 3; i++) {
            l = lista();
            l[1] = i == 0 ? proveedor : i == 1 ? destinoCargo : address(0);
            vm.expectRevert(abi.encodeWithSelector(CompraColectiva.CompradorInvalido.selector, l[1]));
            fabrica.createCampaign(terminos(), l);
        }
    }
}

contract CompromisoTest is Base {
    CompraColectiva internal c;

    function setUp() public override {
        super.setUp();
        c = crear();
    }

    function test_NoDeposita() public {
        comprometer(c, ana);
        assertEq(token.balanceOf(ana), 2 * TOTAL);
        assertEq(token.balanceOf(address(c)), 0);
        assertEq(uint8(c.adhesion(ana)), uint8(CompraColectiva.Adhesion.Activa));
    }

    function test_NoHabilitadoRevierte() public {
        address otro = makeAddr("otro");
        vm.prank(otro);
        vm.expectRevert(CompraColectiva.NoEstaHabilitado.selector);
        c.comprometer();
    }

    function test_AutorizacionTieneQueSerExacta() public {
        vm.startPrank(ana);
        vm.expectRevert(CompraColectiva.AutorizacionNoExacta.selector);
        c.comprometer();

        token.approve(address(c), TOTAL - 1);
        vm.expectRevert(CompraColectiva.AutorizacionNoExacta.selector);
        c.comprometer();

        token.approve(address(c), type(uint256).max);
        vm.expectRevert(CompraColectiva.AutorizacionNoExacta.selector);
        c.comprometer();
        vm.stopPrank();
    }

    function test_CompromisoRepetidoRevierte() public {
        comprometer(c, ana);
        vm.prank(ana);
        vm.expectRevert(CompraColectiva.AdhesionPrevia.selector);
        c.comprometer();
    }

    function test_CancelarEsIrreversible() public {
        comprometer(c, ana);
        vm.startPrank(ana);
        c.cancelarCompromiso();
        assertEq(uint8(c.adhesion(ana)), uint8(CompraColectiva.Adhesion.Cancelada));
        vm.expectRevert(CompraColectiva.AdhesionPrevia.selector);
        c.comprometer();
        vm.expectRevert(CompraColectiva.SinCompromisoActivo.selector);
        c.cancelarCompromiso();
        vm.stopPrank();
    }

    function test_CancelarSinCompromisoRevierte() public {
        vm.prank(ana);
        vm.expectRevert(CompraColectiva.SinCompromisoActivo.selector);
        c.cancelarCompromiso();
    }

    function test_LimiteTemporalExacto() public {
        vm.warp(limite - 1);
        comprometer(c, ana);

        vm.warp(limite);
        vm.startPrank(beto);
        token.approve(address(c), TOTAL);
        vm.expectRevert(CompraColectiva.FueraDePlazo.selector);
        c.comprometer();
        vm.stopPrank();

        vm.prank(ana);
        vm.expectRevert(CompraColectiva.FueraDePlazo.selector);
        c.cancelarCompromiso();
    }

    function test_ElTagAlFinalDelCalldataSeIgnora() public {
        vm.startPrank(ana);
        token.approve(address(c), TOTAL);
        (bool ok,) = address(c).call(abi.encodePacked(c.comprometer.selector, bytes("celo_tag_de_prueba")));
        vm.stopPrank();
        assertTrue(ok);
        assertEq(uint8(c.adhesion(ana)), uint8(CompraColectiva.Adhesion.Activa));
    }

    function test_ElTagTampocoAlteraUnPermit() public {
        uint256 vence = block.timestamp + 1 hours;
        (uint8 v, bytes32 r, bytes32 s) = firmaPermit(c, anaClave, TOTAL, vence);
        vm.prank(ana);
        (bool ok,) = address(c).call(
            abi.encodePacked(abi.encodeCall(c.comprometerConPermit, (vence, v, r, s)), bytes("celo_tag_de_prueba"))
        );
        assertTrue(ok);
        assertEq(uint8(c.adhesion(ana)), uint8(CompraColectiva.Adhesion.Activa));
    }
}

contract PermitTest is Base {
    CompraColectiva internal c;
    uint256 internal vence;

    function setUp() public override {
        super.setUp();
        c = crear();
        vence = block.timestamp + 1 hours;
    }

    function test_PermitValidoCompromete() public {
        (uint8 v, bytes32 r, bytes32 s) = firmaPermit(c, anaClave, TOTAL, vence);
        vm.prank(ana);
        c.comprometerConPermit(vence, v, r, s);
        assertEq(uint8(c.adhesion(ana)), uint8(CompraColectiva.Adhesion.Activa));
        assertEq(token.allowance(ana, address(c)), TOTAL);
    }

    function test_FirmaVencida() public {
        (uint8 v, bytes32 r, bytes32 s) = firmaPermit(c, anaClave, TOTAL, block.timestamp - 1);
        vm.prank(ana);
        vm.expectRevert(CompraColectiva.AutorizacionNoExacta.selector);
        c.comprometerConPermit(block.timestamp - 1, v, r, s);
    }

    function test_TotalIncorrecto() public {
        (uint8 v, bytes32 r, bytes32 s) = firmaPermit(c, anaClave, TOTAL - 1, vence);
        vm.prank(ana);
        vm.expectRevert(CompraColectiva.AutorizacionNoExacta.selector);
        c.comprometerConPermit(vence, v, r, s);
    }

    function test_NonceIncorrecto() public {
        (uint8 v, bytes32 r, bytes32 s) = firmaPara(address(c), anaClave, ana, TOTAL, vence, 7, token.DOMAIN_SEPARATOR());
        vm.prank(ana);
        vm.expectRevert(CompraColectiva.AutorizacionNoExacta.selector);
        c.comprometerConPermit(vence, v, r, s);
    }

    function test_FirmaDeOtraCampana() public {
        CompraColectiva otra = crear();
        (uint8 v, bytes32 r, bytes32 s) = firmaPermit(otra, anaClave, TOTAL, vence);
        vm.prank(ana);
        vm.expectRevert(CompraColectiva.AutorizacionNoExacta.selector);
        c.comprometerConPermit(vence, v, r, s);
    }

    function test_FirmaDeOtraCadena() public {
        (uint8 v, bytes32 r, bytes32 s) = firmaPermit(c, anaClave, TOTAL, vence);
        vm.chainId(1);
        vm.prank(ana);
        vm.expectRevert(CompraColectiva.AutorizacionNoExacta.selector);
        c.comprometerConPermit(vence, v, r, s);
    }

    function test_LaFirmaDeOtroNoAdhiereAlQueLlama() public {
        (uint8 v, bytes32 r, bytes32 s) = firmaPermit(c, anaClave, TOTAL, vence);
        vm.prank(beto);
        vm.expectRevert(CompraColectiva.AutorizacionNoExacta.selector);
        c.comprometerConPermit(vence, v, r, s);
        assertEq(uint8(c.adhesion(ana)), uint8(CompraColectiva.Adhesion.Ninguna));
    }

    function test_PermitPresentadoAntesPorOtro() public {
        (uint8 v, bytes32 r, bytes32 s) = firmaPermit(c, anaClave, TOTAL, vence);
        vm.prank(beto);
        token.permit(ana, address(c), TOTAL, vence, v, r, s);
        assertEq(uint8(c.adhesion(ana)), uint8(CompraColectiva.Adhesion.Ninguna));

        // La firma ya se usó, pero la autorización exacta existe y es ana quien firma la tx.
        vm.prank(ana);
        c.comprometerConPermit(vence, v, r, s);
        assertEq(uint8(c.adhesion(ana)), uint8(CompraColectiva.Adhesion.Activa));
    }

    function test_FirmaRepetidaNoRegistraDosVeces() public {
        (uint8 v, bytes32 r, bytes32 s) = firmaPermit(c, anaClave, TOTAL, vence);
        vm.startPrank(ana);
        c.comprometerConPermit(vence, v, r, s);
        vm.expectRevert(CompraColectiva.AdhesionPrevia.selector);
        c.comprometerConPermit(vence, v, r, s);
        vm.stopPrank();
    }
}

contract EjecucionTest is Base {
    CompraColectiva internal c;

    function setUp() public override {
        super.setUp();
        c = crear();
    }

    function test_MinimoMenosUnoRevierte() public {
        comprometer(c, ana);
        vm.expectRevert(abi.encodeWithSelector(CompraColectiva.NoAlcanzaElMinimo.selector, 1, 2));
        c.ejecutar();
        assertEq(uint8(c.estado()), uint8(CompraColectiva.Estado.Abierta));
        assertEq(token.balanceOf(ana), 2 * TOTAL);
    }

    function test_MinimoEjecutaYPagaDirecto() public {
        comprometer(c, ana);
        comprometer(c, beto);
        c.ejecutar();
        assertEq(uint8(c.estado()), uint8(CompraColectiva.Estado.Ejecutada));
        assertEq(token.balanceOf(proveedor), 2 * PRECIO);
        assertEq(token.balanceOf(destinoCargo), 2 * CARGO);
        assertEq(token.balanceOf(ana), TOTAL);
        assertEq(token.balanceOf(address(c)), 0);
        assertTrue(c.comprado(ana));
        assertFalse(c.comprado(caro));
    }

    function test_SinCargoNoMueveCargo() public {
        Terminos memory t = terminos();
        t.cargo = 0;
        t.destinatarioCargo = address(0);
        CompraColectiva s = fabrica.createCampaign(t, lista());
        comprometer(s, ana);
        comprometer(s, beto);
        s.ejecutar();
        assertEq(token.balanceOf(proveedor), 2 * PRECIO);
        assertEq(token.balanceOf(ana), 2 * TOTAL - PRECIO);
    }

    function test_SobreventaRespetaElOrdenDeLaLista() public {
        // Se comprometen al revés del orden: lo que manda es la lista, no quién llegó primero.
        comprometer(c, dani);
        comprometer(c, caro);
        comprometer(c, beto);
        comprometer(c, ana);

        vm.expectEmit(address(c));
        emit CompraColectiva.CompradorExcluido(dani, CompraColectiva.MotivoExclusion.SinCupo);
        c.ejecutar();

        assertTrue(c.comprado(ana));
        assertTrue(c.comprado(beto));
        assertTrue(c.comprado(caro));
        assertFalse(c.comprado(dani));
        assertEq(token.balanceOf(dani), 2 * TOTAL);
        assertEq(token.balanceOf(proveedor), 3 * PRECIO);
    }

    function test_SinSaldoSeSalteaYEntraElSiguiente() public {
        comprometer(c, ana);
        comprometer(c, beto);
        comprometer(c, caro);
        // Se lee antes: vm.prank vale solo para la próxima llamada.
        uint256 saldo = token.balanceOf(ana);
        vm.prank(ana);
        token.transfer(makeAddr("afuera"), saldo);

        vm.expectEmit(address(c));
        emit CompraColectiva.CompradorExcluido(ana, CompraColectiva.MotivoExclusion.SinSaldo);
        c.ejecutar();
        assertFalse(c.comprado(ana));
        assertTrue(c.comprado(beto));
        assertTrue(c.comprado(caro));
    }

    function test_RevocarSeSaltea() public {
        comprometer(c, ana);
        comprometer(c, beto);
        comprometer(c, caro);
        vm.prank(ana);
        token.approve(address(c), 0);

        vm.expectEmit(address(c));
        emit CompraColectiva.CompradorExcluido(ana, CompraColectiva.MotivoExclusion.SinAutorizacion);
        c.ejecutar();
        assertEq(token.balanceOf(ana), 2 * TOTAL);
    }

    function test_CanceladoNoSeCobraAunqueTengaFondos() public {
        comprometer(c, ana);
        comprometer(c, beto);
        comprometer(c, caro);
        vm.prank(ana);
        c.cancelarCompromiso();
        c.ejecutar();
        assertFalse(c.comprado(ana));
        assertEq(token.balanceOf(ana), 2 * TOTAL);
        assertEq(token.allowance(ana, address(c)), TOTAL);
    }

    function test_GastarYRecargarMantieneLaAdhesion() public {
        comprometer(c, ana);
        comprometer(c, beto);
        address afuera = makeAddr("afuera");
        uint256 saldo = token.balanceOf(ana);
        vm.prank(ana);
        token.transfer(afuera, saldo);
        vm.prank(afuera);
        token.transfer(ana, saldo);
        c.ejecutar();
        assertTrue(c.comprado(ana));
    }

    function test_NoSeVendenUnidadesDeMasConDuplicadoDeLlamadas() public {
        comprometer(c, ana);
        comprometer(c, beto);
        c.ejecutar();
        vm.expectRevert(CompraColectiva.NoEstaAbierta.selector);
        c.ejecutar();
        assertEq(token.balanceOf(proveedor), 2 * PRECIO);
    }

    function test_LimiteTemporalExacto() public {
        comprometer(c, ana);
        comprometer(c, beto);
        vm.warp(limite);
        vm.expectRevert(CompraColectiva.FueraDePlazo.selector);
        c.ejecutar();
        assertEq(uint8(c.estadoActual()), uint8(CompraColectiva.Estado.Vencida));
        assertEq(uint8(c.estado()), uint8(CompraColectiva.Estado.Abierta));

        vm.warp(limite - 1);
        c.ejecutar();
        assertEq(uint8(c.estadoActual()), uint8(CompraColectiva.Estado.Ejecutada));
    }

    function test_VencerNoMuevePlataYNoHayCobrosDespues() public {
        comprometer(c, ana);
        comprometer(c, beto);
        vm.expectRevert(CompraColectiva.TodaviaEnPlazo.selector);
        c.vencer();

        vm.warp(limite);
        c.vencer();
        assertEq(uint8(c.estado()), uint8(CompraColectiva.Estado.Vencida));
        assertEq(token.balanceOf(ana), 2 * TOTAL);

        vm.expectRevert(CompraColectiva.NoEstaAbierta.selector);
        c.ejecutar();
        vm.expectRevert(CompraColectiva.NoEstaAbierta.selector);
        c.vencer();
    }

    function test_EjecutadaNoSePuedeVencer() public {
        comprometer(c, ana);
        comprometer(c, beto);
        c.ejecutar();
        vm.warp(limite);
        vm.expectRevert(CompraColectiva.NoEstaAbierta.selector);
        c.vencer();
    }

    function test_CualquieraEjecutaSinCambiarElResultado() public {
        comprometer(c, ana);
        comprometer(c, beto);
        vm.prank(makeAddr("extrano"));
        c.ejecutar();
        assertEq(token.balanceOf(proveedor), 2 * PRECIO);
    }
}

contract FallasDelTokenTest is Base {
    CompraColectiva internal c;

    function setUp() public override {
        super.setUp();
        c = crear();
        comprometer(c, ana);
        comprometer(c, beto);
    }

    /// Todo o nada: ningún cobro, ningún cambio de estado, ninguna compra registrada.
    function _sinCambios() internal view {
        assertEq(uint8(c.estado()), uint8(CompraColectiva.Estado.Abierta));
        assertEq(token.balanceOf(ana), 2 * TOTAL);
        assertEq(token.balanceOf(beto), 2 * TOTAL);
        assertEq(token.balanceOf(proveedor), 0);
        assertEq(token.balanceOf(destinoCargo), 0);
        assertFalse(c.comprado(ana));
        assertFalse(c.comprado(beto));
    }

    function test_TokenPausadoRevierteTodo() public {
        token.configurar(TokenDoble.Falla.Pausado, 0);
        vm.expectRevert(TokenDoble.Pausado.selector);
        c.ejecutar();
        _sinCambios();
    }

    /// El primero cobra bien y falla el último: también se deshace lo ya cobrado.
    function test_FallaEnLaUltimaTransferenciaDeshaceLasAnteriores() public {
        token.configurar(TokenDoble.Falla.Pausado, 3);
        vm.expectRevert(TokenDoble.Pausado.selector);
        c.ejecutar();
        _sinCambios();
    }

    function test_FallaEnElCargoDeshaceElPago() public {
        token.configurar(TokenDoble.Falla.Pausado, 1);
        vm.expectRevert(TokenDoble.Pausado.selector);
        c.ejecutar();
        _sinCambios();
    }

    function test_DevuelveFalseRevierteTodo() public {
        token.configurar(TokenDoble.Falla.DevuelveFalse, 0);
        vm.expectRevert();
        c.ejecutar();
        _sinCambios();
    }

    function test_TransferenciaIncompletaRevierteTodo() public {
        token.configurar(TokenDoble.Falla.ComisionEnTransferencia, 0);
        vm.expectRevert(abi.encodeWithSelector(CompraColectiva.TransferenciaIncompleta.selector, ana));
        c.ejecutar();
        _sinCambios();
    }

    /// Sin cargo no hay otra comprobación que lo tape: el proveedor recibe de menos.
    function test_ProveedorRecibeDeMenosRevierteTodo() public {
        Terminos memory t = terminos();
        t.cargo = 0;
        t.destinatarioCargo = address(0);
        CompraColectiva s = fabrica.createCampaign(t, lista());
        comprometer(s, caro);
        comprometer(s, dani);
        token.configurar(TokenDoble.Falla.ComisionEnTransferencia, 0);
        vm.expectRevert(abi.encodeWithSelector(CompraColectiva.TransferenciaIncompleta.selector, caro));
        s.ejecutar();
        assertEq(token.balanceOf(proveedor), 0);
        assertEq(token.balanceOf(caro), 2 * TOTAL);
    }

    function test_CompradorDebitadoDeMasRevierteTodo() public {
        token.configurar(TokenDoble.Falla.DebitaDeMas, 0);
        vm.expectRevert(abi.encodeWithSelector(CompraColectiva.TransferenciaIncompleta.selector, ana));
        c.ejecutar();
        _sinCambios();
    }

    function test_TokenSinRetornoFuncionaYCobraExacto() public {
        token.configurar(TokenDoble.Falla.SinRetorno, 0);
        c.ejecutar();
        assertEq(token.balanceOf(proveedor), 2 * PRECIO);
    }

    function test_LecturaFallidaNoPruebaFaltaDeFondos() public {
        token.configurar(TokenDoble.Falla.LecturaRota, 0);
        vm.expectRevert(TokenDoble.LecturaRota.selector);
        c.ejecutar();
        token.configurar(TokenDoble.Falla.Ninguna, 0);
        _sinCambios();
    }

    function test_CompradorBloqueadoRevierteTodoYNoSeLoSaltea() public {
        comprometer(c, caro);
        token.bloquear(ana);
        vm.expectRevert(abi.encodeWithSelector(TokenDoble.Bloqueado.selector, ana));
        c.ejecutar();
        assertFalse(c.comprado(beto));
    }

    function test_ProveedorBloqueadoRevierteTodo() public {
        token.bloquear(proveedor);
        vm.expectRevert(abi.encodeWithSelector(TokenDoble.Bloqueado.selector, proveedor));
        c.ejecutar();
        _sinCambios();
    }

    function test_ContratoBloqueadoRevierteTodo() public {
        token.bloquear(address(c));
        vm.expectRevert(abi.encodeWithSelector(TokenDoble.Bloqueado.selector, address(c)));
        c.ejecutar();
        _sinCambios();
    }

    function test_DestinatarioDelCargoBloqueadoRevierteTodo() public {
        token.bloquear(destinoCargo);
        vm.expectRevert(abi.encodeWithSelector(TokenDoble.Bloqueado.selector, destinoCargo));
        c.ejecutar();
        _sinCambios();
    }

    function test_ReentradaNoCobraDeMas() public {
        token.prepararReentrada(address(c), abi.encodeCall(c.ejecutar, ()));
        token.configurar(TokenDoble.Falla.Reentrada, 0);
        c.ejecutar();
        assertTrue(token.reentradaFallo());
        assertEq(token.balanceOf(proveedor), 2 * PRECIO);
        assertEq(token.balanceOf(ana), TOTAL);
    }

    function test_ReentradaACancelarNoEvitaElCobro() public {
        token.prepararReentrada(address(c), abi.encodeCall(c.cancelarCompromiso, ()));
        token.configurar(TokenDoble.Falla.Reentrada, 0);
        c.ejecutar();
        assertTrue(token.reentradaFallo());
        assertEq(uint8(c.adhesion(ana)), uint8(CompraColectiva.Adhesion.Activa));
    }
}

contract GasTest is Base {
    /// Peor caso: lista completa, todos comprometidos, cupo lleno, con cargo.
    function test_PeorCasoDeGas() public {
        uint256 maxLista = 50;
        address[] memory l = new address[](maxLista);
        for (uint256 i = 0; i < maxLista; i++) {
            l[i] = address(uint160(0x10000 + i));
            token.acunar(l[i], TOTAL);
        }
        Terminos memory t = terminos();
        t.minimo = 1;
        t.maximo = uint32(maxLista);
        uint256 antes = gasleft();
        CompraColectiva c = fabrica.createCampaign(t, l);
        uint256 gasCrear = antes - gasleft();
        for (uint256 i = 0; i < maxLista; i++) {
            comprometer(c, l[i]);
        }
        antes = gasleft();
        c.ejecutar();
        uint256 gasEjecutar = antes - gasleft();
        emit log_named_uint("gas crear (50 compradores)", gasCrear);
        emit log_named_uint("gas ejecutar (50 compras con cargo)", gasEjecutar);
        assertEq(token.balanceOf(proveedor), maxLista * PRECIO);
        // Muy por debajo del límite de bloque de Celo: el real se mide en el spike.
        assertLt(gasEjecutar, 15_000_000);
    }
}

contract FuzzTest is Base {
    /// Sea cual sea el precio, el cargo y los que se comprometen, se conserva cada unidad.
    function testFuzz_Conservacion(uint256 precio, uint256 cargo, uint8 mascara, uint8 sinSaldo) public {
        uint256 tope = fabrica.TOPE_POR_COMPRADOR();
        precio = bound(precio, 1, tope);
        cargo = bound(cargo, 0, tope - precio);
        Terminos memory t = terminos();
        t.precio = precio;
        t.cargo = cargo;
        t.destinatarioCargo = cargo == 0 ? address(0) : destinoCargo;
        t.minimo = 1;
        t.maximo = 2;
        address[] memory l = lista();
        CompraColectiva c = fabrica.createCampaign(t, l);

        uint256 total = precio + cargo;
        uint256 esperados = 0;
        for (uint256 i = 0; i < l.length; i++) {
            token.acunar(l[i], total);
            if ((mascara >> i) & 1 == 0) continue;
            comprometer(c, l[i]);
            if ((sinSaldo >> i) & 1 == 1) {
                vm.startPrank(l[i]);
                token.transfer(makeAddr("afuera"), token.balanceOf(l[i]));
                vm.stopPrank();
            } else if (esperados < 2) {
                esperados++;
            }
        }

        uint256 suma = token.totalSupply();
        if (esperados == 0) {
            vm.expectRevert(abi.encodeWithSelector(CompraColectiva.NoAlcanzaElMinimo.selector, 0, 1));
            c.ejecutar();
            return;
        }
        c.ejecutar();
        assertEq(token.balanceOf(proveedor), esperados * precio);
        assertEq(token.balanceOf(destinoCargo), esperados * cargo);
        assertEq(token.balanceOf(address(c)), 0);
        assertEq(token.totalSupply(), suma);
    }

    function testFuzz_NadieFueraDeLaListaSeSuma(address quien) public {
        CompraColectiva c = crear();
        address[] memory l = lista();
        for (uint256 i = 0; i < l.length; i++) {
            vm.assume(quien != l[i]);
        }
        vm.prank(quien);
        vm.expectRevert(CompraColectiva.NoEstaHabilitado.selector);
        c.comprometer();
    }
}

/// Mueve la campaña al azar: comprometerse, cancelar, gastar, recargar, ejecutar, vencer.
contract Operador is Test {
    CompraColectiva internal immutable c;
    TokenDoble internal immutable token;
    address[] internal compradores;
    /// Sin esto, las invariantes podrían pasar sin que la compra ocurra nunca.
    uint256 public ejecuciones;

    constructor(CompraColectiva c_, TokenDoble token_, address[] memory l) {
        c = c_;
        token = token_;
        compradores = l;
    }

    function _quien(uint256 i) private view returns (address) {
        return compradores[i % compradores.length];
    }

    function comprometer(uint256 i) external {
        address q = _quien(i);
        vm.startPrank(q);
        token.approve(address(c), c.totalPorComprador());
        try c.comprometer() {} catch {}
        vm.stopPrank();
    }

    function cancelar(uint256 i) external {
        vm.prank(_quien(i));
        try c.cancelarCompromiso() {} catch {}
    }

    function gastar(uint256 i) external {
        address q = _quien(i);
        uint256 saldo = token.balanceOf(q);
        vm.prank(q);
        token.transfer(address(this), saldo);
    }

    function recargar(uint256 i) external {
        uint256 saldo = token.balanceOf(address(this));
        vm.prank(address(this));
        token.transfer(_quien(i), saldo);
    }

    function ejecutar() external {
        try c.ejecutar() {
            ejecuciones++;
        } catch {}
    }

    function vencer() external {
        try c.vencer() {} catch {}
    }

    function pasarTiempo(uint256 s) external {
        // Saltos cortos: la mayoría de las corridas ejecutan antes de vencer, y otras vencen.
        vm.warp(block.timestamp + bound(s, 0, 1 days));
    }
}

contract InvariantesTest is Base {
    CompraColectiva internal c;
    Operador internal operador;
    uint256 internal supplyInicial;

    function setUp() public override {
        super.setUp();
        c = crear();
        operador = new Operador(c, token, lista());
        supplyInicial = token.totalSupply();
        targetContract(address(operador));
    }

    function _comprados() internal view returns (uint256 n) {
        address[] memory l = lista();
        for (uint256 i = 0; i < l.length; i++) {
            if (c.comprado(l[i])) n++;
        }
    }

    /// La campaña nunca guarda plata.
    function invariant_NuncaGuardaPlata() public view {
        assertEq(token.balanceOf(address(c)), 0);
    }

    /// Lo que recibieron proveedor y cargo es exactamente lo que se les cobró a los comprados.
    function invariant_Conservacion() public view {
        uint256 n = _comprados();
        assertEq(token.balanceOf(proveedor), n * PRECIO);
        assertEq(token.balanceOf(destinoCargo), n * CARGO);
        assertEq(token.totalSupply(), supplyInicial);
    }

    /// Solo hay compras si se ejecutó, y entonces entre el mínimo y el máximo.
    function invariant_CompraEntreMinimoYMaximo() public view {
        uint256 n = _comprados();
        if (c.estado() == CompraColectiva.Estado.Ejecutada) {
            assertGe(n, c.minimo());
            assertLe(n, c.maximo());
        } else {
            assertEq(n, 0);
        }
    }

    /// Una ejecución exitosa como mucho, y solo si la campaña figura ejecutada.
    function invariant_UnaSolaEjecucion() public view {
        uint256 esperadas = c.estado() == CompraColectiva.Estado.Ejecutada ? 1 : 0;
        assertEq(operador.ejecuciones(), esperadas);
    }

    /// Si el operador no pudiera llegar a ejecutar, las invariantes no probarían nada.
    function test_ElOperadorLlegaAEjecutar() public {
        operador.comprometer(0);
        operador.comprometer(1);
        operador.ejecutar();
        assertEq(operador.ejecuciones(), 1);
        assertEq(token.balanceOf(proveedor), 2 * PRECIO);
    }

    /// Nadie que cancele queda comprado.
    function invariant_CanceladoNoCompra() public view {
        address[] memory l = lista();
        for (uint256 i = 0; i < l.length; i++) {
            if (c.adhesion(l[i]) == CompraColectiva.Adhesion.Cancelada) assertFalse(c.comprado(l[i]));
        }
    }
}
