import { readFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const SRC = fileURLToPath(new URL("../src/", import.meta.url));
const ROOTS = ["fondo/constantes.ts", "fondo/safe.ts", "fondo/transacciones.ts", "fondo/creacion.ts", "fondo/roles.ts", "fondo/lectura.ts", "fondo/verificar.ts", "fondo/verificacion-eventos.ts", "fondo/verificacion-politica.ts", "fondo/verificacion-simulacion.ts", "fondo/errores.ts", "fondo/saldos.ts", "fondo/cuotas.ts", "fondo/reparto.ts", "fondo/manifiesto.ts"];

/** Inspecciona fuentes del core antes de permitir su importación pública. */
function browserClosure(): Set<string> {
  const visited = new Set<string>();
  function visit(file: string): void {
    if (visited.has(file)) return;
    expect(file.startsWith(SRC)).toBe(true);
    visited.add(file);
    const source = readFileSync(file, "utf8");
    // Sin eval, require, imports dinámicos ni entorno/red global; el lector recibe su cliente.
    expect(source).not.toMatch(/\b(?:process|fetch|XMLHttpRequest|require|eval)\s*[.(]|\bimport\s*\(/);
    const imports = [...source.matchAll(/\b(?:import|export)\s+(?:[^;]*?\s+from\s+)?["']([^"']+)["']/g)];
    for (const match of imports) {
      const specifier = match[1]!;
      if (specifier.startsWith(".")) {
        const dependency = resolve(dirname(file), specifier.replace(/\.js$/, ".ts"));
        // Lista cerrada: ningún adaptador nuevo puede colarse en el recorrido.
        expect(relative(SRC, dependency).replaceAll("\\", "/")).toMatch(
          /^(?:fondo\/(?:constantes|safe|transacciones|abis|creacion|roles|lectura|verificar|verificacion-eventos|verificacion-politica|verificacion-simulacion|errores|saldos|cuotas|reparto|manifiesto)|config\/(?:tokens|fondo-contratos)|attribution\/tag)\.ts$/,
        );
        visit(dependency);
      } else {
        expect(["viem", "@celo/attribution-tags"]).toContain(specifier);
      }
    }
  }
  for (const root of ROOTS) visit(resolve(SRC, root));
  return visited;
}

describe("frontera navegador del núcleo S2 implementado", () => {
  it("recorre las dependencias del core y luego importa los módulos públicos", async () => {
    const closure = browserClosure();
    expect([...closure].map((file) => relative(SRC, file).replaceAll("\\", "/")).sort()).toEqual([
      "attribution/tag.ts", "config/fondo-contratos.ts", "config/tokens.ts", "fondo/abis.ts", "fondo/constantes.ts",
      "fondo/creacion.ts", "fondo/cuotas.ts", "fondo/errores.ts", "fondo/lectura.ts", "fondo/manifiesto.ts", "fondo/reparto.ts", "fondo/roles.ts", "fondo/safe.ts", "fondo/saldos.ts", "fondo/transacciones.ts", "fondo/verificacion-eventos.ts", "fondo/verificacion-politica.ts", "fondo/verificacion-simulacion.ts", "fondo/verificar.ts",
    ]);
    const constants = await import("@vaquita/core/fondo/constantes");
    const safe = await import("@vaquita/core/fondo/safe");
    const transactions = await import("@vaquita/core/fondo/transacciones");
    expect(constants.MAX_DESTINATARIOS).toBe(20);
    expect(typeof safe.hashTransaccionSafe).toBe("function");
    const creation = await import("@vaquita/core/fondo/creacion");
    expect(typeof creation.planCreation).toBe("function");
    const roles = await import("@vaquita/core/fondo/roles");
    expect(Object.keys(roles).sort()).toEqual(["buildInitialRules", "condicionesVaqui", "txCambiarDestinatarios", "txCerrarVaqui", "txRevocar"]);
    for (const module of ["errores", "saldos", "cuotas", "reparto", "manifiesto"]) {
      expect(Object.keys(await import(`../src/fondo/${module}.ts`)).length).toBeGreaterThan(0);
    }
    const reader = await import("@vaquita/core/fondo/lectura");
    expect(Object.keys(reader).sort()).toEqual(["FondoReadError", "createFondoReader"]);
    const verifier = await import("@vaquita/core/fondo/verificar");
    expect(Object.keys(verifier)).toEqual(["verificarGrupo"]);
    const events = await import("@vaquita/core/fondo/verificacion-eventos");
    expect(Object.keys(events)).toEqual(["reconstruirPermisos"]);
    const policy = await import("@vaquita/core/fondo/verificacion-politica");
    expect(Object.keys(policy)).toEqual(["compararPermisos"]);
    const simulation = await import("@vaquita/core/fondo/verificacion-simulacion");
    expect(Object.keys(simulation)).toEqual(["comprobarNegativas"]);
    expect(Object.keys(transactions).sort()).toEqual(["aportar", "aprobarHash", "crearSafe", "desplegarRoles", "ejecutarPropuesta"]);
  });

  it("la web recibe TxPersona por import type sin cambiar el flujo de envío", () => {
    const source = readFileSync(new URL("../../../apps/web/src/lib/firmar.ts", import.meta.url), "utf8");
    expect(source).toContain('import type { TxPersona } from "@vaquita/core/fondo/transacciones";');
    expect(source).toContain("firmarYEsperar(tx: TxPersona)");
    expect(source).not.toContain("TxComprador");
  });
});
