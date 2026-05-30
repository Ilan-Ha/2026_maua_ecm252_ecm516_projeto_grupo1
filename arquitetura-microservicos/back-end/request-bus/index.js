//'request-bus' / padrão 'request-reply'

import axios from "axios" 
import express from "express"
import cors from "cors"
import config from "../utlis/config.js"

const app = express()
// Middlewares
app.use(cors());
// Permite receber JSON direto no req.body
app.use(express.json());

const svc = config.ports.back
const PORT = svc.requestBus
const paths = config.paths.requests
const request = config.requests
const url = config.url

const urls = {
    user: `${url}:${svc.user}${paths.request}`
}

const copyCode = async (payload, req) => {
        const result = await axios.post(urls.user, {
            request: req,
            payload: payload})
            console.log(result)
        return result.data.values
}
const requestFunctions = {
    [request.user.name.exits]: (payload) => {
        return copyCode(payload, request.user.name.exits)
    },
    [request.user.name.valdate]: (payload) => {
        return copyCode(payload, request.user.name.valdate)
    },
    [request.user.name.tell]: (payload) => {
        return copyCode(payload, request.user.name.tell)
    }
}

// rota de requisição

app.post(paths.request, async (req,res) => {
    const {request, payload} = req.body
    //console.log(payload)
    //console.log(request)
    try {
        const result = await requestFunctions[request](payload)
        .then((r) => {
            console.log(r)
        const {error, message, status, content} = r
        // console.log(error)
        if (typeof(error) !== "boolean"){
            // console.log(error)
            //console.log(typeof(error))

            return res.json({
                error: true,
                status: 500,
                message: "Erro interno de servidor request"
            })
        }
        return res.json({
            error: error,
            status: status,
            message: message,
            content: content
        })
      })
    } catch (e) {
        return res.json({
            error: true,
            status: e.response?.status || 500,
            message: e.response?.data || "Erro interno de servidor request"
        })
    }
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