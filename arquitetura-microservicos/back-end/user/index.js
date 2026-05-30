import express from "express"
import cors from "cors"
import axios from "axios" 
import z from "zod"
import config from "../utlis/config.js";
import process from "node:process"
import mongoose from "mongoose"

//  .env compartilhado e proprio
import getDirname from "../utlis/getDirname.js";
import loadEnv from "../utlis/loadEnv.js";
import { timeStamp } from "node:console"

loadEnv(getDirname(import.meta.url))

// #region schemas
// mongoDB

const userSchemaMongoose = new mongoose.Schema({
  authId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true
  },
  nome: {
    type: String,
    unique: true,
    required: true
  },
}, {timestamps: true, collection: 'user'})

const User = mongoose.model("User", userSchemaMongoose);

const userSchemaZod = z.object({
  nome: z.string().trim()
    .min(2, "Minimo de 2 Caracteres")
    .max(50, "Maximo de 50 caracteres")
    .regex(/^[\p{L}\s'-]+$/u,"Nome contém caracteres inválidos")
})

// #endregion

const app = express();
// Middlewares
app.use(cors());
// Permite receber JSON direto no req.body
app.use(express.json());

// #region config
const svc = config.ports.back
const paths = config.paths
const PORT = svc.user
const events = config.events
const requests = config.requests

const calbackUrl = `${config.url}:${PORT}${paths.events.event}`
const sendEvent = `${config.url}:${svc.eventBus}${paths.events.event}`
const serverName = "user"
// #endregion

// #region eventos para se inscrever
const subscribe = [
  events.user.register,
  events.user["not.register"]
]

// tratamento de eventos
// essa função é usada mais de uma vez então é armazenada em uma constante
const registerUser = async (payload) => {
    const {authId,nome} = payload
    await User.create({
      authId,
      nome
    })
    await axios.post(sendEvent, {
        event: events.user.added,
        payload: {
          authId: authId
        }
    })
  }
const eventFunctions = {
  [events.user.register]: registerUser,
  [events.user["not.register"]]: async (payload) => {
    const {id,email} = payload

    // primeiro busca se já foi adicionado
      // nao
    const usuarioExiste = User.exists({authId: id})
    if(!usuarioExiste){
      const tempBase = email.split("@")[0]
  
      let tempName = tempBase
      let i = 0
  
      while (await User.exists({nome: tempName})){
        i++
        tempName = `${tempBase}${i}`
      }
      // mesma chamada (é o mesmo processo a partir de agora)
      await registerUser({
        authId: id,
        nome: tempName})
      }
        // sim
      else{
        await axios.post(sendEvent, {
          event: events.user.added,
            payload: {
              authId: id
            }
        })
      }
    }
}

const requestFunctions = {
  [requests.user.name.valdate]: (payload) => {
    const {nome} = payload
    const validName = userSchemaZod.safeParse({nome})
    if (!validName.success) {
        const errosFormatados = z.treeifyError(validName.error).properties || {}
        const errors = {}

        for (const [tipo,erros] of Object.entries(errosFormatados)){
          if(erros.errors.length > 0){
            errors[tipo] = erros.errors
          }
        }
        
        return {
          error: true,
          status: 409,
          message: errors
        }
      }
      return {
          error: false,
        }
  },
  [requests.user.name.exits]: async (payload) => {
    const {nome} = payload
    try {
      const nomeExiste = await User.findOne({nome: nome})
    //console.log(nomeExiste)
    if (nomeExiste) {
      //console.log("deu erro no nome")
      return { 
        error: true,
        status: 409,
        message: {
          email: "Nome já cadastrado"
        } 
      }
    }
    else {
      return {
        error: false
      }
    } 
    } catch (e) {
      //console.log(e)

    return {
      error: true,
      message: e
    }
    }
  },
  [requests.user.name.tell]: async (payload) => {
    const {authId} = payload

    const nome = await User.findOne({authId})
    const r = {
      error: false,
      content: {
        nome: nome.nome
      }
    }
    //console.log(r)
    return r
  }
}
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
// # endregion
// #region Inicialização do servidor
const startServer = async () => {
  try {
    //se for usar o .env e precisar de uma logica de verificacao
        if (!process.env.MONGO_URI) {
          throw new Error("MONGO_URI não definida no .env");
        }
        await mongoose.connect(process.env.MONGO_URI,
          {
            dbName: "userProfile"
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
      
      console.log("Serviço de usuario inscrito")

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

