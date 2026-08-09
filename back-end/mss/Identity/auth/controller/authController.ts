import express from "express";
import cors from "cors";
import axios from "axios";
import process from "node:process";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { z } from "zod";
import config from "../../../shared/utils/config.js";
import getDirname from "../../../shared/utils/getDirname.js";
import loadEnv from "../../../shared/utils/loadEnv.js";
import {
    createAuth,
    findAuthByEmail,
    markUsuarioCadastrado,
    resolveSenhaHash,
    updateSenhaByEmail,
} from "../db/authDBManager.ts";
import { User } from "../../user/entities/user.ts";
import { handleRouteError } from "../../../shared/errors/index.ts";
import {
    validarCampoObrigatorio,
    validarObjectId,
    validarPayload,
} from "../../../shared/utils/routeValidation.ts";

loadEnv(getDirname(import.meta.url));

// =============================================================
// #region CONFIGURAÇÃO DO SERVIDOR
// Express + middlewares básicos (CORS e JSON)
// =============================================================

const authSchemaZod = z
    .object({
        email: z.string().email("Formato de email invalido").trim().toLowerCase(),
        senha: z
            .string()
            .min(8, "Minimo de 8 Caracteres")
            .max(100, "Maximo de 100 caracteres")
            .regex(/[A-Z]/, "Deve conter pelo menos uma letra maiuscula")
            .regex(/[a-z]/, "Deve conter pelo menos uma letra minuscula")
            .regex(/[0-9]/, "Deve conter pelo menos um numero")
            .regex(/[^A-Za-z0-9]/, "Deve conter pelo menos um caracter especial"),
        confirmarSenha: z.string(),
    })
    .refine((data) => data.senha === data.confirmarSenha, {
        message: "Senhas não são iguais",
        path: ["confirmarSenha"],
    });

// #endregion

// =============================================================
// #region SETUP EXPRESS
// =============================================================

const app: any = express();
app.use(cors());
app.use(express.json());

const svc = config.ports.back;
const paths = config.paths;
const PORT = svc.auth;
const events = config.events;
const request = config.requests;

const sendRequest = `${config.url}:${svc.requestBus}${paths.requests.request}`;
const sendEvent = `${config.url}:${svc.eventBus}${paths.events.event}`;
const calbackUrl = `${config.url}:${PORT}${paths.events.event}`;
const serverName = "auth";

// #endregion

// =============================================================
// #region EVENTOS — funções executadas ao receber um evento do Event Bus
// O Auth escuta "user.added" para marcar o usuário como cadastrado
// =============================================================

const subscribe = [events.user.added];

const eventFunctions: Record<string, (payload: any) => Promise<void>> = {
    [events.user.added]: async (payload) => {
        const authId = validarObjectId(payload?.authId, "authId");
        await markUsuarioCadastrado(authId);
    },
};

// #endregion

// =============================================================
// #region HELPER — formata objeto de resposta de erro
// =============================================================

const respostaErro = ({
    e,
    status,
    message,
}: {
    e?: any;
    status?: number;
    message?: string | Record<string, string[]>;
}) => {
    return {
        error: true,
        status: status ? status : e?.response?.status || 500,
        message: message ? message : e?.response?.data || "Erro interno de servidor auth",
    };
};

// =============================================================
// #region ROTAS HTTP
// POST /cadastro — cria credenciais e dispara evento user.create
// POST /login    — autentica e retorna { nome, email, authId }
// POST /perfil/atualizar/senha — atualiza senha com validação
// POST /eventos  — recebe eventos do Event Bus
// =============================================================

app.post(paths.auth.register, async (req, res) => {
    try {
        const payload = validarPayload(req.body?.payload);
        const email = validarCampoObrigatorio(payload.email, "email");
        const senha = validarCampoObrigatorio(payload.senha, "senha");
        const confirmarSenha = validarCampoObrigatorio(payload.confirmarSenha, "confirmarSenha");
        const nome = validarCampoObrigatorio(payload.nome, "nome");
        User.validarNome(nome);

        const result = authSchemaZod.safeParse({ email, senha, confirmarSenha });
        if (!result.success) {
            const errosFormatados = z.treeifyError(result.error).properties || {};
            const errors: Record<string, string[]> = {};

            for (const [tipo, erros] of Object.entries(errosFormatados)) {
                if (erros.errors.length > 0) {
                    errors[tipo] = erros.errors;
                }
            }
            return res.json(respostaErro({ status: 400, message: errors }));
        }

        const nomeResult = await axios.post(sendRequest, {
            request: request.user.name.valdate,
            payload: { nome },
        });
        const nomeValidation = nomeResult.data;
        if (nomeValidation.error) {
            return res.json(respostaErro({ status: nomeValidation.status, message: nomeValidation.message }));
        }

        const emailExiste = await findAuthByEmail(email);
        if (emailExiste) {
            return res.json({
                error: true,
                status: 409,
                message: { email: "Email já cadastrado" },
            });
        }

        const nomeExisteResult = await axios.post(sendRequest, {
            request: request.user.name.exits,
            payload: { nome },
        });
        const nomeExiste = nomeExisteResult.data;
        if (nomeExiste.error) {
            return res.json(respostaErro({ status: nomeExiste.status, message: nomeExiste.message }));
        }

        const auth = await createAuth({ email, senha });

        await axios.post(sendEvent, {
            event: events.user.register,
            payload: {
                authId: auth._id,
                nome,
            },
        });

        return res.json({
            error: false,
            status: 201,
            message: "Usuário cadastrado",
        });
    } catch (e) {
        return res.json(handleRouteError(e, { service: serverName, route: paths.auth.register }, () =>
            respostaErro({ e })
        ));
    }
});

