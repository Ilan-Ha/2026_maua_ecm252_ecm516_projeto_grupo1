import express from "express";
import cors from "cors";
import config, { PORT } from "./config.js";
import { connectDatabase } from "./db/connection.js";
import { initSeed } from "./services/seed.service.js";
import routes from "./routes/index.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

async function startServer() {
  try {
    await connectDatabase();
    await initSeed();
    app.listen(PORT, () => {
      console.log(
        `[catalog] Rodando em ${config.services.catalog.baseUrl}`
      );
    });
  } catch (err) {
    console.error("[catalog] Falha ao iniciar:", err);
    process.exit(1);
  }
}

startServer();
