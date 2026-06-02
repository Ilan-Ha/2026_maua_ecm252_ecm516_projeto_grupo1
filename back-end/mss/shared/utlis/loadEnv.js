import path from "path";
import dotenv from "dotenv";

export default function loadEnv(serviceDir) {

  dotenv.config({
    path: path.join(serviceDir, "../.env")
  });

  dotenv.config({
    path: path.join(serviceDir, ".env"),
    override: true
  });

}