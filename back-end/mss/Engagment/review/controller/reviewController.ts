import express from "express";
import cors from "cors";
import axios from "axios";
import process from "node:process";
import mongoose from "mongoose";
import config from "../../../shared/utils/config.js";
import getDirname from "../../../shared/utils/getDirname.js";
import loadEnv from "../../../shared/utils/loadEnv.js";
import {
    findReviewsByProduto,
    getReviewStatsByProduto,
    upsertReview,
} from "../db/reviewDBManager.ts";
import { Review } from "../entities/review.ts";
import { logAppError, mapErrorToReviewResponse } from "../../../shared/errors/index.ts";
import { validarPayload } from "../../../shared/utils/routeValidation.ts";

loadEnv(getDirname(import.meta.url));
mongoose.set("strictQuery", true);

const app: any = express();
app.use(cors());
app.use(express.json());

const svc = config.ports.back;
const paths = config.paths;
const events = config.events;
const PORT = svc.review;
const serverName = "review";
const sendEvent = `${config.url}:${svc.eventBus}${paths.events.event}`;

async function publishReviewCreated(review: any) {
    try {
        await axios.post(sendEvent, {
            event: events.review.created,
            payload: {
                produtoId: review.produtoId,
                reviewId: review._id.toString(),
                estrelas: review.estrelas,
            },
        });
    } catch (err: any) {
        logAppError(err, { service: serverName, operation: "publishReviewCreated" });
    }
}

app.get("/health", (_req, res) => {
    const dbOk = mongoose.connection.readyState === 1;
    res.json({
        backend: true,
        db: dbOk,
        status: dbOk ? "ok" : "degraded",
    });
});

app.get(`${paths.review.list}/:produtoId`, async (req, res) => {
    try {
        Review.validarProdutoId(req.params.produtoId);
        const { produtoId } = req.params;

        const stats = await getReviewStatsByProduto(produtoId);
        const reviews = await findReviewsByProduto(produtoId);

        res.json({
            mediaEstrelas: stats?.mediaEstrelas
                ? Math.round(stats.mediaEstrelas * 10) / 10
                : 0,
            total: stats?.total || 0,
            reviews: reviews.map((r: any) => ({
                _id: r._id,
                produtoId: r.produtoId,
                email: r.email,
                nome: r.nome,
                estrelas: r.estrelas,
                comentario: r.comentario,
                createdAt: r.createdAt,
                updatedAt: r.updatedAt,
            })),
        });
    } catch (err: any) {
        try {
            const erro = mapErrorToReviewResponse(err);
            return res.status(erro.status).json(erro.body);
        } catch {
            logAppError(err, { service: serverName, route: `${paths.review.list}/:produtoId` });
            res.status(500).json({ message: "Erro ao carregar avaliações" });
        }
    }
});

app.post(paths.review.create, async (req, res) => {
    try {
        const dados = validarPayload(req.body);

        const review = await upsertReview({
            produtoId: String(dados.produtoId ?? ""),
            email: String(dados.email ?? ""),
            nome: String(dados.nome ?? ""),
            estrelas: dados.estrelas as number,
            comentario: String(dados.comentario ?? ""),
        });

        await publishReviewCreated(review);

        res.status(201).json({
            message: "Avaliação salva",
            review: {
                _id: review._id,
                produtoId: review.produtoId,
                email: review.email,
                nome: review.nome,
                estrelas: review.estrelas,
                comentario: review.comentario,
                createdAt: review.createdAt,
                updatedAt: review.updatedAt,
            },
        });
    } catch (err: any) {
        try {
            const erro = mapErrorToReviewResponse(err);
            return res.status(erro.status).json(erro.body);
        } catch {
            logAppError(err, { service: serverName, route: paths.review.create });
            res.status(500).json({ message: "Erro ao salvar avaliação" });
        }
    }
});

app.use((_req, res) => {
    res.status(404).json({ error: "Rota não encontrada" });
});

const startServer = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI não definida no .env");
        }

        await mongoose.connect(process.env.MONGO_URI, { dbName: "reviews" });
        console.log("[review] Mongo conectado");

        app.listen(PORT, () => {
            console.log(`[review] Rodando em ${config.url}:${PORT}`);
        });
    } catch (err) {
        logAppError(err, { service: serverName, operation: "startServer" });
        process.exit(1);
    }
};

startServer();
