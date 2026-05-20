import express from "express"
import cors from "cors"
import axios from "axios" 
import config from "../config.js";


const app = express();
// Middlewares
app.use(cors());
// Permite receber JSON direto no req.body
app.use(express.json());

const svc = config.ports.back
const path = config.paths
const PORT = svc.user
const events = config.events

const calbackUrl = `${config.url}:${PORT}${path.events.event}`
const sendEvent = `${config.url}:${svc.eventBus}${path.events.event}`

// eventos para se inscrever
const subscribe = [
  events.user.register,
]

// tratamento de eventos
const eventFunctions = {
  [events.user.register]: async (payload) => {
    await axios.post(sendEvent, {
        event: events.user.added,
        payload: payload
    })
  },
}


// endpoint de eventos
app.post(path.events.event, (req, res) => {
  const { event, payload } = req.body;
  console.log(event)
  console.log(payload)
  eventFunctions[event](payload)

  res.end()
})


// Inicialização do servidor
const startServer = async () => {
  try {

    app.listen(PORT, () => {
      console.log(`Rodando em ${config.url}:${PORT}`)

      console.log(subscribe)
    });

    // registro no bus de eventos
      await axios.post(`${config.url}:${svc.eventBus}${path.events.subscribe}`,{
          calbackUrl: calbackUrl,
          serviceName: "user",
          events: subscribe
      })
      
      console.log("Serviço de usuario inscrito")

  } catch (err) {
    console.error("Falha ao iniciar servidor:", err);
    process.exit(1);
  }
};



startServer()
