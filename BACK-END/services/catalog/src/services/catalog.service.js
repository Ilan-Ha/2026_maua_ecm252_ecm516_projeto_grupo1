import { Categoria } from "../models/category.model.js";
import { Produto } from "../models/product.model.js";

export async function getCatalogo() {
  const [categorias, produtos] = await Promise.all([
    Categoria.find(),
    Produto.find(),
  ]);

  const itens = {};

  for (const cat of categorias) {
    itens[cat.tag.trim()] = [];
  }

  for (const prod of produtos) {
    const key = prod.categoriaTag?.trim();
    if (!key) continue;
    if (!itens[key]) itens[key] = [];
    itens[key].push(prod);
  }

  return {
    Categorias: categorias,
    Itens: itens,
  };
}
