import express from "express";
import cors from "cors";
import axios from "axios";
import mongoose from "mongoose";
import { z } from "zod";
import config from "../utlis/config.js";
import getDirname from "../utlis/getDirname.js";
import loadEnv from "../utlis/loadEnv.js";

loadEnv(getDirname(import.meta.url));
mongoose.set("strictQuery", true);

const reviewSchema = new mongoose.Schema(
  {
    produtoId: { type: String, required: true, index: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    nome: { type: String, required: true, trim: true },
    estrelas: { type: Number, required: true, min: 1, max: 5 },
    comentario: { type: String, required: true, trim: true },
  },
  { timestamps: true, collection: "reviews" }
);

reviewSchema.index({ produtoId: 1, email: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);

const reviewSchemaZod = z.object({
  produtoId: z.string().trim().min(1, "Produto inválido"),
  email: z.string().email("Email inválido").trim().toLowerCase(),
  nome: z.string().trim().min(2, "Nome inválido").max(50),
  estrelas: z
    .number()
    .int("Estrelas deve ser um número inteiro")
    .min(1, "Mínimo 1 estrela")
    .max(5, "Máximo 5 estrelas"),
  comentario: z
    .string()
    .trim()
    .min(3, "Comentário muito curto")
    .max(500, "Comentário muito longo"),
});

const app = express();
app.use(cors());
app.use(express.json());

const svc = config.ports.back;
const paths = config.paths;
const events = config.events;
const PORT = svc.review;
const sendEvent = `${config.url}:${svc.eventBus}${paths.events.event}`;

function formatZodErrors(error) {
  const formatted = z.treeifyError(error).properties || {};
  const errors = {};
  for (const [field, info] of Object.entries(formatted)) {
    if (info.errors?.length > 0) {
      errors[field] = info.errors;
    }
  }
  return errors;
}

async function publishReviewCreated(review) {
  try {
    await axios.post(sendEvent, {
      event: events.review.created,
      payload: {
        produtoId: review.produtoId,
        reviewId: review._id.toString(),
        estrelas: review.estrelas,
      },
    });
  } catch (err) {
    console.error("[review] Falha ao publicar evento:", err.message);
  }
}

app.get("/health", (req, res) => {
  const dbOk = mongoose.connection.readyState === 1;
  res.json({
    backend: true,
    db: dbOk,
    status: dbOk ? "ok" : "degraded",
  });
});

app.get(`${paths.review.list}/:produtoId`, async (req, res) => {
  try {
    const { produtoId } = req.params;

    const [stats] = await Review.aggregate([
      { $match: { produtoId } },
      {
        $group: {
          _id: null,
          mediaEstrelas: { $avg: "$estrelas" },
          total: { $sum: 1 },
        },
      },
    ]);

    const reviews = await Review.find({ produtoId })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      mediaEstrelas: stats?.mediaEstrelas
        ? Math.round(stats.mediaEstrelas * 10) / 10
        : 0,
      total: stats?.total || 0,
      reviews: reviews.map((r) => ({
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
  } catch (err) {
    console.error("[review] Erro ao listar:", err.message);
    res.status(500).json({ message: "Erro ao carregar avaliações" });
  }
});

app.post(paths.review.create, async (req, res) => {
  try {
    const parsed = reviewSchemaZod.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Dados inválidos",
        errors: formatZodErrors(parsed.error),
      });
    }

    const { produtoId, email, nome, estrelas, comentario } = parsed.data;

    const review = await Review.findOneAndUpdate(
      { produtoId, email },
      { produtoId, email, nome, estrelas, comentario },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );

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
  } catch (err) {
    console.error("[review] Erro ao salvar:", err.message);
    res.status(500).json({ message: "Erro ao salvar avaliação" });
  }
});

app.use((req, res) => {
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
    console.error("[review] Falha ao iniciar:", err);
    process.exit(1);
  }
};

startServer();
