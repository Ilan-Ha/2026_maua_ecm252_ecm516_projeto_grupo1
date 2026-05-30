import * as productService from "../services/product.service.js";

export async function getProductById(req, res) {
  try {
    const produto = await productService.getProdutoById(req.params.id);
    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }
    res.json(produto);
  } catch (err) {
    res.status(400).json({ error: "ID inválido" });
  }
}
