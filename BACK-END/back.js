import fs from "fs"
import config from './config.js'
import express from 'express'
import cors from 'cors'
import { getCatalogo, initSeed } from "./productDatabaseManager.js";
//conectando ao banco de dados
import mongoose from "mongoose";
mongoose.connect("mongodb://arthursilvacorreia199_db_user:enxadanodiego321@ac-7wuyakn-shard-00-00.7ybc0ug.mongodb.net:27017,ac-7wuyakn-shard-00-01.7ybc0ug.mongodb.net:27017,ac-7wuyakn-shard-00-02.7ybc0ug.mongodb.net:27017/?ssl=true&replicaSet=atlas-pfy2is-shard-0&authSource=admin&appName=ALLFORONE")
  .then(async () => {
    console.log("Mongo conectado");
    await initSeed();
  })
  .catch(err => console.log(err));
const app = express()
const svc = config.services
// Middlewares
app.use(cors())
// Permite receber JSON direto no req.body
app.use(express.json()) 
// Schema do usuário
const userSchema = new mongoose.Schema({
  nome: String,
  email: String,
  senha: String
});
const User = mongoose.model("User", userSchema);
// =========================
// Rota de cadastro
// =========================
app.post(svc.auth.endpoints.register, async (req, res) => {
  const dados = req.body;
  // verifica se o email já existe
  const emailExiste = await User.findOne({ email: dados.email });
  if (emailExiste) {
    return res.status(409).json({ message: "Email já cadastrado" });
  }
  // verifica se o nome já existe
  const nomeExiste = await User.findOne({ nome: dados.nome });
  if (nomeExiste) {
    return res.status(409).json({ message: "Nome já cadastrado" });
  }
  // cria usuario
  await User.create(dados);
  // mostra no terminal
  res.json({ message: "Usuário cadastrado" });
});
// =========================
// Rota de login
// =========================
app.post(svc.auth.endpoints.login, async (req, res) => {
  const { email, senha } = req.body;
  // procura usuario pelo email
  const usuario = await User.findOne({ email, senha });
  // se achar retorna mensagem de ok
  if (usuario) {
    return res.json({
      message: "Login OK",
      usuario: {
        nome: usuario.nome,
        email: usuario.email
      }
    });
  }
  // se nao achar retorna erro
  return res.status(401).json({
    message: "Credenciais inválidas"
  });
});
// =========================
// Rota de atualização do usuário
// =========================
app.put(svc.user.endpoints.perfil, async (req, res) => {
  const dados = req.body;
  // procura usuario pelo email
  const usuario = await User.findOne({ email: dados.email });
  // se nao achar retorna erro
  if (!usuario) {
    return res.status(404).json({
      message: "Usuário não encontrado"
    });
  }
  // atualiza os dados do usuário
  await User.updateOne(
    { email: dados.email },
    { $set: dados }
  );
  // mostra no terminal
  res.json({ message: "Dados atualizados" });
});
// =========================
// Rota de catalogo
// =========================
app.get(svc.catalog.endpoints.catalog, async (req, res) => {
  try {
    const data = await getCatalogo();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Erro ao carregar catálogo" });
  }
});
// =========================
// Fallback (Erro 404)
// =========================
app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" })
})
// =========================
// Definição da porta
// =========================
const PORT = svc.auth.port
// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Rodando em ${config.url}:${PORT}`)
})