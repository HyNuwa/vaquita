import { pathToFileURL } from "node:url";
import { createPublicClient, http, keccak256, type Address, type Hex } from "viem";
import { assertModuloPermitido, contratosFondo } from "../src/config/fondo-contratos.js";

type ContractTable = Record<string, { address: Address; codeHash: Hex }>;
type Reader = {
  getChainId(): Promise<number>;
  getCode(args: { address: Address }): Promise<Hex | undefined>;
};

/** Solo lectura. Las dependencias explícitas permiten probar sin red ni claves. */
export async function runContractCheck(options: {
  reader: Reader;
  contracts?: ContractTable;
  stdout: (line: string) => void;
  stderr: (line: string) => void;
}): Promise<0 | 1> {
  const contracts = options.contracts ?? contratosFondo(42220);
  const { reader, stdout, stderr } = options;
  // No alcanza con validar solo Roles: ninguna entrada configurada puede estar prohibida.
  try {
    for (const entry of Object.values(contracts)) assertModuloPermitido(entry.address);
  } catch {
    stderr("Error: la configuración contiene una dirección inválida o prohibida.");
    return 1;
  }
  let chainId: number;
  try { chainId = await reader.getChainId(); }
  catch {
    stderr("Error: no se pudo consultar la red del RPC.");
    return 1;
  }
  if (chainId !== 42220) {
    stderr("Error: el RPC debe responder con chainId 42220.");
    return 1;
  }
  stdout("Contrato | Dirección | Hash esperado | Hash observado | Resultado");
  let exitCode: 0 | 1 = 0;
  for (const [name, entry] of Object.entries(contracts)) {
    let observed: string;
    let result: string;
    try {
      const code = await reader.getCode({ address: entry.address });
      observed = !code || code === "0x" ? "sin código" : keccak256(code);
      result = observed === entry.codeHash ? "OK" : "NO COINCIDE";
    } catch {
      // Un error del transporte puede contener el endpoint y sus credenciales.
      observed = "error de lectura";
      result = "ERROR";
    }
    if (result !== "OK") exitCode = 1;
    stdout(`${name} | ${entry.address} | ${entry.codeHash} | ${observed} | ${result}`);
  }
  // Decisión explícita: no importar Zodiac aunque quede instalado de forma transitiva.
  stderr("Pendiente humano: sanityCheckZodiacModuleAddress (Zodiac 5.0.1 retirado por alertas de seguridad).");
  return exitCode;
}

async function main(): Promise<void> {
  const client = createPublicClient({
    transport: http(process.env.CELO_RPC_URL ?? "https://forno.celo.org", {
      retryCount: 0, timeout: 30000,
    }),
  });
  process.exitCode = await runContractCheck({
    reader: client, stdout: line => console.log(line), stderr: line => console.error(line),
  });
}

// Importar el módulo no carga configuración de archivos, abre red ni ejecuta el CLI.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(() => {
    console.error("Error: no se pudo iniciar la verificación de contratos.");
    process.exitCode = 1;
  });
}
