"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { autorizarCampana } from "@vaquita/core/compra/firmas";
import { useState } from "react";
import { getAddress, type Hex } from "viem";
import { useAccount } from "wagmi";
import { firmarYEsperar } from "@/lib/firmar";

// Campaña del spike, ya ejecutada (docs/pruebas/spike.md). Autorizarla en cero no le permite cobrar nada.
const CAMPANA_DE_PRUEBA = getAddress("0x803bcbBD2E99f4e71bdE806F83aD3d9aC03B1B99");

type Estado =
  | { tipo: "inicio" }
  | { tipo: "firmando" }
  | { tipo: "listo"; hash: Hex; ok: boolean }
  | { tipo: "error"; mensaje: string };

export default function PruebaFirma() {
  const { isConnected } = useAccount();
  const [estado, setEstado] = useState<Estado>({ tipo: "inicio" });

  async function firmar() {
    setEstado({ tipo: "firmando" });
    try {
      const tx = autorizarCampana(CAMPANA_DE_PRUEBA, 0n, process.env.NEXT_PUBLIC_ATTRIBUTION_CODE ?? "");
      setEstado({ tipo: "listo", ...(await firmarYEsperar(tx)) });
    } catch (e) {
      const corto = (e as { shortMessage?: string }).shortMessage;
      setEstado({ tipo: "error", mensaje: corto ?? (e as Error).message });
    }
  }

  return (
    <main style={{ maxWidth: 520, margin: "0 auto", padding: 16 }}>
      <h1>Prueba de firma</h1>
      <p>Autorizás $ 0 en pesos digitales. No se mueve plata; tu billetera cobra solo la comisión de la red.</p>
      <ConnectButton label="Conectar billetera" showBalance={false} chainStatus="none" />
      {isConnected && (
        <p>
          <button onClick={firmar} disabled={estado.tipo === "firmando"} style={{ padding: "12px 16px", fontSize: 16 }}>
            {estado.tipo === "firmando" ? "Confirmá en tu billetera…" : "Firmar autorización de $ 0"}
          </button>
        </p>
      )}
      {estado.tipo === "listo" && (
        <div>
          <p>{estado.ok ? "Listo: la transacción se confirmó." : "La transacción se confirmó con error."}</p>
          <p style={{ overflowWrap: "anywhere" }}>
            <a href={`https://celoscan.io/tx/${estado.hash}`} target="_blank" rel="noreferrer">
              {estado.hash}
            </a>
          </p>
        </div>
      )}
      {estado.tipo === "error" && <p role="alert">No se pudo firmar: {estado.mensaje}</p>}
    </main>
  );
}
