import axios from "axios" 
import express from "express"
import cors from "cors"
import config from "../config.js";

const app = express()
// Middlewares
app.use(cors());
// Permite receber JSON direto no req.body
app.use(express.json());

const svc = config.ports.back
const paths = config.paths.events
const PORT = svc.eventBus
const url = `${config.url}`

// mapa de inscricoes dos eventos
const subscribers = new Map()

// Registro de inscricoes
app.post(paths.subscribe, (req, res) => {
    console.log(req.body)
    const { calbackUrl, serviceName, events} = req.body

    for ( const eventName of events) {
        /* 
        - quando um servidor for se inscrever em um evento
        - se o evento não foi cadastrado no mapa de eventos do bus
        -> adiciona uma coleção para o evento no mapa
        */

        if(!subscribers.has(eventName)){
        subscribers.set(eventName, [])
        }

        subscribers.get(eventName).push({
            serviceName,
            calbackUrl
        })
        
        console.log(`${serviceName} escutando ${eventName}`)
    }
    res.end()
})

// eventos

    // registro 

app.post(paths.event, async (req, res) => {
    const {event, payload} = req.body
    console.log(event)

    const targets = subscribers.get(event) || [];
    
    for( const socket of targets){
        try {
            await axios.post(socket.calbackUrl, {
                event,
                payload
            })
            console.log(`Evento enviado para ${socket.serviceName}`)

        } catch (e) {}
    }
    res.end()
})


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