app.post(paths.auth.login, async (req, res) => {
    try {
        const payload = validarPayload(req.body?.payload);
        const email = validarCampoObrigatorio(payload.email, "email");
        const senha = validarCampoObrigatorio(payload.senha, "senha");

        const autentificacao = await findAuthByEmail(email);

        if (!autentificacao) {
            return res.json(
                respostaErro({
                    status: 401,
                    message: "Email não encontrado",
                })
            );
        }

        if (!autentificacao.usuarioCadastrado) {
            await axios.post(sendEvent, {
                event: events.user["not.register"],
                payload: {
                    id: autentificacao._id,
                    email: autentificacao.email,
                },
            });
            return res.json({
                error: true,
                status: 500,
                message: "Erro durante cadastro. Por favor tente novamente.",
            });
        }

        const senhaHash = resolveSenhaHash(autentificacao);
        if (!senhaHash) {
            return res.json(
                respostaErro({
                    status: 500,
                    message: "Conta com dados de autenticação inválidos",
                })
            );
        }

        const senhaCorreta = await bcrypt.compare(senha, senhaHash);
        if (!senhaCorreta) {
            return res.json(
                respostaErro({
                    status: 401,
                    message: "Senha inválida",
                })
            );
        }

        const result = await axios.post(sendRequest, {
            request: request.user.name.tell,
            payload: { authId: autentificacao._id },
        });

        const { content } = result.data;
        const { nome } = content;

        return res.json({
            error: false,
            status: 200,
            message: "Login OK",
            content: {
                usuario: {
                    nome,
                    email: autentificacao.email,
                    authId: String(autentificacao._id),
                },
            },
        });
    } catch (e) {
        return res.json(handleRouteError(e, { service: serverName, route: paths.auth.login }, () =>
            respostaErro({ e })
        ));
    }
});

app.post(paths.auth.update.password, async (req, res) => {
    try {
        const payload = validarPayload(req.body?.payload);
        const email = validarCampoObrigatorio(payload.email, "email");
        const senha = validarCampoObrigatorio(payload.senha, "senha");
        const confirmarSenha = validarCampoObrigatorio(payload.confirmarSenha, "confirmarSenha");

        const usuario = await findAuthByEmail(email);
        if (!usuario) {
            return res.json(
                respostaErro({
                    status: 404,
                    message: "Usuário não encontrado",
                })
            );
        }

        const result = authSchemaZod.safeParse({ email, senha, confirmarSenha });
        if (!result.success) {
            const errosFormatados = z.treeifyError(result.error).properties || {};
            const errors: Record<string, string[]> = {};

            for (const [tipo, erros] of Object.entries(errosFormatados)) {
                if (erros.errors.length > 0) {
                    errors[tipo] = erros.errors;
                }
            }
            return res.json(respostaErro({ status: 400, message: errors }));
        }

        await updateSenhaByEmail(email, senha);

        return res.json({
            status: 200,
            error: false,
            message: "Senha atualizada",
        });
    } catch (e) {
        return res.json(handleRouteError(e, { service: serverName, route: paths.auth.update.password }, () =>
            respostaErro({ e })
        ));
    }
});

app.post(paths.events.event, (req, res) => {
    const { event, payload } = req.body;
    eventFunctions[event]?.(payload);
    res.end();
});

// #endregion

// =============================================================
// #region INICIALIZAÇÃO DO SERVIDOR
// Conecta ao MongoDB, sobe o Express e se inscreve no Event Bus
// Ordem: MongoDB → listen → inscrição no Event Bus
// =============================================================

const startServer = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI não definida no .env");
        }

        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "autentification",
        });
        console.log("Mongo conectado");

        const server = app.listen(PORT, () => {
            console.log(`Rodando em ${config.url}:${PORT}`);
            console.log(subscribe);
        });

        await axios.post(`${config.url}:${svc.eventBus}${paths.events.subscribe}`, {
            calbackUrl: calbackUrl,
            serviceName: serverName,
            events: subscribe,
        });

        console.log("Serviço de autentificação inscrito");

        return server;
    } catch (err) {
        console.error("Falha ao iniciar servidor:", err);
        process.exit(1);
    }
};

let servidor: any;

async function gracefulShutdown(_signal: string) {
    await axios.post(`${config.url}:${svc.eventBus}${paths.events.unsubscribe}`, {
        calbackUrl: calbackUrl,
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

// #endregion

startServer().then((server) => {
    servidor = server;
});
