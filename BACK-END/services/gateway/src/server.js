import express from "express";
import cors from "cors";
import config, { PORT } from "./config.js";
import routes from "./routes/index.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

app.listen(PORT, () => {
  console.log(`[gateway] Rodando em ${config.gateway.baseUrl}`);
  console.log(`[gateway] Catalog → ${config.services.catalog.baseUrl}`);
  console.log(`[gateway] Legacy  → ${config.legacy.baseUrl}`);
});
