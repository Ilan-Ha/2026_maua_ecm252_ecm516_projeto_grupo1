import fs from "fs"
import config from './config.js'
import express from 'express'
import cors from 'cors'
import { getCatalogo, initSeed } from "./productDatabaseManager.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
mongoose.set("strictQuery", true);
dotenv.config({ path: "../.env" });
const app = express()
const svc = config.services
const PORT = svc.auth.port
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
// Rota de cadastro
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
// Rota de login
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
// Rota de atualização do usuário
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
// Rota de catalogo
app.get(svc.catalog.endpoints.catalog, async (req, res) => {
  try {
    const data = await getCatalogo();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Erro ao carregar catálogo" });
  }
});
//status do backend e do banco de dados
app.get("/health", async (req, res) => {
  const dbOk = mongoose.connection.readyState === 1;
  res.json({
    backend: true,
    db: dbOk,
    status: dbOk ? "ok" : "degraded"
  });
});
app.get("/health/db", async (req, res) => {
  const ok = mongoose.connection.readyState === 1;
  res.json({
    db: ok,
    status: ok ? "ok" : "error"
  });
});
// Fallback (Erro 404)
app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" })
})
// Inicialização do servidor
const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI não definida no .env");
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo conectado");
    await initSeed();
    app.listen(PORT, () => {
      console.log(`Rodando em ${config.url}:${PORT}`);
    });
  } catch (err) {
    console.error("Falha ao iniciar servidor:", err);
    process.exit(1);
  }
};
startServer();