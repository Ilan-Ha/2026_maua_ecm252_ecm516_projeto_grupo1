import express from "express"
import cors from "cors"
import axios from "axios" 
import config from "../utlis/config.js";

// .env compartilhado e proprio
import getDirname from "../utlis/getDirname.js";
import loadEnv from "../utlis/loadEnv.js";

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
const PORT = svc.search
const events = config.events
const request = config.requests
// #endregion

// #region request-bus
const sendRequest = `${config.url}:${svc.requestBus}${paths.requests.request}`

// tratamento de eventos
const requestFunctions = {}
// #endregion

// #region event-bus
const sendEvent = `${config.url}:${svc.eventBus}${paths.events.event}`
const calbackUrl = `${config.url}:${PORT}${paths.events.event}`
const serverName = 'search'

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
              e.response?.data || "Erro interno de servidor search"
        }
}
// #endregion

// #region rota de comparação
app.get(paths.search.search, async (req,res) => {
    // espera receber uma string de ids separados por virgula: ?ids=id1,id2,id3
    const idsString = req.query.ids
    if(!idsString) {
      return res.json(respostaErro({status: 400, message: "IDs não informados"}))
    }

    const ids = idsString.split(",").map(id => id.trim()).filter(id => id)

    if(ids.length === 0) {
      return res.json(respostaErro({status: 400, message: "IDs inválidos"}))
    }

    try {
        const result = []
        // O search usa o catalog para buscar os produtos via axios direto, 
        // ou poderia usar o request-bus se houvesse uma requisição para isso.
        // Vamos usar a API do catálogo (porta 3003) para buscar os produtos pelo ID
        for (const id of ids) {
            try {
               const prodRes = await axios.get(`${config.url}:${svc.catalog}${paths.catalog.product}?id=${id}`)
               if (prodRes.data && !prodRes.data.error) {
                   result.push(prodRes.data.content)
               }
            } catch (err) {
               console.error(`Erro ao buscar produto ${id}:`, err.message)
            }
        }

        return res.json({
            error: false,
            status: 200,
            content: result
        })

    } catch (e) {
        return res.json(respostaErro({e, message: "Erro ao processar comparação"}))
    }
})
// #endregion

// #region endpoint de eventos
app.post(paths.events.event, (req, res) => {
  const { event, payload } = req.body;
  try {
    eventFunctions[event](payload)
  } catch (e) {}

  return res.end()
})
// #endregion

// #region endpoint de requisições
app.post(paths.requests.request, async (req, res) => {
  const {request, payload} = req.body
  try{
    const result = await requestFunctions[request](payload)
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
    const server = app.listen(PORT, () => {
      console.log(`Rodando em ${config.url}:${PORT}`)
    });

    // registro no bus de eventos
    await axios.post(`${config.url}:${svc.eventBus}${paths.events.subscribe}`,{
        calbackUrl: calbackUrl,
        serviceName: serverName,
        events: subscribe
    })
    
    console.log("Serviço de search(comparação) inscrito")

    return server
  } catch (err) {
    console.error("Falha ao iniciar servidor:", err);
    process.exit(1);
  }
};

let servidor

async function gracefulShutdown(signal) {
  try {
    await axios.post(`${config.url}:${svc.eventBus}${paths.events.unsubscribe}`,{
        calbackUrl: calbackUrl,
        serviceName: serverName,
        events: subscribe
    })
  } catch(e) {}
  await servidor.close()
  process.exit(0)
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))
process.once('SIGUSR2', function () {
  gracefulShutdown('SIGUSR2')
  process.kill(process.pid, 'SIGUSR2');
});

startServer()
 .then(server => {
   servidor = server
 })
// #endregion
