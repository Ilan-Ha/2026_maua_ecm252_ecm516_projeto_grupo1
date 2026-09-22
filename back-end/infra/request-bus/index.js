//'request-bus' / padrão 'request-reply'

import axios from "axios"
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"
import config from "../../mss/shared/utils/config.js"
import {
  correlationMiddleware,
  httpLoggingMiddleware,
} from "../../shared/logging/express.mjs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, "../../../.env"), override: true, quiet: true })

const app = express()
app.use(cors({ origin: [/localhost/, /127\.0\.0\.1/] }));
app.use(express.json());
app.use(correlationMiddleware);
app.use(httpLoggingMiddleware("request-bus"));

const svc = config.ports.back
const PORT = svc.requestBus
const paths = config.paths.requests
const request = config.requests
const url = config.url

const urls = {
    user: `${url}:${svc.user}${paths.request}`,
    catalog: `${url}:${svc.catalog}${paths.request}`
}

const copyCode = async (payload, req, urlString) => {
        const result = await axios.post(urlString, {
            request: req,
            payload: payload})
        return result.data.values
}
const requestFunctions = {
    [request.user.name.exits]: (payload) => {
        return copyCode(payload, request.user.name.exits, urls.user)
    },
    [request.user.name.valdate]: (payload) => {
        return copyCode(payload, request.user.name.valdate, urls.user)
    },
    [request.user.name.tell]: (payload) => {
        return copyCode(payload, request.user.name.tell, urls.user)
    },
    [request.user.exist]: (payload) => {
        return copyCode(payload, request.user.exist, urls.user)
    },
    [request.user.byAuthId]: (payload) => {
        return copyCode(payload, request.user.byAuthId, urls.user)
    },
    [request.catalog.product.exist]: (payload) => {
        return copyCode(payload, request.catalog.product.exist, urls.catalog)
    }
}

app.post(paths.request, async (req,res) => {
    const {request, payload} = req.body
    try {
        await requestFunctions[request](payload)
        .then((r) => {
        const {error, message, status, content} = r
        if (typeof(error) !== "boolean"){
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
