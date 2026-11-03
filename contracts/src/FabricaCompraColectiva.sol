// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {CompraColectiva, Terminos} from "./CompraColectiva.sol";

/**
 * Despliega campañas ya inicializadas y no conserva ningún permiso sobre ellas. El token se
 * fija al desplegar la fábrica, con la dirección de `packages/core/src/config/tokens.ts`:
 * quien crea una campaña no puede elegir otro.
 */
contract FabricaCompraColectiva {
    /// $ 5.000 por compromiso, incluido el cargo (D11.5). Subirlo exige otra fábrica.
    uint256 public constant TOPE_POR_COMPRADOR = 5_000e18;

    IERC20 public immutable token;

    /// Para comprobar que una campaña salió de esta fábrica y tiene estas reglas.
    mapping(address campana => bool) public esCampana;

    event CampanaCreada(
        address indexed campana,
        address indexed creador,
        bytes32 indexed referencia,
        address proveedor,
        uint256 precio,
        uint256 cargo,
        address destinatarioCargo,
        uint32 minimo,
        uint32 maximo,
        uint64 fechaLimite,
        address[] compradores
    );

    error TokenInvalido();

    constructor(IERC20 token_) {
        if (address(token_).code.length == 0) revert TokenInvalido();
        // El tope está escrito en 18 decimales.
        if (IERC20Metadata(address(token_)).decimals() != 18) revert TokenInvalido();
        token = token_;
    }

    function createCampaign(Terminos calldata t, address[] calldata compradores) external returns (CompraColectiva campana) {
        campana = new CompraColectiva(token, TOPE_POR_COMPRADOR, t, compradores);
        esCampana[address(campana)] = true;
        emit CampanaCreada(
            address(campana),
            msg.sender,
            t.referencia,
            t.proveedor,
            t.precio,
            t.cargo,
            t.destinatarioCargo,
            t.minimo,
            t.maximo,
            t.fechaLimite,
            compradores
        );
    }
}
