import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

// Conexão com MongoDB
await mongoose.connect(process.env.MONGO_URI);

// Schema (igual ao que você já usa)
const produtoSchema = new mongoose.Schema({
  nome: String,
  imagem: String,
  categoriaTag: String,
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
      link: String
    }
  ]
});

// Model
const Produto = mongoose.model("Produto", produtoSchema);

// Função para deletar
async function deletarProduto() {
  try {
    const resultado = await Produto.deleteOne({
      nome: "Geladeira Panasonic Econavi 480L"
    });

    if (resultado.deletedCount > 0) {
      console.log("✅ Produto deletado com sucesso!");
    } else {
      console.log("⚠️ Nenhum produto encontrado com esse nome.");
    }
  } catch (erro) {
    console.error("❌ Erro ao deletar:", erro);
  } finally {
    mongoose.connection.close();
  }
}

// Executa
deletarProduto();