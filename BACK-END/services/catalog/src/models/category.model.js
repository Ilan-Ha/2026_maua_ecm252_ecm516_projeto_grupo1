import mongoose from "mongoose";

const categoriaSchema = new mongoose.Schema({
  nome: String,
  tag: { type: String, unique: true },
  imagem: String,
});

export const Categoria =
  mongoose.models.Categoria || mongoose.model("Categoria", categoriaSchema);
