import express from "express"
import cors from "cors"
import fetch from "node-fetch"
import config from "../utlis/config.js"
import axios from "axios" 

/* 
Falta
-----
fs
catalogo
dotenv -> env
moongose
*/
const svc = config.ports.back
const path = config.paths
const PORT = svc.gateway

const app = express();
// Middlewares
app.use(cors());
// Permite receber JSON direto no req.body
app.use(express.json());

// dados de retorno
const returnData = (response) => {
    const {error, content, message, status} = response.data

    //console.log(`Erro?: ${error}\nStatus: ${status}\nContent: ${content}\nMessage: ${message}`)

    return {error, status, content, message}
}

const funcoesRequest = {
  [path.auth.register]: async (payload) => {
    const response = await axios.post(`${config.url}:${svc.auth}${path.auth.register}`, {
      payload: payload
    })
    return response
  },
  [path.auth.login]: async (payload) => {
    const response = await axios.post(`${config.url}:${svc.auth}${path.auth.login}`, {
      payload: payload
    })
    return response
  },
  [path.auth.update.password]: async (payload) => {
    const response = await axios.post(`${config.url}:${svc.auth}${path.auth.update.password}`, {
      payload: payload
    })
    return response
  }
}
// #region Rota de cadastro
app.post(path.gateway.request, async (req, res) => {
    
    const {request,payload} = req.body
    //console.log(payload)

    const response = await funcoesRequest[request](payload)

    const {error, status, content, message} = returnData(response)

    return res.status(status).json({
      error: error,
      content: content,
      message: message
    })
});
// #endregion

// #region Inicialização do servidor
const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Rodando em ${config.url}:${PORT}`);
    });
  } catch (err) {
    console.error("Falha ao iniciar servidor:", err);
    process.exit(1);
  }
};
startServer();
// #endregion