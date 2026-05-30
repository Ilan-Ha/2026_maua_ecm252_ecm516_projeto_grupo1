import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import sharedConfig from "../../../../api-shared-config.json" with { type: "json" };

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });

export const PORT = Number(process.env.PORT) || sharedConfig.services.catalog.port;
export const endpoints = sharedConfig.services.catalog.endpoints;
export default sharedConfig;
