import express from "express"
import cors from "cors"
import axios from "axios" 
//import fetch from "node-fetch"
import process from "node:process"
import mongoose from "mongoose"
import bcrypt from 'bcrypt'
import {z} from 'zod'
import config from "../utlis/config.js";


// .env compartilhado e proprio
import getDirname from "../utlis/getDirname.js";
import loadEnv from "../utlis/loadEnv.js";
import { timeStamp } from "node:console"

loadEnv(getDirname(import.meta.url))

// mongoDB

const authSchemaMongoose = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  senha: {
    type: String,
    required: true
  },
  usuarioCadastrado: {
    type: Boolean,
    default: false
  }
}, {timestamps: true, collection: 'auth'})

// quando recebe Auth.create ou Auth.save
// esse código roda
// e se Auth.senha mudou -> então gera o hash
authSchemaMongoose.pre(
  "save",
  async function () {
    if (!this.isModified("senha")) {return}
    
    this.senha =
      await bcrypt.hash(this.senha, 10);

  }
)

const authSchemaZod = z.object({
  email: z.string().email("Formato de email invalido").trim().toLowerCase(),
  senha: z.string()
    .min(8, "Minimo de 8 Caracteres")
    .max(100, "Maximo de 100 caracteres")
    .regex(/[A-Z]/, "Deve conter pelo menos uma letra maiuscula")
    .regex(/[a-z]/, "Deve conter pelo menos uma letra minuscula")
    .regex(/[0-9]/, "Deve conter pelo menos um numero")
    .regex(/[^A-Za-z0-9]/, "Deve conter pelo menos um caracter especial"),
  confirmarSenha: z.string()
}).refine((data) => data.senha === data.confirmarSenha, {
  message: "Senhas não são iguais",
  path: ['confirmarSenha']
})

const Auth = mongoose.model("Auth", authSchemaMongoose);

const app = express();
// Middlewares
app.use(cors());
// Permite receber JSON direto no req.body
app.use(express.json());

// #region configurações vindas do config.js
const svc = config.ports.back
const paths = config.paths
const PORT = svc.auth
const events = config.events
const request = config.requests
// #endregion

// #region request-bus
const sendRequest = `${config.url}:${svc.requestBus}${paths.requests.request}`
// #endregion

// #region event-bus
const sendEvent = `${config.url}:${svc.eventBus}${paths.events.event}`
const calbackUrl = `${config.url}:${PORT}${paths.events.event}`
const serverName = 'auth'

// eventos para se inscrever
const subscribe = [
  events.user.added,
]

// tratamento de eventos
const eventFunctions = {
  [events.user.added]: async (payload) => {
    const {id} = payload
    const auth = await Auth.findById(id)
    auth.usuarioCadastrado = true
    await auth.save()
  }
}
// #endregion

// #region padrão de resposta de erro interno e externo
const respostaErro = ({e,status,message}) => {
  return {  
            error: true,
            status: status? 
              status : 
              e.response?.status || 500,
              // se status foi definido -> retorna status
              // se não, o erro tem um status de resposta resposta
              // se sim retorn o status do erro se não retorna o erro 500
            message: message?
              message :
              e.response?.data || "Erro interno de servidor"
        }
}
// #endregion

// #region Rota de cadastro
app.post(paths.auth.register, async (req, res) => {
  
  const {payload} = req.body
  //console.log(payload)

  const {email,senha,confirmarSenha,nome} = payload

  // #region conferindo erros de senha e email
  // o try é para depois poder usar "const result" de novo
  try {
    const result = authSchemaZod.safeParse({email,senha,confirmarSenha})

  // checagem de formatação
  if (!result.success) {
    const errosFormatados = z.treeifyError(result.error).properties || {}
    const errors = {}

    for (const [tipo,erros] of Object.entries(errosFormatados)){
      if(erros.errors.length > 0){
        errors[tipo] = erros.errors
      }
    }
    return res.json(respostaErro({status,message: errors}))
  }
  } catch (e) {
    return res.json(respostaErro(e))
  }
  // #endregion

  // #region verificando com servidor de usuario se nome está de acordo
   try {

    const result = await axios.post(sendRequest, {
        request: request.user.name.valdate,  
        payload: {
            nome: nome
          }
    })
      const {error, message, status} = result.data
      // caso o servidor de usuario retorne que o nome é invalido
      if(error){
        return res.json(respostaErro({status,message}))
      }
   } catch (e) {
    return res.json(respostaErro(e))
   }
    // #endregion

  // #region verifica se o email já existe
  const emailExiste = await Auth.findOne({ email: email });
  if (emailExiste) {
    return res.json({ 
      error: true,
      status: 409,
      message: {
        email: "Email já cadastrado"
      } });
  }
  // #endregion
  // console.log(nome)
  // #region verifica se o nome já existe
    try {
      const result = await axios.post(sendRequest, {
        request: request.user.name.exits,  
        payload: {
            nome: nome
          }
    })
      const {error, message, status} = result.data
      // caso o servidor de usuario retorne que o nome é invalido
      if(error){
        return res.json(respostaErro({status,message}))
      }
    } catch (e) {
      return res.json(respostaErro(e))
    }
  // #endregion
  
  // cria usuario
  const sharedId = new mongoose.Types.ObjectId();

  await Auth.create({
    _id: sharedId,
    email,
    senha})

  await axios.post(sendEvent, {
    event: events.user.register,
    payload: {
      id: sharedId,
      email: email,
      nome: nome
    }
  })

  return res.json({
    error: false,
    status: 201,
    message: "Usuário cadastrado"
  })
});
// #endregion

// #region endpoint de eventos
app.post(paths.events.event, (req, res) => {
  const { event, payload } = req.body;
  //console.log(event)
  eventFunctions[event](payload)

  res.end()
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
        dbName: "autentification"
      }
    );
    console.log("Mongo conectado");
    // await initSeed();

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
      
      console.log("Serviço de autentificação inscrito")
      
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