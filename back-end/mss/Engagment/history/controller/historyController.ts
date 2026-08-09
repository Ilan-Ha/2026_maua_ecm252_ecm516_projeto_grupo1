import express from "express";
import cors from "cors";
import axios from "axios";
import process from "node:process";
import mongoose from "mongoose";
import config from "../../../shared/utils/config.js";
import getDirname from "../../../shared/utils/getDirname.js";
import loadEnv from "../../../shared/utils/loadEnv.js";
import { createHistoryEntry, getHistoryByUserId, clearHistoryByUserId } from "../db/historyDBManager.ts";
import { History } from "../entities/history.ts";
import { handleRouteError } from "../../../shared/errors/index.ts";
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
const PORT = svc.history;
const request = config.requests;

const sendRequest = `${config.url}:${svc.requestBus}${paths.requests.request}`;
const calbackUrl = `${config.url}:${PORT}${paths.events.event}`;
const serverName = "product user search history";

const subscribe: string[] = [];
const eventFunctions: Record<string, (payload: any) => void> = {};
const requestFunctions: Record<string, (payload: any) => Promise<any>> = {};

// #endregion

// =============================================================
// #region HELPERS
// Funções auxiliares internas usadas pelas rotas
// =============================================================

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
        message: message ? message : e?.response?.data || "Erro interno de servidor history",
    };
};

// Resolve userId a partir do authId via Request Bus → User service
async function resolveUserId(authId: string): Promise<string> {
    const result = await axios.post(sendRequest, {
        request: request.user.byAuthId,
        payload: { authId },
    });
    // O Request Bus retorna { error, status, message, content } diretamente no result.data
    const data = result.data?.content ? result.data : result.data?.values || result.data;
    const { error, message, status, content } = data;
    if (error || !content?.userId) {
        const err: any = new Error(message || "Usuário não encontrado");
        err.status = status || 404;
        throw err;
    }
    return content.userId;
}

// Busca dados do produto via Catalog service
async function getProdutoData(productId: string): Promise<any> {
    try {
        const response = await axios.get(
            `${config.url}:${svc.catalog}${paths.catalog.product}`,
            { params: { id: productId }, timeout: 3000 }
        );
        const { error, content } = response.data;
        if (error || !content) return null;
        return content;
    } catch {
        return null;
    }
}

// #endregion


// =============================================================
// #region ROTAS HTTP
// POST   /historico          — registra acesso a produto
// GET    /historico?authId=  — retorna histórico populado
// DELETE /historico?authId=  — limpa histórico do usuário
// POST   /eventos            — recebe eventos do Event Bus
// POST   /requisicao         — responde queries do Request Bus
// =============================================================

// POST /historico — registra acesso a um produto
app.post(paths.history.history, async (req, res) => {
    try {
        // Aceita tanto body direto quanto com wrapper { payload }
        const body = req.body?.payload ?? req.body;
        const authId = validarCampoObrigatorio(body?.authId, "authId");
        const productId = validarCampoObrigatorio(body?._id ?? body?.productId, "productId");

        validarObjectId(productId, "productId");

        // Resolve userId a partir do authId
        const userId = await resolveUserId(authId);

        // Verifica se o produto existe
        const productResult = await axios.post(sendRequest, {
            request: request.catalog.product.exist,
            payload: { productId },
        });
        const productData = productResult.data?.content ? productResult.data : productResult.data?.values || productResult.data;
        const { error: productError, message: productMessage, status: productStatus } = productData;
        if (productError) {
            return res.json(respostaErro({ status: productStatus, message: productMessage }));
        }

        await createHistoryEntry({ userId, productId });
        return res.json({
            error: false,
            status: 200,
            message: "Acesso registrado",
        });
    } catch (e: any) {
        return res.json(handleRouteError(e, { service: serverName, route: paths.history.history }, () =>
            respostaErro({ e, status: e.status || 400 })
        ));
    }
});

// GET /historico?authId=... — retorna histórico populado do usuário
app.get(paths.history.history, async (req, res) => {
    try {
        const authId = validarCampoObrigatorio(req.query?.authId, "authId");

        // Resolve userId
        const userId = await resolveUserId(String(authId));

        // Busca registros do banco
        const registros = await getHistoryByUserId(userId);
        if (!registros || registros.length === 0) {
            return res.json({ error: false, status: 200, content: [] });
        }

        // Popula dados dos produtos em paralelo
        const produtos = await Promise.all(
            registros.map(async (r: any) => {
                const produto = await getProdutoData(String(r.productId));
                if (!produto) return null;
                return {
                    _id: String(r.productId),
                    nome: produto.nome || "",
                    marca: produto.marca || "",
                    imagem: produto.imagem || "",
                    precoMedio: produto.precoMedio || 0,
                    categoriaTag: produto.categoriaTag || "",
                    acessadoEm: r.createdAt,
                };
            })
        );

        const resultado = produtos.filter(Boolean);
        return res.json({ error: false, status: 200, content: resultado });
    } catch (e: any) {
        return res.json(handleRouteError(e, { service: serverName, route: paths.history.history }, () =>
            respostaErro({ e, status: e.status || 500 })
        ));
    }
});

// DELETE /historico?authId=... — limpa o histórico do usuário
app.delete(paths.history.history, async (req, res) => {
    try {
        const authId = validarCampoObrigatorio(req.query?.authId, "authId");
        const userId = await resolveUserId(String(authId));
        await clearHistoryByUserId(userId);
        return res.json({ error: false, status: 200, message: "Histórico limpo" });
    } catch (e: any) {
        return res.json(handleRouteError(e, { service: serverName, route: paths.history.history }, () =>
            respostaErro({ e, status: e.status || 500 })
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
