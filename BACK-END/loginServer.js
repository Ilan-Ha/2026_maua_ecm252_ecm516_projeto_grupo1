import express from 'express'
import cors from 'cors'
import { addItem, retrieveData } from './userDatabaseManager.js'
import config from './config.js'

const svc = config.services.auth;
const end = svc.endpoints;

const app = express()

app.use(cors())

app.use(express.json())

let usuarios = retrieveData().users

const findUser = (email, senha) => {
  return usuarios.find(
    (u) => u.email === email && u.senha === senha
  )
}

const handleExistences = (nome, email) => {
  const emailExiste = usuarios.find(u => u.email === email)
  if (emailExiste) return "Email já cadastrado"

  const nomeExiste = usuarios.find(u => u.nome === nome)
  if (nomeExiste) return "Nome já cadastrado"

  return null
}

app.post(end.login, (req, res) => {
  try {
    const { email, senha } = req.body

    const usuario = findUser(email, senha)

    if (usuario) {
      res.status(200).json({
        message: "Login OK",
        usuario: {
          nome: usuario.nome,
          email: usuario.email
        }
      })
    } else {
      res.status(401).json({
        message: "Credenciais inválidas"
      })
    }

  } catch (error) {
    console.log(error)
    res.status(500).json({
      erro: 'Erro ao encontrar usuario'
    })
  }
})

app.post(end.register, (req, res) => {
  try {
    const { nome, email, senha } = req.body

    const erro = handleExistences(nome, email)

    if (erro) {
      return res.status(409).json({ message: erro })
    }

    const novoUsuario = { nome, email, senha }

    usuarios.push(novoUsuario)
    addItem(novoUsuario)

    console.log("Usuários:", usuarios)

    res.status(200).json({
      message: "Usuário cadastrado"
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      erro: 'Erro ao cadastrar usuario'
    })
  }
})

app.listen(svc.port, () => {
  console.log(`Servidor de login executando em http://localhost:${svc.port}`)
})