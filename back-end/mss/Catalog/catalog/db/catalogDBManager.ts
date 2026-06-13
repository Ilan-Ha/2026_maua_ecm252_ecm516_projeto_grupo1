import mongoose from "mongoose";
import { Produto } from "../entities/produto.ts";
import { Categoria } from "../entities/categoria.ts";
import { wrapDbOperation } from "../../../shared/errors/index.ts";

const produtoSchema = Produto.toMongoseSchema();
const categoriaSchema = Categoria.toMongoseSchema();
const CATEGORIA_COLLECTION = Categoria.collection;
const PRODUTO_COLLECTION = Produto.collection;

const categoriaModel =
    mongoose.models.Categoria || mongoose.model("Categoria", categoriaSchema);
const produtoModel =
    mongoose.models.Produto || mongoose.model("Produto", produtoSchema);

const categorias = [
    {
        nome: "Celulares",
        tag: "Celular",
        imagem: "https://static.vecteezy.com/system/resources/previews/000/576/831/original/smartphone-icon-vector-illustration.jpg",
    },
    {
        nome: "Placas de Vídeo",
        tag: "GPU",
        imagem: "https://tse1.mm.bing.net/th/id/OIP.HMW3NgXewMev1TjuoaKQuAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
    },
    {
        nome: "Geladeiras",
        tag: "Geladeira",
        imagem: "https://img.freepik.com/vetores-premium/vetor-de-icone-de-geladeira-em-design-moderno_777568-2353.jpg",
    },
    {
        nome: "Bicicletas",
        tag: "Bike",
        imagem: "https://th.bing.com/th/id/R.001d09dd02871412d7a578e3331f4084?rik=4HmPB4l%2fmd5JKw&pid=ImgRaw&r=0",
    },
];

export async function initSeed() {
    return wrapDbOperation("upsert", CATEGORIA_COLLECTION, async () => {
        for (const cat of categorias) {
            await categoriaModel.updateOne(
                { tag: cat.tag },
                { $setOnInsert: cat },
                { upsert: true }
            );
        }
        console.log("Categorias verificadas/inseridas");
    });
}

export async function getCatalogo() {
    return wrapDbOperation("find", CATEGORIA_COLLECTION, async () => {
        const [categoriasDb, produtos] = await Promise.all([
            categoriaModel.find(),
            produtoModel.find(),
        ]);

        const itens: Record<string, unknown[]> = {};

        for (const cat of categoriasDb) {
            itens[cat.tag.trim()] = [];
        }

        for (const prod of produtos) {
            const key = prod.categoriaTag?.trim();

            if (!key) continue;

            if (!itens[key]) {
                itens[key] = [];
            }

            itens[key].push(prod);
        }

        return {
            Categorias: categoriasDb,
            Itens: itens,
        };
    });
}

export async function getProdutoById(id: string) {
    return wrapDbOperation("findById", PRODUTO_COLLECTION, () => produtoModel.findById(id));
}
