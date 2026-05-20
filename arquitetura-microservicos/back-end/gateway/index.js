import express from "express"
import cors from "cors"
import fetch from "node-fetch"
import config from "../config.js";
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
    const {content, message} = response.data
    const status = response.status

    console.log(`Status: ${status}\nContent: ${content}\nMessage: ${message}`)

    return {status, content, message}
}

// Rota de cadastro
app.post(path.auth.register, async (req, res) => {
    
    const {event, payload} = req.body
    console.log(event)
    console.log(payload)

    const response = await axios.post(`${config.url}:${svc.auth}${path.auth.register}`, {
      event: event,
      payload: payload
    })

    const {status, content, message} = returnData(response)

    res.status(status).json({
      content: content,
      message: message
    })
});

// Inicialização do servidor
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