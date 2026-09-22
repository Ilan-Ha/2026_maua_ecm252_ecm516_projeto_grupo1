import path from "path";
import dotenv from "dotenv";

export default function loadEnv(serviceDir) {
  const candidatePaths = [
    path.join(serviceDir, "../../../.env"),
    path.join(serviceDir, "../../.env"),
    path.join(serviceDir, "../.env"),
    path.join(serviceDir, ".env"),
  ];

  for (const envPath of candidatePaths) {
    dotenv.config({ path: envPath, override: true });
  }
}