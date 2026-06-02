import express from "express"
import cors from "cors"
import axios from "axios" 
import mongoose from "mongoose"
import config from "../../utlis/config.js";

// .env compartilhado e proprio
import getDirname from "../../utlis/getDirname.js";
import loadEnv from "../../utlis/loadEnv.js";
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
const PORT = svc.history
const events = config.events
const request = config.requests
// #endregion

// #region schemas
const historySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {timestamps: true, collection: 'history'})
// chave primaria
historySchema.index({userId: 1, productId: 1, cretedAt: 1}, {unique: true})

const History = mongoose.model("History", historySchema)
// #endregion
// #region request-bus
const sendRequest = `${config.url}:${svc.requestBus}${paths.requests.request}`

// tratamento de eventos
const requestFunctions = {}
// #endregion

// #region event-bus
const sendEvent = `${config.url}:${svc.eventBus}${paths.events.event}`
const calbackUrl = `${config.url}:${PORT}${paths.events.event}`
const serverName = 'product user search history'

// eventos para se inscrever
const subscribe = []

// tratamento de eventos
const eventFunctions = {}
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

// #region rota registro historico
app.post(paths.history.history, async(req,res) => {
    const {payload} = req.body
    const{userId,productId} = payload
    // pesquisa se o usuarios existe
    try{
        const result = await axios.post(sendRequest,
            {
                request: request.user.exist,
                payload:{
                    userId: userId
                }
            }
        )
        const {error, message, status} = result.data
      // caso o servidor de usuario retorne que o nome é invalido
      if(error){
        return res.json(respostaErro({status,message}))
      }
    }catch(e){
        return res.json(respostaErro({e}))
    }

    // pesquisa se o produto existe
    try{
        const result = await axios.post(sendRequest,
            {
                request: request.catalog.product.exist,
                payload:{
                    productId: productId
                }
            }
        )
        const {error, message, status} = result.data
      // caso o servidor de usuario retorne que o nome é invalido
      if(error){
        return res.json(respostaErro({status,message}))
      }
    }catch(e){
        return res.json(respostaErro({e}))
    }
    try {
        const his = await History.create({
            userId,
            productId
        })
        return res.json({
            error: false,
            status: 200,
            message: "Acesso registrado"
        })
    } catch (e) {
        return res.json(respostaErro({e, status: 400}))
    }
})
// #endregion

// #region endpoint de eventos
app.post(paths.events.event, (req, res) => {
  const { event, payload } = req.body;
  //console.log(event)
  //console.log(payload)
  try {
    eventFunctions[event](payload)
  } catch (e) {}

  return res.end()
})
// #endregion

// #region endpoint de requisições
app.post(paths.requests.request, async (req, res) => {
  const {request, payload} = req.body
     //console.log(payload)
     //console.log(request)
  try{
    const result = await requestFunctions[request](payload)
    //console.log(result)
    //console.log(result)
      return res.json({
          values: result
        })
    
    
  } catch (e) {
    return res.json({
      content: {
            error: true,
            status: 404,
            message: "Requisição desconhecida"
        }
    })
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
            dbName: "userProductHistory"
          }
        );
        console.log("Mongo conectado");

    const server = app.listen(PORT, () => {
      console.log(`Rodando em ${config.url}:${PORT}`)

      console.log(subscribe)
    });

    // registro no bus de eventos
      await axios.post(`${config.url}:${svc.eventBus}${paths.events.subscribe}`,{
          calbackUrl: calbackUrl,
          serviceName: serverName,
          events: subscribe
      })
      
      console.log("Serviço de historico inscrito")

      return server
  } catch (err) {
    console.error("Falha ao iniciar servidor:", err);
    process.exit(1);
  }
};

let servidor

async function gracefulShutdown(signal) {
  await axios.post(`${config.url}:${svc.eventBus}${paths.events.unsubscribe}`,{
          calbackUrl: calbackUrl,
          serviceName: serverName,
          events: subscribe
      })
  await servidor.close()
  process.exit(0)
}

// sinais escutados para o fechamento
process.on('SIGTERM', () => gracefulShutdown('SIGTERM')) // solicitacao de fechamento generica
process.on('SIGINT', () => gracefulShutdown('SIGINT')) // solicitacao interativa (Ctrl + C)
process.once('SIGUSR2', function () {
  gracefulShutdown('SIGUSR2')
  process.kill(process.pid, 'SIGUSR2');
}); // codigo do nodemon

startServer()
 .then(server => {
   servidor = server
 })
// #endregion
