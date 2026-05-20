import express from "express"
import cors from "cors"
import axios from "axios" 
//import fetch from "node-fetch"
import config from "../config.js";

//import process from "node:process"

const app = express();
// Middlewares
app.use(cors());
// Permite receber JSON direto no req.body
app.use(express.json());

const svc = config.ports.back
const path = config.paths
const PORT = svc.auth
const events = config.events

const calbackUrl = `${config.url}:${PORT}${path.events.event}`
const sendEvent = `${config.url}:${svc.eventBus}${path.events.event}`

// eventos para se inscrever
const subscribe = [
  events.user.added
]

// tratamento de eventos
const eventFunctions = {
  [events.user.added]: (payload) => {
    console.log(`Evento ${events.user.added}`)
    console.log("Vou mudar o banco de dados")
  }
}

// Rota de cadastro
app.post(path.auth.register, async (req, res) => {
  const {event, payload} = req.body
  console.log(event)
  console.log(payload)

  await axios.post(sendEvent, {
    event: event,
    payload: payload
  })

  res.end()
});

// endpoint de eventos
app.post(path.events.event, (req, res) => {
  const { event, payload } = req.body;
  console.log(event)
  eventFunctions[event](payload)

  res.end()
})


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

    //const server = 
    app.listen(PORT, () => {
      console.log(`Rodando em ${config.url}:${PORT}`)

      console.log(subscribe)
    });

    // registro no bus de eventos
      await axios.post(`${config.url}:${svc.eventBus}${path.events.subscribe}`,{
          calbackUrl: calbackUrl,
          serviceName: "auth",
          events: subscribe
      })
      
      console.log("Serviço de autentificação inscrito")
      //return server

  } catch (err) {
    console.error("Falha ao iniciar servidor:", err);
    process.exit(1);
  }
};


/*
  Obs: falha ao conseguir fazer um codigo de encerramento que conclui por completo antes de ser forçado a parar pelo sistem
  Não remover essas linhas, para caso consiga descobrir como fazer funcionar
*/
// sinais escutados para o fechamento
// process.on('SIGTERM', () => gracefulShutdown('SIGTERM')) // solicitacao de fechamento generica
// process.on('SIGINT', () => gracefulShutdown('SIGINT')) // solicitacao interativa (Ctrl + C)

//let servidor

startServer()
// .then(server => {
//   servidor = server
// })
