import { addItem, retrieveData, updateItem } from './userDatabaseManager.js'
import fs from "fs"
import config from './config.js'
// Arquivo Principal do Backend
import express from 'express'
import cors from 'cors'
// Criação do servidor
const app = express()
const svc = config.services
// Middlewares
app.use(cors())
// Permite receber JSON direto no req.body
app.use(express.json()) 
// =========================
// Rota de cadastro
// =========================
app.post(svc.auth.endpoints.register, (req, res) => {
  // Recebe DataBase
  let usuarios = retrieveData().users
  // Recebe os dados do front-end
  const dados = req.body
  // Verifica se veio JSON válido
  if (!dados) {
    return res.status(400).json({ error: "JSON inválido" })
  }
  // Verifica se já existe usuário com mesmo email
  const emailExiste = usuarios.find(u => u.email === dados.email)
  if (emailExiste) {
    return res.status(409).json({ message: "Email já cadastrado" })
  }
  // Verifica se já existe usuário com mesmo nome
  const nomeExiste = usuarios.find(u => u.nome === dados.nome)
  if (nomeExiste) {
    return res.status(409).json({ message: "Nome já cadastrado" })
  }
  // Salva em memória
  usuarios.push(dados)
  addItem(dados)
  console.log("Usuários:", usuarios)
  // Resposta ao front-end
  res.json({
    message: "Usuário cadastrado"
  })
})
// =========================
// Rota de login
// =========================
app.post(svc.auth.endpoints.login, (req, res) => {
  // Recebe DataBase
  let usuarios = retrieveData().users
  // Recebe os dados do front-end
  const { email, senha } = req.body
  // Verifica se o usuário existe
  const usuario = usuarios.find(
    (u) => u.email === email && u.senha === senha
  )
  // Se o usuário existe
  if (usuario) {
    return res.json({
      message: "Login OK",
      usuario: {
        nome: usuario.nome,
        email: usuario.email
      }
    })
  } else {
    return res.status(401).json({
      message: "Credenciais inválidas"
    })
  }
})
// =========================
// Rota de atualização do usuário
// =========================
app.put(svc.user.endpoints.perfil, (req, res) => {
  // Recebe DataBase
  let usuarios = retrieveData().users
  // Recebe os dados do front-end
  const dados = req.body
  const { email, nome, senha } = dados
  // procura usuário pelo email
  const usuario = usuarios.find(u => u.email === email)
  // Se o usuário não existe
  if (!usuario) {
    return res.status(404).json({
      message: "Usuário não encontrado"
    })
  }
  // Salva em memória
  // atualiza campos
  updateItem(usuario.email, dados)
  // Atualiza os dados do usuário no cache atual
  usuarios = retrieveData().users
  // Mostra no terminal
  console.log("Usuário atualizado:", dados)
  // Resposta ao front-end
  res.json({
    message: "Dados atualizados"
  })
})
// =========================
// Rota de catalogo
// =========================
app.get(svc.catalog.endpoints.catalog, (req, res) => {
  try {
    const data = fs.readFileSync("tempLoginDatabase.json", "utf-8")
    res.json(JSON.parse(data))
  } catch (err) {
    res.status(500).json({ error: "Failed to load catalog" })
  }
})
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