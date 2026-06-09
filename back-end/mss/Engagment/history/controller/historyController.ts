import express from "express";
import cors from "cors";
import axios from "axios";
import process from "node:process";
import mongoose from "mongoose";
import config from "../../../shared/utlis/config.js";
import getDirname from "../../../shared/utlis/getDirname.js";
import loadEnv from "../../../shared/utlis/loadEnv.js";
import { createHistoryEntry } from "../db/historyDBManager.ts";
import { History } from "../entities/history.ts";
import { handleRouteError } from "../../../shared/errors/index.ts";
import {
    validarCampoObrigatorio,
    validarObjectId,
    validarPayload,
} from "../../../shared/utlis/routeValidation.ts";

loadEnv(getDirname(import.meta.url));

const app: any = express();
app.use(cors());
app.use(express.json());

const svc = config.ports.back;
const paths = config.paths;
const PORT = svc.history;
const request = config.requests;

const sendRequest = `${config.url}:${svc.requestBus}${paths.requests.request}`;
const calbackUrl = `${config.url}:${PORT}${paths.events.event}`;
const serverName = "product user search history";

const subscribe: string[] = [];
const eventFunctions: Record<string, (payload: any) => void> = {};
const requestFunctions: Record<string, (payload: any) => Promise<any>> = {};

const respostaErro = ({
    e,
    status,
    message,
}: {
    e?: any;
    status?: number;
    message?: string;
}) => {
    return {
        error: true,
        status: status ? status : e?.response?.status || 500,
        message: message ? message : e?.response?.data || "Erro interno de servidor auth",
    };
};

app.post(paths.history.history, async (req, res) => {
    try {
        const payload = validarPayload(req.body?.payload);
        const userId = validarObjectId(payload.userId, "userId");
        const productId = validarObjectId(payload.productId, "productId");
        new History({ userId, productId });

        const userResult = await axios.post(sendRequest, {
            request: request.user.exist,
            payload: { userId },
        });
        const { error: userError, message: userMessage, status: userStatus } = userResult.data;
        if (userError) {
            return res.json(respostaErro({ status: userStatus, message: userMessage }));
        }

        const productResult = await axios.post(sendRequest, {
            request: request.catalog.product.exist,
            payload: { productId },
        });
        const { error: productError, message: productMessage, status: productStatus } = productResult.data;
        if (productError) {
            return res.json(respostaErro({ status: productStatus, message: productMessage }));
        }

        await createHistoryEntry({ userId, productId });
        return res.json({
            error: false,
            status: 200,
            message: "Acesso registrado",
        });
    } catch (e) {
        return res.json(handleRouteError(e, { service: serverName, route: paths.history.history }, () =>
            respostaErro({ e, status: 400 })
        ));
    }
});

app.post(paths.events.event, (req, res) => {
    const { event, payload } = req.body;
    try {
        eventFunctions[event](payload);
    } catch (e) {}
    return res.end();
});

app.post(paths.requests.request, async (req, res) => {
    const { request: reqName, payload } = req.body;
    try {
        validarCampoObrigatorio(reqName, "request");
        if (!requestFunctions[reqName]) {
            return res.json({
                content: {
                    error: true,
                    status: 404,
                    message: "Requisição desconhecida",
                },
            });
        }
        const result = await requestFunctions[reqName](payload);
        return res.json({ values: result });
    } catch (e) {
        return res.json({
            values: handleRouteError(e, { service: serverName, route: paths.requests.request }, () => ({
                error: true,
                status: 404,
                message: "Requisição desconhecida",
            })),
        });
    }
});

const startServer = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI não definida no .env");
        }

        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "userProductHistory",
        });
        console.log("Mongo conectado");

        const server = app.listen(PORT, () => {
            console.log(`Rodando em ${config.url}:${PORT}`);
            console.log(subscribe);
        });

        await axios.post(`${config.url}:${svc.eventBus}${paths.events.subscribe}`, {
            calbackUrl,
            serviceName: serverName,
            events: subscribe,
        });

        console.log("Serviço de historico inscrito");

        return server;
    } catch (err) {
        console.error("Falha ao iniciar servidor:", err);
        process.exit(1);
    }
};

let servidor: any;

async function gracefulShutdown(_signal: string) {
    await axios.post(`${config.url}:${svc.eventBus}${paths.events.unsubscribe}`, {
        calbackUrl,
        serviceName: serverName,
        events: subscribe,
    });
    await servidor.close();
    process.exit(0);
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.once("SIGUSR2", function () {
    gracefulShutdown("SIGUSR2");
    process.kill(process.pid, "SIGUSR2");
});

startServer().then((server) => {
    servidor = server;
});
