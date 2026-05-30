import { Categoria } from "../models/category.model.js";

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

export async function initSeed() {
  for (const cat of categoriasPadrao) {
    await Categoria.updateOne(
      { tag: cat.tag },
      { $setOnInsert: cat },
      { upsert: true }
    );
  }
  console.log("[catalog] Categorias verificadas/inseridas");
}
