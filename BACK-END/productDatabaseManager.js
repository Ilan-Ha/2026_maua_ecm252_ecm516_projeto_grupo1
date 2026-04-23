import mongoose from "mongoose";
// Categoria
const categoriaSchema = new mongoose.Schema({
  nome: String,
  tag: { type: String, unique: true },
  imagem: String
});
// Produto
const produtoSchema = new mongoose.Schema({
  nome: String,
  imagem: String,
  categoriaTag: { type: String, index: true }
});
//Categoria
const Categoria =
  mongoose.models.Categoria || mongoose.model("Categoria", categoriaSchema);
//Produto
const Produto =
  mongoose.models.Produto || mongoose.model("Produto", produtoSchema);

// Seed
const categorias = [
  {
    nome: "Celulares",
    tag: "Celular",
    imagem: "https://static.vecteezy.com/system/resources/previews/000/576/831/original/smartphone-icon-vector-illustration.jpg"
  },
  {
    nome: "Placas de Vídeo",
    tag: "GPU",
    imagem: "https://tse1.mm.bing.net/th/id/OIP.HMW3NgXewMev1TjuoaKQuAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
  },
  {
    nome: "Geladeiras",
    tag: "Geladeira",
    imagem: "https://img.freepik.com/vetores-premium/vetor-de-icone-de-geladeira-em-design-moderno_777568-2353.jpg"
  },
  {
    nome: "Bicicletas",
    tag: "Bike",
    imagem: "https://th.bing.com/th/id/R.001d09dd02871412d7a578e3331f4084?rik=4HmPB4l%2fmd5JKw&pid=ImgRaw&r=0"
  }
];

const produtos = [
  { nome: "Celular Básico", imagem: "https://media.gazetadopovo.com.br/2017/02/1bb3d975c17784892d30e51965581b75-gpLarge.png", categoriaTag: "Celular" },

  { nome: "RTX 3060", imagem: "https://asset.msi.com/resize/image/global/product/product_1610444725b6aa81c4e74a8ea9fee28fdd225b58cc.png62405b38c58fe0f07fcef2367d8a9ba1/1024.png", categoriaTag: "GPU" },
  { nome: "RTX 4060", imagem: "https://tse1.mm.bing.net/th/id/OIP.H6HqWqSTkC7ysCvQOdLJyAHaF7?rs=1&pid=ImgDetMain&o=7&rm=3", categoriaTag: "GPU" },
  { nome: "RTX 4070", imagem: "https://www.pcgamesn.com/wp-content/sites/pcgamesn/2023/04/nvidia-rtx-4070-official-release-date-confirmed.jpg", categoriaTag: "GPU" },
  { nome: "RTX 4090", imagem: "https://www.custompc.com/wp-content/sites/custompc/2023/03/nvidia-geforce-rtx-4090-review-01.jpg", categoriaTag: "GPU" },

  { nome: "Geladeira Frost Free", imagem: "https://compradiretaempresas.vtexassets.com/arquivos/ids/165096/image-94a8f85961714fffb035754e421ec04e.jpg?v=637982452197800000", categoriaTag: "Geladeira" },
  { nome: "Geladeira Duplex", imagem: "https://images.samsung.com/is/image/samsung/p5/br/RF265BEAESG-AZ_006_R-Perspective.png?$ORIGIN_PNG$", categoriaTag: "Geladeira" },

  { nome: "Bike Urbana", imagem: "https://www.pedal.com.br/fotos/noticias/10266005-w1920.jpg", categoriaTag: "Bike" },
  { nome: "Bike Mountain", imagem: "https://tse1.mm.bing.net/th/id/OIP.IHm6NE-I5YOvx4cZYvmCnwHaE7?rs=1&pid=ImgDetMain&o=7&rm=3", categoriaTag: "Bike" },
  { nome: "Bike Speed", imagem: "https://tropixbike.com.br/wp-content/uploads/2024/02/image-2-1024x606.png", categoriaTag: "Bike" }
];

// Seed (reset seguro)
export async function initSeed() {
  await Categoria.deleteMany({});
  await Produto.deleteMany({});

  await Categoria.insertMany(categorias);
  await Produto.insertMany(produtos);
}

// Catalogo
export async function getCatalogo() {
  const [categorias, produtos] = await Promise.all([
    Categoria.find(),
    Produto.find()
  ]);

  const itens = {};

  for (const cat of categorias) {
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
    Categorias: categorias,
    Itens: itens
  };
}