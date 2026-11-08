import { expect, it } from "vitest";
import { erc20Abi } from "viem";
import { FEE_CURRENCIES, WFIAT } from "../src/config/tokens.js";
import { safeAbi, rolesAbi } from "../src/fondo/abis.js";
import { contratosFondo } from "../src/config/fondo-contratos.js";
import { withAnvil } from "../test/helpers/anvil.js";
import { fundFixture } from "../test/helpers/fondo-fixture.js";

it("S1-5/S1-6: despliega Safe 2 de 3 y Roles con dueño, avatar, target y proxy esperados", async () => {
  await withAnvil({}, async (fork) => {
    const fixture = await fundFixture(fork);
    const { client, safe, roles, owners } = fixture;
    expect(await client.readContract({ address: safe, abi: safeAbi, functionName: "getOwners" })).toEqual(owners.map((a) => a.address));
    expect(await client.readContract({ address: safe, abi: safeAbi, functionName: "getThreshold" })).toBe(2n);
    for (const functionName of ["owner", "avatar", "target"] as const) {
      expect(await client.readContract({ address: roles, abi: rolesAbi, functionName })).toBe(safe);
    }
    const mastercopy = contratosFondo(42220).rolesMastercopy.address.slice(2).toLowerCase();
    expect(await client.getCode({ address: roles })).toBe(`0x363d3d373d3d3d363d73${mastercopy}5af43d82803e903d91602b57fd5bf3`);
    for (const token of [WFIAT.wARS.address, FEE_CURRENCIES.USDC.token]) {
      await fixture.fundToken(token, safe, 123n);
      expect(await client.readContract({ address: token, abi: erc20Abi, functionName: "balanceOf", args: [safe] })).toBe(123n);
    }
    const before = await client.getBlock();
    await fixture.advanceTime(60);
    expect((await client.getBlock()).timestamp).toBeGreaterThanOrEqual(before.timestamp + 60n);
  });
}, 120000);
