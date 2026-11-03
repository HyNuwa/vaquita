"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { autorizarCampana } from "@vaquita/core/compra/firmas";
import { useState } from "react";
import { getAddress } from "viem";
import { useAccount } from "wagmi";
import { firmarYEsperar, type ResultadoFirma } from "@/lib/firmar";

// Campaña del spike, ya ejecutada (docs/pruebas/spike.md). Autorizarla en cero no le permite cobrar nada.
const CAMPANA_DE_PRUEBA = getAddress("0x803bcbBD2E99f4e71bdE806F83aD3d9aC03B1B99");

const MENSAJES: Record<ResultadoFirma["estado"], string> = {
  confirmada: "Listo: la transacción se confirmó.",
  fallida: "La transacción se confirmó con un error. No se autorizó nada.",
  reemplazada: "Cancelaste o cambiaste la transacción desde tu billetera. Esta firma no se aplicó.",
  pendiente: "Se envió, pero todavía no se confirmó. Revisá el enlace en unos minutos antes de volver a firmar.",
  rechazada: "Rechazaste la firma en tu billetera. No se hizo nada.",
  "sin-enviar": "No se pudo enviar a tu billetera. No se hizo nada; probá de nuevo.",
};

type Estado = { tipo: "inicio" } | { tipo: "firmando" } | { tipo: "listo"; resultado: ResultadoFirma };

export default function PruebaFirma() {
  const { isConnected } = useAccount();
  const [estado, setEstado] = useState<Estado>({ tipo: "inicio" });

  async function firmar() {
    setEstado({ tipo: "firmando" });
    try {
      const tx = autorizarCampana(CAMPANA_DE_PRUEBA, 0n, process.env.NEXT_PUBLIC_ATTRIBUTION_CODE ?? "");
      setEstado({ tipo: "listo", resultado: await firmarYEsperar(tx) });
    } catch {
      // El core no armó la transacción: nunca llegó a la billetera.
      setEstado({ tipo: "listo", resultado: { estado: "sin-enviar" } });
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
        <div role="status">
          <p>{MENSAJES[estado.resultado.estado]}</p>
          {"hash" in estado.resultado && (
            <p style={{ overflowWrap: "anywhere" }}>
              <a href={`https://celoscan.io/tx/${estado.resultado.hash}`} target="_blank" rel="noreferrer">
                Ver la transacción
              </a>
            </p>
          )}
        </div>
      )}
    </main>
  );
}
