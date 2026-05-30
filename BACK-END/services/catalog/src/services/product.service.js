import { Produto } from "../models/product.model.js";

export async function getProdutoById(id) {
  return Produto.findById(id);
}
