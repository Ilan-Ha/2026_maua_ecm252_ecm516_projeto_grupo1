import express from 'express'
import cors from 'cors'
import { addItem, retrieveData } from './userDatabaseManager.js'

const app = express()

app.use(cors())
app.use(express.json())

let usuarios = retrieveData().users

const handleExistences = (nome, email) => {
  const emailExiste = usuarios.find(u => u.email === email)
  if (emailExiste) return "Email já cadastrado"

  const nomeExiste = usuarios.find(u => u.nome === nome)
  if (nomeExiste) return "Nome já cadastrado"

  return null
}

app.post('/cadastro', (req, res) => {
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

app.listen(3000, () => {
  console.log('Servidor de Cadastro em http://localhost:3000')
})