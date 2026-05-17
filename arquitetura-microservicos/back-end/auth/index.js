import express from "express"
import cors from "cors"
import axios from "axios" 
//import fetch from "node-fetch"
import config from "../config.js";

const app = express();
// Middlewares
app.use(cors());
// Permite receber JSON direto no req.body
app.use(express.json());

const svc = config.ports.back
const path = config.paths
const PORT = svc.auth
const events = config.events

const calbakckUrl = `${config.url}:${PORT}${path.events.event}`
const sendEvent = `${config.url}:${svc.eventBus}${path.events.event}`

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
  console.log(payload)
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
    app.listen(PORT, async () => {
      console.log(`Rodando em ${config.url}:${PORT}`)

      // registro no bus de eventos
        await axios.post(`${config.url}:${svc.eventBus}${path.events.subscribe}`,{
            calbackUrl: calbakckUrl,
            serviceName: "auth",
            events: [events.user.register]
        })
        
        console.log("Serviço de autentificação inscrito")
    });
  } catch (err) {
    console.error("Falha ao iniciar servidor:", err);
    process.exit(1);
  }
};
startServer();