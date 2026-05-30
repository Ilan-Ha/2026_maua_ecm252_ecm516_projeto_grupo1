import mongoose from "mongoose";

const produtoSchema = new mongoose.Schema({
  nome: String,
  imagem: String,
  categoriaTag: { type: String, index: true },
  descricao: String,
  precoMedio: Number,
  lancamento: Number,
  marca: String,
  imagens: [String],
  especificacoes: Object,
  sitesCompra: [
    {
      loja: String,
      preco: Number,
      link: String,
    },
  ],
});

export const Produto =
  mongoose.models.Produto || mongoose.model("Produto", produtoSchema);
