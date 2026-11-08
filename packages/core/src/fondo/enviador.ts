import { forkSender, type ForkSenderDeps } from "../chain/fork-sender.js";
import { broadcast, prepareTaggedTx, type SenderDeps } from "../chain/tagged-sender.js";

type Selection =
  | { mode?: "normal"; deps: SenderDeps }
  | { mode: "fork"; deps: ForkSenderDeps; env: Readonly<{ E2E_FORK?: string | undefined; LIVE_PAYMENTS?: string | undefined }> };

/** Las apps usan este selector; el entorno se inyecta, no se carga desde acá. */
export function enviador(selection: Selection) {
  if (selection.mode === "fork") {
    if (selection.env.E2E_FORK !== "1" || "LIVE_PAYMENTS" in selection.env) {
      throw new Error("El fork requiere E2E_FORK=1 y LIVE_PAYMENTS ausente.");
    }
    return forkSender(selection.deps);
  }
  const { deps } = selection;
  return {
    prepare: (call: Parameters<typeof prepareTaggedTx>[1]) => prepareTaggedTx(deps, call),
    broadcast: (signedTx: Parameters<typeof broadcast>[1]) => broadcast(deps, signedTx),
  };
}
