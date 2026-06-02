import axios from "axios" 
import express from "express"
import cors from "cors"
import config from "../../mss/shared/utlis/config.js"

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

// rota de debbug

app.get("/dados", (req,res) => {
    console.log(subscribers)
    res.json({
        subscribers: JSON.stringify(Object.fromEntries(subscribers))
    })
})


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

        // checagem devido a graceful shutdown não funcionar

        const clientes = subscribers.get(eventName)
        
        const isThere = clientes.some(client => client.serviceName === serviceName && client.calbackUrl === calbackUrl)

        // se o servidor ja havia se inscrito
        // teve que desligar 
        // e re-ligou
        // não se re-inscreve
        if(!isThere){
          clientes.push({
            serviceName,
            calbackUrl
          })
          
          console.log(`${serviceName} escutando ${eventName}`)
        }
        else {
          console.log(`${serviceName} não se inscreveu em ${eventName} por já estar inscrito.`)
        }
        
    }
    res.end()
})


// Registro de desinscricao
app.post(paths.unsubscribe, (req, res) => {
    const { calbackUrl, serviceName, events} = req.body

    for (const eventName of events){
        if(subscribers.has(eventName)){
            let updateSubscribers = subscribers.get(eventName).filter(service => service.serviceName !== serviceName && service.calbackUrl !== calbackUrl)

            console.log(`${serviceName} se desinscreveu de ${eventName}`)

            subscribers.set(eventName,updateSubscribers)     
        }

    }
    res.end()
})

// eventos
 
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
    app.listen(PORT, () => {
      console.log(`Rodando em ${config.url}:${PORT}`);
    });
  } catch (err) {
    console.error("Falha ao iniciar servidor:", err);
    process.exit(1);
  }
};

startServer();