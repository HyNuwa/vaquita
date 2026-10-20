/** Importar por efecto: carga el .env de la raíz del repo, se corra desde donde se corra. */
import { config } from "dotenv";
import { ENV_FILE } from "./paths.js";

config({ path: ENV_FILE });
