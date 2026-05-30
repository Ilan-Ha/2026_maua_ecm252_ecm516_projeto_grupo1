import * as catalogService from "../services/catalog.service.js";

export async function getCatalog(req, res) {
  try {
    const data = await catalogService.getCatalogo();
    res.json(data);
  } catch (err) {
    console.error("[catalog] Erro ao carregar catálogo:", err);
    res.status(500).json({ error: "Erro ao carregar catálogo" });
  }
}
