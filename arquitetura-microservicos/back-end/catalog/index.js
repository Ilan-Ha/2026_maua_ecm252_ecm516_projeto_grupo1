import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import process from "node:process";
import config from "../utlis/config.js";
import getDirname from "../utlis/getDirname.js";
import loadEnv from "../utlis/loadEnv.js";

loadEnv(getDirname(import.meta.url));
mongoose.set("strictQuery", true);

const categoriaSchema = new mongoose.Schema({
  nome: String,
  tag: { type: String, unique: true },
  imagem: String,
});

const produtoSchema = new mongoose.Schema({
  nome: String,
  imagem: String,
  categoriaTag: { type: String, index: true },
  descricao: String,
  precoMedio: Number,
  lancamento: Number,
  marca: String,
  imagens: [String],
  especificacoes: Object,
  sitesCompra: [
    {
      loja: String,
      preco: Number,
      link: String,
    },
  ],
});

const Categoria =
  mongoose.models.Categoria || mongoose.model("Categoria", categoriaSchema);
const Produto =
  mongoose.models.Produto || mongoose.model("Produto", produtoSchema);

const categoriasPadrao = [
  {
    nome: "Celulares",
    tag: "Celular",
    imagem:
      "https://static.vecteezy.com/system/resources/previews/000/576/831/original/smartphone-icon-vector-illustration.jpg",
  },
  {
    nome: "Placas de Vídeo",
    tag: "GPU",
    imagem:
      "https://tse1.mm.bing.net/th/id/OIP.HMW3NgXewMev1TjuoaKQuAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
  },
  {
    nome: "Geladeiras",
    tag: "Geladeira",
    imagem:
      "https://img.freepik.com/vetores-premium/vetor-de-icone-de-geladeira-em-design-moderno_777568-2353.jpg",
  },
  {
    nome: "Bicicletas",
    tag: "Bike",
    imagem:
      "https://th.bing.com/th/id/R.001d09dd02871412d7a578e3331f4084?rik=4HmPB4l%2fmd5JKw&pid=ImgRaw&r=0",
  },
];

async function initSeed() {
  for (const cat of categoriasPadrao) {
    await Categoria.updateOne(
      { tag: cat.tag },
      { $setOnInsert: cat },
      { upsert: true }
    );
  }
  console.log("[catalog] Categorias verificadas/inseridas");
}

async function getCatalogo() {
  const [categorias, produtos] = await Promise.all([
    Categoria.find(),
    Produto.find(),
  ]);

  const itens = {};
  for (const cat of categorias) {
    itens[cat.tag.trim()] = [];
  }
  for (const prod of produtos) {
    const key = prod.categoriaTag?.trim();
    if (!key) continue;
    if (!itens[key]) itens[key] = [];
    itens[key].push(prod);
  }

  return { Categorias: categorias, Itens: itens };
}

const svc = config.ports.back;
const paths = config.paths;
const PORT = svc.catalog;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  const dbOk = mongoose.connection.readyState === 1;
  res.json({
    service: "catalog",
    backend: true,
    db: dbOk,
    status: dbOk ? "ok" : "degraded",
  });
});

app.get("/health/db", (req, res) => {
  const dbOk = mongoose.connection.readyState === 1;
  res.json({
    service: "catalog",
    db: dbOk,
    status: dbOk ? "ok" : "error",
  });
});

app.get(paths.catalog.catalog, async (req, res) => {
  try {
    const data = await getCatalogo();
    res.json(data);
  } catch (err) {
    console.error("[catalog] Erro ao carregar catálogo:", err);
    res.status(500).json({ error: "Erro ao carregar catálogo" });
  }
});

app.get("/produto/:id", async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id);
    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }
    res.json(produto);
  } catch {
    res.status(400).json({ error: "ID inválido" });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI não definida no .env");
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("[catalog] Mongo conectado");
    await initSeed();
    app.listen(PORT, () => {
      console.log(`[catalog] Rodando em ${config.url}:${PORT}`);
    });
  } catch (err) {
    console.error("[catalog] Falha ao iniciar:", err);
    process.exit(1);
  }
}

startServer();
