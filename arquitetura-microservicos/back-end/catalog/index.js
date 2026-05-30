import express from "express"
import cors from "cors"
import axios from "axios" 
import mongoose from "mongoose"
import config from "../utlis/config.js";
import { initSeed, getCatalogo, getProdutoById } from "./productDBManager.js";
// .env compartilhado e proprio
import getDirname from "../utlis/getDirname.js";
import loadEnv from "../utlis/loadEnv.js";
import { timeStamp } from "node:console"

loadEnv(getDirname(import.meta.url))

// #region app
const app = express();
// Middlewares
app.use(cors());
// Permite receber JSON direto no req.body
app.use(express.json());
// #endregion

// #region configurações vindas do config.js
const svc = config.ports.back
const paths = config.paths
const PORT = svc.catalog
const events = config.events
const request = config.requests
// #endregion

// #region padrão de resposta de erro interno e externo
const respostaErro = ({e,status,message}) => {
  return {  
            error: true,
            status: status? 
              status : 
              e.response?.status || 500,
            message: message?
              message :
              e.response?.data || "Erro interno de servidor auth"
        }
}
// #endregion

// #region rota de pegar catalogo
app.get(paths.catalog.catalog, async (req,res) => {
    try {
        const data = await getCatalogo()

        return res.json({
            error: false,
            status: 200,
            content: data
        })

    } catch (e) {
        return res.json(respostaErro({e, message: "Erro ao carregar catálogo"}))
    }
})
// #endregion

// #region rota de produto por ID
app.get(paths.catalog.product, async (req, res) => {
    const {id} = req.query

    try {
        const produto = await getProdutoById(id)
        if(!produto){
            return res.json(respostaErro({status: 404, message: "Produto não encontrado"}))
        }
        else{
            return res.json({
                error: false,
                status: 200,
                content: produto
            })
        }
    } catch (e) {
        return res.json(respostaErro({status: 400, message: "ID inválido"}))
    }
})
// #endregion

// #region Inicialização do servidor
const startServer = async () => {
  try {
    //se for usar o .env e precisar de uma logica de verificacao
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI não definida no .env");
    }
    await mongoose.connect(process.env.MONGO_URI,
      {
        dbName: "test"
      }
    );
    console.log("Mongo conectado");
    await initSeed();

    const server = app.listen(PORT, () => {
      console.log(`Rodando em ${config.url}:${PORT}`)

    });

      console.log("Serviço de catalogo inscrito")
      
      return server

  } catch (err) {
    console.error("Falha ao iniciar servidor:", err);
    process.exit(1);
  }
};

let servidor

startServer()
 .then(server => {
   servidor = server
 })
// #endregion