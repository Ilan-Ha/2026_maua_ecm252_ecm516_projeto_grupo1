import express from 'express'
import cors from 'cors'
import { retrieveData, updateItem } from './userDatabaseManager.js'

const app = express()

app.use(cors())
app.use(express.json())

let usuarios = retrieveData().users

app.put('/usuario', (req, res) => {
  try {
    const { email, nome, senha } = req.body

    const usuario = usuarios.find(u => u.email === email)

    if (!usuario) {
      return res.status(404).json({
        message: "Usuário não encontrado"
      })
    }

    const dadosAtualizados = { nome, email, senha }

    updateItem(email, dadosAtualizados)

    usuarios = retrieveData().users

    console.log("Usuário atualizado:", dadosAtualizados)

    res.status(200).json({
      message: "Dados atualizados"
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      erro: 'Erro ao atualizar usuario'
    })
  }
})

app.listen(3002, () => {
  console.log('Servidor de Usuario em http://localhost:3002')
})