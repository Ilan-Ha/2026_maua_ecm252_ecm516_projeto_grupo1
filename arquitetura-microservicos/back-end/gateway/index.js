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

// Rota de cadastro
app.post(path.auth.register, async (req, res) => {
    /*
    Registro
    --------
    envia requisição para servidor de autentificação
    se aceitar -> autentificação envia para gateway requisição do servidor de usuario (fetch gateway/usuario/adicionar)
    gateway recebe faz um post para adicionar usuario
    gateway enviar solicitação para server de usuario
    server de usuario recebe solicitacao, processa e retorna
    gateway devolve retorno ao server de autentificacao
    se for positivo, registra o novo usuario
    gateway retorna ao front*/

    console.log(req.body)
    
    const {event, payload} = req.body
    console.log(event)
    console.log(payload)

    await axios.post(`${config.url}:${svc.auth}${path.auth.register}`, {
      event: event,
      payload: payload
    })
    res.end()
});


// Inicialização do servidor
const startServer = async () => {
  try {
    // se for usar o .env e precisar de uma logica de verificacao
    // if (!process.env.MONGO_URI) {
    //   throw new Error("MONGO_URI não definida no .env");
    // }
    // await mongoose.connect(process.env.MONGO_URI);
    // console.log("Mongo conectado");
    // await initSeed();
    app.listen(PORT, () => {
      console.log(`Rodando em ${config.url}:${PORT}`);
    });
  } catch (err) {
    console.error("Falha ao iniciar servidor:", err);
    process.exit(1);
  }
};
startServer();