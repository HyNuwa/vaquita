import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "dotenv";

// El .env vive solo en la raíz del repo; en Vercel estas variables vienen del entorno.
// Se leen solo estas dos, públicas: la clave del agente nunca entra al proceso de la web.
const raiz = resolve(import.meta.dirname, "../../.env");
const local = existsSync(raiz) ? parse(readFileSync(raiz)) : {};
const leer = (nombre) => process.env[nombre] ?? local[nombre] ?? "";

/** @type {import("next").NextConfig} */
const config = {
  transpilePackages: ["@vaquita/core"],
  env: {
    NEXT_PUBLIC_WC_PROJECT_ID: leer("NEXT_PUBLIC_WC_PROJECT_ID"),
    NEXT_PUBLIC_ATTRIBUTION_CODE: leer("ATTRIBUTION_CODE"),
  },
  webpack(webpack) {
    // El core es TypeScript fuente y sus imports terminan en .js.
    webpack.resolve.extensionAlias = { ".js": [".ts", ".js"] };
    webpack.resolve.alias = {
      ...webpack.resolve.alias,
      // Lo trae el conector de Base de wagmi, que no usamos, y pide paquetes opcionales que no están.
      "@coinbase/cdp-sdk": false,
      // Opcionales de MetaMask y de los logs de WalletConnect, que en el navegador no hacen falta.
      "@react-native-async-storage/async-storage": false,
      "pino-pretty": false,
    };
    return webpack;
  },
};

export default config;
