// esse arquivo representa o velho index que tinhamos

import express from "express"
import cors from "cors"
import axios from "axios" 
import mongoose from "mongoose"
import config from "../../../shared/utils/config.js"
import { initSeed, getCatalogo, getProdutoById } from "../db/catalogDBManager.ts";
import getDirname from "../../../shared/utils/getDirname.js";
import loadEnv from "../../../shared/utils/loadEnv.js";
import {
    handleRouteError,
    logAppError,
    respostaErroApp,
} from "../../../shared/errors/index.ts";
import {
    validarCampoObrigatorio,
    validarObjectId,
    validarPayload,
} from "../../../shared/utils/routeValidation.ts";

loadEnv(getDirname(import.meta.url))

// #region app
const app: any = express();
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
const serverName = 'catalog'
// #endregion

// #region request-bus
const sendRequest = `${config.url}:${svc.requestBus}${paths.requests.request}`

// tratamento de eventos
const requestFunctions = {
  [request.catalog.product.exist]: async (payload) => {
    try {
      const dados = validarPayload(payload)
      const productId = validarObjectId(dados.productId, "productId")
      const produto = await getProdutoById(productId)
      if (!produto) {
        return {
          error: true,
          status: 404,
          message: "Produto não encontrado",
        }
      }
      return { error: false }
    } catch (e) {
      logAppError(e, { service: serverName, operation: request.catalog.product.exist })
      try {
        return respostaErroApp(e)
      } catch {
        return { error: true, status: 500, message: "Erro interno de servidor catalog" }
      }
    }
  }
}
// #endregion

// #region event-bus
const sendEvent = `${config.url}:${svc.eventBus}${paths.events.event}`
const calbackUrl = `${config.url}:${PORT}${paths.events.event}`

// eventos para se inscrever
const subscribe = []

// tratamento de eventos
const eventFunctions = {}
// #endregion

// #region padrão de resposta de erro interno e externo
const respostaErro = ({e,status,message}: {e?: any; status?: number; message?: string;}) => {
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
        return res.json(handleRouteError(e, { service: serverName, route: paths.catalog.catalog }, () =>
            respostaErro({ e, message: "Erro ao carregar catálogo" })
        ))
    }
})
// #endregion

// #region rota de produto por ID
app.get(paths.catalog.product, async (req, res) => {
    try {
        const id = validarObjectId(req.query.id, "id")
        const produto = await getProdutoById(id)
        if (!produto) {
            return res.json(respostaErro({ status: 404, message: "Produto não encontrado" }))
        }
        return res.json({
            error: false,
            status: 200,
            content: produto,
        })
    } catch (e) {
        return res.json(handleRouteError(e, { service: serverName, route: paths.catalog.product }, () =>
            respostaErro({ status: 400, message: "ID inválido" })
        ))
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
  const { request: reqName, payload } = req.body
  try {
    validarCampoObrigatorio(reqName, "request")
    if (!requestFunctions[reqName]) {
      return res.json({
        content: {
          error: true,
          status: 404,
          message: "Requisição desconhecida",
        },
      })
    }
    const result = await requestFunctions[reqName](payload)
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
        dbName: "test"
      }
    );
    console.log("Mongo conectado");
    await initSeed();

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

      console.log("Serviço de catalogo inscrito")
      
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