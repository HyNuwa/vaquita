import { describe, expect, it } from "vitest";
import { getAddress } from "viem";
import { assertModuloPermitido, contratosFondo, DIRECCIONES_PROHIBIDAS } from "../src/config/fondo-contratos.js";

const expected = {
  safeL2: {
    address: "0x29fcB43b46531BcA003ddC8FCB67FFE91900C762",
    codeHash: "0xb1f926978a0f44a2c0ec8fe822418ae969bd8c3f18d61e5103100339894f81ff", // Hash público de bytecode; secret-scan: allow
  },
  proxyFactory: {
    address: "0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67",
    codeHash: "0x50c3cdc4074750a7a974204a716c999edd37482f907608d960b2b025ee0b3317", // Hash público de bytecode; secret-scan: allow
  },
  fallbackHandler: {
    address: "0xfd0732Dc9E303f09fCEf3a7388Ad10A83459Ec99",
    codeHash: "0x7c6007a5d711cea8dfd5d91f5940ec29c7f200fe511eb1fc1397b367af3c42f9", // Hash público de bytecode; secret-scan: allow
  },
  multiSendCallOnly: {
    address: "0x9641d764fc13c8B624c04430C7356C1C7C8102e2",
    codeHash: "0xecd5bd14a08c5d2122379900b2f272bdf107a7e92423c10dd5fe3254386c9939", // Hash público de bytecode; secret-scan: allow
  },
  rolesMastercopy: {
    address: "0xF2964CE6161ce0e75964Fe7927cE114cb0B283D5",
    codeHash: "0x471d8b3b419f1eb955230c0326c8812176df49bf3c7b414a563fda5a3c6c10b6", // Hash público de bytecode; secret-scan: allow
  },
  moduleFactory: {
    address: "0x000000000000aDdB49795b0f9bA5BC298cDda236",
    codeHash: "0x01623cbcf010a1c326230f1b2d5f48a66b440232ee49096102bc84967dc5f21e", // Hash público de bytecode; secret-scan: allow
  },
};

const forbidden = [
  "0x9646fDAD06d3e24444381f44362a3B0eB343D337",
  "0x01F8cabB808D7dE0dF4202D4B60C8310d2f1339b",
];

describe("contratos del fondo", () => {
  it("publica exactamente las seis direcciones y hashes de Celo aceptados", () => {
    expect(contratosFondo(42220)).toEqual(expected);
  });

  it.each([1, 0, 42219, 42221, -1, NaN])("rechaza otra red (%s) sin cambiar la configuración", (chainId) => {
    expect(() => contratosFondo(chainId)).toThrow("El fondo solo está disponible en Celo mainnet.");
    expect(contratosFondo(42220)).toEqual(expected);
  });

  it("devuelve las seis direcciones con checksum válido", () => {
    for (const contract of Object.values(contratosFondo(42220))) {
      expect(contract.address).toBe(getAddress(contract.address));
    }
  });

  it("declara exactamente las dos versiones prohibidas", () => {
    expect(DIRECCIONES_PROHIBIDAS).toEqual(forbidden);
  });

  it.each(forbidden)("rechaza la versión prohibida %s independientemente del uso de mayúsculas", (address) => {
    const variants = [address, address.toLowerCase(), `0x${address.slice(2).toUpperCase()}`];
    for (const variant of variants) {
      expect(() => assertModuloPermitido(variant)).toThrow("Esta versión del módulo está prohibida.");
      expect(contratosFondo(42220)).toEqual(expected);
      expect(DIRECCIONES_PROHIBIDAS).toEqual(forbidden);
    }
  });

  it("permite la mastercopy corregida sin modificar la configuración", () => {
    expect(assertModuloPermitido(expected.rolesMastercopy.address)).toBeUndefined();
    expect(assertModuloPermitido(expected.rolesMastercopy.address.toLowerCase())).toBeUndefined();
    expect(contratosFondo(42220)).toEqual(expected);
  });

  it.each(["", "0x1234", `0x${"z".repeat(40)}`])("rechaza una dirección mal formada (%s)", (address) => {
    expect(() => assertModuloPermitido(address)).toThrow("Dirección de módulo inválida.");
    expect(contratosFondo(42220)).toEqual(expected);
  });
});
