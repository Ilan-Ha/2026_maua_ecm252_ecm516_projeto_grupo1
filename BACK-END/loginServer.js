import express from 'express'
import cors from 'cors'
import { retrieveData } from './userDatabaseManager.js'

const app = express()

app.use(cors())

app.use(express.json())

let usuarios = retrieveData().users

const findUser = (email, senha) => {
  return usuarios.find(
    (u) => u.email === email && u.senha === senha
  )
}

app.post('/login', (req, res) => {
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

app.listen(3001, () => {
  console.log("Servidor rodando em http://localhost:3001")
})