import { readFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const SRC = fileURLToPath(new URL("../src/", import.meta.url));
const ROOTS = ["fondo/constantes.ts", "fondo/safe.ts", "fondo/transacciones.ts"];

/** Inspecciona fuentes del core antes de permitir su importación pública. */
function browserClosure(): Set<string> {
  const visited = new Set<string>();
  function visit(file: string): void {
    if (visited.has(file)) return;
    expect(file.startsWith(SRC)).toBe(true);
    visited.add(file);
    const source = readFileSync(file, "utf8");
    // No eval, require, imports dinámicos ni accesos a entorno/red en este núcleo puro.
    expect(source).not.toMatch(/\b(?:process|fetch|XMLHttpRequest|require|eval)\s*[.(]|\bimport\s*\(/);
    const imports = [...source.matchAll(/\b(?:import|export)\s+(?:[^;]*?\s+from\s+)?["']([^"']+)["']/g)];
    for (const match of imports) {
      const specifier = match[1]!;
      if (specifier.startsWith(".")) {
        const dependency = resolve(dirname(file), specifier.replace(/\.js$/, ".ts"));
        // Lista cerrada: ningún adaptador nuevo puede colarse en el recorrido.
        expect(relative(SRC, dependency).replaceAll("\\", "/")).toMatch(
          /^(?:fondo\/(?:constantes|safe|transacciones|abis)|config\/tokens|attribution\/tag)\.ts$/,
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

describe("frontera navegador de la primera unidad S2", () => {
  it("recorre las dependencias del core y luego importa los tres módulos públicos", async () => {
    const closure = browserClosure();
    expect([...closure].map((file) => relative(SRC, file).replaceAll("\\", "/")).sort()).toEqual([
      "attribution/tag.ts", "config/tokens.ts", "fondo/abis.ts", "fondo/constantes.ts",
      "fondo/safe.ts", "fondo/transacciones.ts",
    ]);
    const constants = await import("@vaquita/core/fondo/constantes");
    const safe = await import("@vaquita/core/fondo/safe");
    const transactions = await import("@vaquita/core/fondo/transacciones");
    expect(constants.MAX_DESTINATARIOS).toBe(20);
    expect(typeof safe.hashTransaccionSafe).toBe("function");
    expect(Object.keys(transactions).sort()).toEqual(["aportar", "aprobarHash", "ejecutarPropuesta"]);
  });

  it("la web recibe TxPersona por import type sin cambiar el flujo de envío", () => {
    const source = readFileSync(new URL("../../../apps/web/src/lib/firmar.ts", import.meta.url), "utf8");
    expect(source).toContain('import type { TxPersona } from "@vaquita/core/fondo/transacciones";');
    expect(source).toContain("firmarYEsperar(tx: TxPersona)");
    expect(source).not.toContain("TxComprador");
  });
});
