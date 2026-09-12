import express from "express";
import cors from "cors";
import axios from "axios";
import process from "node:process";
import mongoose from "mongoose";
import config from "../../../shared/utils/config.js";
import getDirname from "../../../shared/utils/getDirname.js";
import loadEnv from "../../../shared/utils/loadEnv.js";
import {
    createUser,
    existsByAuthId,
    existsByNome,
    findUser,
    findUserByAuthId,
    findUserByNome,
} from "../db/userDBManager.ts";
import { User } from "../entities/user.ts";
import { logAppError, respostaErroApp } from "../../../shared/errors/index.ts";
import {
    validarCampoObrigatorio,
    validarObjectId,
    validarPayload,
} from "../../../shared/utils/routeValidation.ts";

loadEnv(getDirname(import.meta.url));

// =============================================================
// #region SETUP EXPRESS
// =============================================================

const app: any = express();
app.use(cors());
app.use(express.json());

const svc = config.ports.back;
const paths = config.paths;
const PORT = svc.user;
const events = config.events;
const requests = config.requests;

const calbackUrl = `${config.url}:${PORT}${paths.events.event}`;
const sendEvent = `${config.url}:${svc.eventBus}${paths.events.event}`;
const serverName = "user";

// #endregion

// =============================================================
// #region EVENTOS — funções executadas ao receber um evento do Event Bus
// O User escuta "user.create" para criar o perfil
// e "user.re.register" para recuperar cadastros com falha
// =============================================================

const subscribe = [events.user.register, events.user["not.register"]];

const registerUser = async (payload: { authId: string; nome: string }) => {
    const dados = validarPayload(payload);
    const authId = validarObjectId(dados.authId, "authId");
    const nome = validarCampoObrigatorio(dados.nome, "nome");
    User.validarNome(nome);

    await createUser({ authId, nome });
    await axios.post(sendEvent, {
        event: events.user.added,
        payload: { authId },
    });
};

const eventFunctions: Record<string, (payload: any) => Promise<void>> = {
    [events.user.register]: registerUser,
    [events.user["not.register"]]: async (payload) => {
        const dados = validarPayload(payload);
        const id = validarObjectId(dados.id, "id");
        const email = validarCampoObrigatorio(dados.email, "email");

        const usuarioExiste = await existsByAuthId(id);
        if (!usuarioExiste) {
            const tempBase = email.split("@")[0];

            let tempName = tempBase;
            let i = 0;

            while (await existsByNome(tempName)) {
                i++;
                tempName = `${tempBase}${i}`;
            }

            await registerUser({
                authId: id,
                nome: tempName,
            });
        } else {
            await axios.post(sendEvent, {
                event: events.user.added,
                payload: { authId: id },
            });
        }
    },
};

// #endregion

// =============================================================
// #region REQUISIÇÕES (Request Bus)
// Respostas para queries síncronas vindas de outros microsserviços
// Cada chave mapeia um tipo de request para uma função
// =============================================================

const requestFunctions: Record<string, (payload: any) => Promise<any>> = {
    [requests.user.name.valdate]: async (payload) => {
        try {
            const dados = validarPayload(payload);
            const nome = validarCampoObrigatorio(dados.nome, "nome");
            User.validarNome(nome);
            return { error: false };
        } catch (e) {
            logAppError(e, { service: serverName, operation: requests.user.name.valdate });
            const erro = respostaErroApp(e);
            return { ...erro, status: 409 };
        }
    },
    [requests.user.name.exits]: async (payload) => {
        try {
            const dados = validarPayload(payload);
            const nome = validarCampoObrigatorio(dados.nome, "nome");
            User.validarNome(nome);

            const nomeExiste = await findUserByNome(nome);
            if (nomeExiste) {
                return {
                    error: true,
                    status: 409,
                    message: { email: "Nome já cadastrado" },
                };
            }
            return { error: false };
        } catch (e) {
            logAppError(e, { service: serverName, operation: requests.user.name.exits });
            return respostaErroApp(e);
        }
    },
    [requests.user.name.tell]: async (payload) => {
        try {
            const dados = validarPayload(payload);
            const authId = validarObjectId(dados.authId, "authId");

            const usuario = await findUserByAuthId(authId);
            return {
                error: false,
                content: {
                    nome: usuario.nome,
                    userId: String(usuario._id),
                },
            };
        } catch (e) {
            logAppError(e, { service: serverName, operation: requests.user.name.tell });
            return respostaErroApp(e);
        }
    },
    [requests.user.exist]: async (payload) => {
        try {
            const dados = validarPayload(payload);
            const userId = validarObjectId(dados.userId, "userId");
            await findUser(userId);
            return { error: false };
        } catch (e) {
            logAppError(e, { service: serverName, operation: requests.user.exist });
            return respostaErroApp(e);
        }
    },
    [requests.user.byAuthId]: async (payload) => {
        try {
            const dados = validarPayload(payload);
            const authId = validarObjectId(dados.authId, "authId");
            const usuario = await findUserByAuthId(authId);
            if (!usuario) {
                return { error: true, status: 404, message: "Usuário não encontrado" };
            }
            return {
                error: false,
                content: { userId: String(usuario._id) },
            };
        } catch (e) {
            logAppError(e, { service: serverName, operation: requests.user.byAuthId });
            return respostaErroApp(e);
        }
    },
};

// #endregion

// =============================================================
// #region ROTAS HTTP
// POST /eventos    — recebe eventos do Event Bus
// POST /requisicao — recebe queries do Request Bus e responde
// =============================================================

app.post(paths.events.event, (req, res) => {
    const { event, payload } = req.body;
    try {
        eventFunctions[event]?.(payload);
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
        try {
            logAppError(e, { service: serverName, route: paths.requests.request });
            return res.json({ values: respostaErroApp(e) });
        } catch {
            return res.json({
                content: {
                    error: true,
                    status: 404,
                    message: "Requisição desconhecida",
                },
            });
        }
    }
});

// #endregion

// =============================================================
// #region INICIALIZAÇÃO DO SERVIDOR
// Conecta ao MongoDB, sobe o Express e se inscreve no Event Bus
// =============================================================

const startServer = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI não definida no .env");
        }

        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "userProfile",
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

        console.log("Serviço de usuario inscrito");

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
