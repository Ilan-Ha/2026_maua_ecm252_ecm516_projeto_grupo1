import express from "express"
import cors from "cors"
import config from "../../mss/shared/utlis/config.js"
import EventBus from "./EventBus.js"

const app = express()
// Middlewares
app.use(cors());
// Permite receber JSON direto no req.body
app.use(express.json());

const eventBus = new EventBus()
const paths = config.paths.events
const PORT = config.ports.back.eventBus;

// rota de debbug TODO trocar o nome dessa rota

app.get("/dados", (req,res) => {
    res.json(eventBus.snapshot());
});


// Registro de inscricoes

app.post(paths.subscribe, (req, res) => {

  const { calbackUrl, serviceName, events } = req.body

    if (!serviceName || !calbackUrl || !Array.isArray(events)) {
      return res.status(400).json({ error: true, message: "Body inválido"})
    }

    eventBus.subscribe(serviceName, calbackUrl, events);
    return res.status(204).end();

});


// Registro de desinscricao

app.post(paths.unsubscribe, (req, res) => {
    
  const { calbackUrl, serviceName, events } = req.body

  if (!serviceName || !calbackUrl || !Array.isArray(events)) {
    return res.status(400).json({ error: true, message: "Body inválido"})
  }

  eventBus.unsubscribe(serviceName, calbackUrl, events)
  return res.status(204).end()
  
})

// eventos
 
app.post(paths.event, async (req, res) => {

    const { event, payload } = req.body

    // Só aceita um evento por vez (event obrigatoriamente string) e se payload existe
    if (
      !event ||
      typeof event !== 'string' ||
      payload == null
    ) {
      return res.status(400).json({ error: true, message: "Body inválido" });
    }

    await eventBus.publish(event, payload);
    return res.status(202).end();
})


const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Rodando em ${config.url}:${PORT}`);
    });
  } catch (err) {
    console.error("Falha ao iniciar servidor:", err);
  }
};

startServer();