import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
mongoose.connect(process.env.MONGO_URI);

// Schema
const produtoSchema = new mongoose.Schema({
  nome: String,
  imagem: String,
  categoriaTag: String,

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
      link: String
    }
  ]
});

// Model
const Produto = mongoose.model("Produto", produtoSchema);

// Inserção (caso não exista)
async function inserirProdutos() {
  const produtos = [
    {
      // Placa de vídeo

      nome: "RTX 4070",
      imagem:
        "https://www.pcgamesn.com/wp-content/sites/pcgamesn/2023/04/nvidia-rtx-4070-official-release-date-confirmed.jpg",

      categoriaTag: "GPU",

      descricao: "GPU gamer para jogos em 1440p e 4K.",

      precoMedio: 4299.90,

      lancamento: 2023,

      marca: "NVIDIA",

      imagens: [
        "https://www.pcgamesn.com/wp-content/sites/pcgamesn/2023/04/nvidia-rtx-4070-official-release-date-confirmed.jpg"
      ],

      especificacoes: {
        vram: "12GB",
        arquitetura: "Ada Lovelace",
        rayTracing: true
      },

      sitesCompra: [
        {
          loja: "Kabum",
          preco: 4199.90,
          link: "https://www.kabum.com.br"
        }
      ]
    },

    {
      nome: "RTX 4090",
      imagem:
        "https://www.custompc.com/wp-content/sites/custompc/2023/03/nvidia-geforce-rtx-4090-review-01.jpg",
      categoriaTag: "GPU",
      descricao: "GPU topo de linha para IA e jogos extremos.",
      precoMedio: 11999.90,
      lancamento: 2022,
      marca: "NVIDIA",
      imagens: [
        "https://www.custompc.com/wp-content/sites/custompc/2023/03/nvidia-geforce-rtx-4090-review-01.jpg"
      ],
      especificacoes: {
        vram: "24GB",
        arquitetura: "Ada Lovelace",
        rayTracing: true
      },
      sitesCompra: [
        {
          loja: "Terabyte",
          preco: 11899.90,
          link: "https://www.terabyteshop.com.br"
        }
      ]
    },
    {
      nome: "RTX 3060",
      imagem:
        "https://asset.msi.com/resize/image/global/product/product_1610444725b6aa81c4e74a8ea9fee28fdd225b58cc.png62405b38c58fe0f07fcef2367d8a9ba1/1024.png",
      categoriaTag: "GPU",
      descricao: "GPU custo-benefício para jogos em 1080p e 1440p.",
      precoMedio: 2199.90,
      lancamento: 2021,
      marca: "NVIDIA",
      imagens: [
        "https://asset.msi.com/resize/image/global/product/product_1610444725b6aa81c4e74a8ea9fee28fdd225b58cc.png62405b38c58fe0f07fcef2367d8a9ba1/1024.png"
      ],
      especificacoes: {
        vram: "12GB",
        arquitetura: "Ampere",
        rayTracing: true
      },
      sitesCompra: [
        {
          loja: "Pichau",
          preco: 2099.90,
          link: "https://www.pichau.com.br"
        },
        {
          loja: "Kabum",
          preco: 2149.90,
          link: "https://www.kabum.com.br"
        }
      ]
    },

    {
      nome: "RTX 4060",
      imagem:
        "https://tse1.mm.bing.net/th/id/OIP.H6HqWqSTkC7ysCvQOdLJyAHaF7?rs=1&pid=ImgDetMain&o=7&rm=3",
      categoriaTag: "GPU",
      descricao: "GPU intermediária eficiente para jogos em 1080p e 1440p.",
      precoMedio: 2799.90,
      lancamento: 2023,
      marca: "NVIDIA",
      imagens: [
        "https://tse1.mm.bing.net/th/id/OIP.H6HqWqSTkC7ysCvQOdLJyAHaF7?rs=1&pid=ImgDetMain&o=7&rm=3"
      ],
      especificacoes: {
        vram: "8GB",
        arquitetura: "Ada Lovelace",
        rayTracing: true
      },
      sitesCompra: [
        {
          loja: "Kabum",
          preco: 2699.90,
          link: "https://www.kabum.com.br"
        }
      ]
    },

    {
      nome: "RX 7900 XTX",
      imagem:
        "https://img.terabyteshop.com.br/produto/g/placa-de-video-gigabyte-amd-radeon-rx-7600-xt-gaming-oc-16gb-gddr6-fsr-ray-tracing-gv-r76xtgaming-oc-16gd_188716.png",
      categoriaTag: "GPU",
      descricao: "GPU AMD topo de linha para 4K e criação de conteúdo.",
      precoMedio: 7499.90,
      lancamento: 2022,
      marca: "AMD",
      imagens: [
        "https://img.terabyteshop.com.br/produto/g/placa-de-video-gigabyte-amd-radeon-rx-7600-xt-gaming-oc-16gb-gddr6-fsr-ray-tracing-gv-r76xtgaming-oc-16gd_188716.png"
      ],
      especificacoes: {
        vram: "24GB",
        arquitetura: "RDNA 3",
        rayTracing: true
      },
      sitesCompra: [
        {
          loja: "Terabyte",
          preco: 7299.90,
          link: "https://www.terabyteshop.com.br"
        },
        {
          loja: "Pichau",
          preco: 7399.90,
          link: "https://www.pichau.com.br"
        }
      ]
    },
    {
      nome: "RX 7800 XT",
      imagem:
        "https://www.amd.com/content/dam/amd/en/images/products/graphics/2648997-amd-radeon-7800xt.jpg",
      categoriaTag: "GPU",
      descricao: "GPU AMD intermediária para jogos em 1440p com excelente custo-benefício.",
      precoMedio: 3799.90,
      lancamento: 2023,
      marca: "AMD",
      imagens: [
        "https://www.amd.com/content/dam/amd/en/images/products/graphics/2648997-amd-radeon-7800xt.jpg"
      ],
      especificacoes: {
        vram: "16GB",
        arquitetura: "RDNA 3",
        rayTracing: true
      },
      sitesCompra: [
        {
          loja: "Kabum",
          preco: 3699.90,
          link: "https://www.kabum.com.br"
        },
        {
          loja: "Pichau",
          preco: 3749.90,
          link: "https://www.pichau.com.br"
        }
      ]
    },

    {
      nome: "RTX 4080 Super",
      imagem:
        "https://tpucdn.com/gpu-specs/images/c/4182-top.jpg",
      categoriaTag: "GPU",
      descricao: "GPU de alto desempenho para jogos em 4K e criação de conteúdo profissional.",
      precoMedio: 8499.90,
      lancamento: 2024,
      marca: "NVIDIA",
      imagens: [
        "https://tpucdn.com/gpu-specs/images/c/4182-top.jpg"
      ],
      especificacoes: {
        vram: "16GB",
        arquitetura: "Ada Lovelace",
        rayTracing: true,
        dlss: "DLSS 3.5"
      },
      sitesCompra: [
        {
          loja: "Terabyte",
          preco: 8299.90,
          link: "https://www.terabyteshop.com.br"
        },
        {
          loja: "Kabum",
          preco: 8399.90,
          link: "https://www.kabum.com.br"
        }
      ]
    },

    {
      nome: "Intel Arc A770",
      imagem:
        "https://www.yugatech.com/wp-content/uploads/2022/09/Intel-Arc-A770-desktop-graphics-1-1536x864.png",
      categoriaTag: "GPU",
      descricao: "GPU Intel de entrada com suporte a Ray Tracing e bom desempenho em 1080p.",
      precoMedio: 1899.90,
      lancamento: 2022,
      marca: "Intel",
      imagens: [
        "https://www.yugatech.com/wp-content/uploads/2022/09/Intel-Arc-A770-desktop-graphics-1-1536x864.png"
      ],
      especificacoes: {
        vram: "16GB",
        arquitetura: "Xe HPG (Alchemist)",
        rayTracing: true
      },
      sitesCompra: [
        {
          loja: "Pichau",
          preco: 1799.90,
          link: "https://www.pichau.com.br"
        }
      ]
    },

    {
      nome: "RX 7600",
      imagem:
        "https://www.bing.com/th?id=OPHS.%2fxQViqZhI7zcDg474C474&o=5&pid=21.1&w=128&h=128&qlt=100&dpr=1&o=2&bw=6&bc=FFFFFF",
      categoriaTag: "GPU",
      descricao: "GPU AMD de entrada para jogos em 1080p com ótima eficiência energética.",
      precoMedio: 1999.90,
      lancamento: 2023,
      marca: "AMD",
      imagens: [
        "https://www.bing.com/th?id=OPHS.%2fxQViqZhI7zcDg474C474&o=5&pid=21.1&w=128&h=128&qlt=100&dpr=1&o=2&bw=6&bc=FFFFFF"
      ],
      especificacoes: {
        vram: "8GB",
        arquitetura: "RDNA 3",
        rayTracing: true
      },
      sitesCompra: [
        {
          loja: "Kabum",
          preco: 1899.90,
          link: "https://www.kabum.com.br"
        },
        {
          loja: "Terabyte",
          preco: 1949.90,
          link: "https://www.terabyteshop.com.br"
        }
      ]
    },

    // ── Celulares ──

    {
      nome: "iPhone 15 Pro Max",
      imagem:
        "https://tse4.mm.bing.net/th/id/OIP.HiIn6ftndp34b0G88wiNvQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
      categoriaTag: "Celular",
      descricao: "Smartphone premium da Apple com chip A17 Pro e câmera de 48MP.",
      precoMedio: 9499.90,
      lancamento: 2023,
      marca: "Apple",
      imagens: [
        "https://tse4.mm.bing.net/th/id/OIP.HiIn6ftndp34b0G88wiNvQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
      ],
      especificacoes: {
        tela: "6.7 polegadas OLED",
        processador: "A17 Pro",
        ram: "8GB",
        armazenamento: "256GB",
        camera: "48MP + 12MP + 12MP",
        bateria: "4441 mAh"
      },
      sitesCompra: [
        {
          loja: "Magazine Luiza",
          preco: 9299.90,
          link: "https://www.magazineluiza.com.br"
        },
        {
          loja: "Amazon",
          preco: 9399.90,
          link: "https://www.amazon.com.br"
        }
      ]
    },

    {
      nome: "Samsung Galaxy S24 Ultra",
      imagem:
        "https://image-us.samsung.com/us/smartphones/galaxy-s24/all-gallery/01_E3_OnlineExclusive_TitaniumBlue_Lockup_1600x1200.jpg?$product-details-jpg$?$product-details-thumbnail-jpg$",
      categoriaTag: "Celular",
      descricao: "Smartphone Android topo de linha com S Pen e câmera de 200MP.",
      precoMedio: 8999.90,
      lancamento: 2024,
      marca: "Samsung",
      imagens: [
        "https://image-us.samsung.com/us/smartphones/galaxy-s24/all-gallery/01_E3_OnlineExclusive_TitaniumBlue_Lockup_1600x1200.jpg?$product-details-jpg$?$product-details-thumbnail-jpg$"
      ],
      especificacoes: {
        tela: "6.8 polegadas Dynamic AMOLED 2X",
        processador: "Snapdragon 8 Gen 3",
        ram: "12GB",
        armazenamento: "256GB",
        camera: "200MP + 50MP + 12MP + 10MP",
        bateria: "5000 mAh"
      },
      sitesCompra: [
        {
          loja: "Kabum",
          preco: 8799.90,
          link: "https://www.kabum.com.br"
        },
        {
          loja: "Casas Bahia",
          preco: 8899.90,
          link: "https://www.casasbahia.com.br"
        }
      ]
    },

    {
      nome: "Xiaomi 14 Ultra",
      imagem:
        "https://i02.appmifile.com/334_operator_sg/22/02/2024/d36105f6de5a716a1c0737352c2827be.png",
      categoriaTag: "Celular",
      descricao: "Flagship Xiaomi com câmera Leica e carregamento rápido de 90W.",
      precoMedio: 6499.90,
      lancamento: 2024,
      marca: "Xiaomi",
      imagens: [
        "https://i02.appmifile.com/334_operator_sg/22/02/2024/d36105f6de5a716a1c0737352c2827be.png"
      ],
      especificacoes: {
        tela: "6.73 polegadas AMOLED",
        processador: "Snapdragon 8 Gen 3",
        ram: "16GB",
        armazenamento: "512GB",
        camera: "50MP Leica + 50MP + 50MP",
        bateria: "5300 mAh"
      },
      sitesCompra: [
        {
          loja: "Amazon",
          preco: 6299.90,
          link: "https://www.amazon.com.br"
        }
      ]
    },

    {
      nome: "Motorola Edge 40 Pro",
      imagem:
        "https://tse3.mm.bing.net/th/id/OIP.yYZbnh2p8k8ipXN_GjKHtAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
      categoriaTag: "Celular",
      descricao: "Smartphone Motorola premium com tela curva e carregamento de 125W.",
      precoMedio: 4299.90,
      lancamento: 2023,
      marca: "Motorola",
      imagens: [
        "https://tse3.mm.bing.net/th/id/OIP.yYZbnh2p8k8ipXN_GjKHtAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
      ],
      especificacoes: {
        tela: "6.67 polegadas pOLED",
        processador: "Snapdragon 8 Gen 2",
        ram: "12GB",
        armazenamento: "256GB",
        camera: "50MP + 50MP + 12MP",
        bateria: "4600 mAh"
      },
      sitesCompra: [
        {
          loja: "Magazine Luiza",
          preco: 4099.90,
          link: "https://www.magazineluiza.com.br"
        },
        {
          loja: "Americanas",
          preco: 4199.90,
          link: "https://www.americanas.com.br"
        }
      ]
    },
    {
      nome: "Samsung Galaxy A55",
      imagem:
        "https://www.bing.com/th?id=OPHS.rq7kVd4LEtBMTg474C474&o=5&pid=21.1&w=128&h=168&qlt=100&dpr=1&o=2&bw=6&bc=FFFFFF",
      categoriaTag: "Celular",
      descricao: "Smartphone intermediário Samsung com tela Super AMOLED e proteção IP67.",
      precoMedio: 2299.90,
      lancamento: 2024,
      marca: "Samsung",
      imagens: [
        "https://www.bing.com/th?id=OPHS.rq7kVd4LEtBMTg474C474&o=5&pid=21.1&w=128&h=168&qlt=100&dpr=1&o=2&bw=6&bc=FFFFFF"
      ],
      especificacoes: {
        tela: "6.6 polegadas Super AMOLED",
        processador: "Exynos 1480",
        ram: "8GB",
        armazenamento: "128GB",
        camera: "50MP + 12MP + 5MP",
        bateria: "5000 mAh"
      },
      sitesCompra: [
        {
          loja: "Magazine Luiza",
          preco: 2199.90,
          link: "https://www.magazineluiza.com.br"
        },
        {
          loja: "Amazon",
          preco: 2249.90,
          link: "https://www.amazon.com.br"
        }
      ]
    },

    {
      nome: "iPhone 14",
      imagem:
        "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-blue-select-202209",
      categoriaTag: "Celular",
      descricao: "iPhone com chip A15 Bionic, tela de 6.1 polegadas e câmera dupla.",
      precoMedio: 5499.90,
      lancamento: 2022,
      marca: "Apple",
      imagens: [
        "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-blue-select-202209"
      ],
      especificacoes: {
        tela: "6.1 polegadas OLED",
        processador: "A15 Bionic",
        ram: "6GB",
        armazenamento: "128GB",
        camera: "12MP + 12MP",
        bateria: "3279 mAh"
      },
      sitesCompra: [
        {
          loja: "Kabum",
          preco: 5299.90,
          link: "https://www.kabum.com.br"
        },
        {
          loja: "Casas Bahia",
          preco: 5399.90,
          link: "https://www.casasbahia.com.br"
        }
      ]
    },

    {
      nome: "Xiaomi Redmi Note 13 Pro",
      imagem:
        "https://www.bing.com/th?id=OPHS.Aist2IPhX2BENw474C474&o=5&pid=21.1&w=128&h=168&qlt=100&dpr=1&o=2&bw=6&bc=FFFFFF",
      categoriaTag: "Celular",
      descricao: "Smartphone Xiaomi com câmera de 200MP e carregamento rápido de 67W.",
      precoMedio: 1799.90,
      lancamento: 2024,
      marca: "Xiaomi",
      imagens: [
        "https://www.bing.com/th?id=OPHS.Aist2IPhX2BENw474C474&o=5&pid=21.1&w=128&h=168&qlt=100&dpr=1&o=2&bw=6&bc=FFFFFF"
      ],
      especificacoes: {
        tela: "6.67 polegadas AMOLED",
        processador: "Snapdragon 7s Gen 2",
        ram: "8GB",
        armazenamento: "256GB",
        camera: "200MP + 8MP + 2MP",
        bateria: "5100 mAh"
      },
      sitesCompra: [
        {
          loja: "Amazon",
          preco: 1699.90,
          link: "https://www.amazon.com.br"
        },
        {
          loja: "Magazine Luiza",
          preco: 1749.90,
          link: "https://www.magazineluiza.com.br"
        }
      ]
    },

    {
      nome: "Google Pixel 8 Pro",
      imagem:
        "https://static1.howtogeekimages.com/wordpress/wp-content/uploads/2023/11/pixel-8pro.png",
      categoriaTag: "Celular",
      descricao: "Smartphone Google com IA avançada, chip Tensor G3 e câmera profissional.",
      precoMedio: 6999.90,
      lancamento: 2023,
      marca: "Google",
      imagens: [
        "https://static1.howtogeekimages.com/wordpress/wp-content/uploads/2023/11/pixel-8pro.png"
      ],
      especificacoes: {
        tela: "6.7 polegadas LTPO OLED",
        processador: "Google Tensor G3",
        ram: "12GB",
        armazenamento: "128GB",
        camera: "50MP + 48MP + 48MP",
        bateria: "5050 mAh"
      },
      sitesCompra: [
        {
          loja: "Amazon",
          preco: 6799.90,
          link: "https://www.amazon.com.br"
        }
      ]
    },

    {
      nome: "Motorola Moto G84",
      imagem:
        "https://i5.walmartimages.com.mx/mg/gm/1p/images/product-images/img_large/00762765199978l.jpg",
      categoriaTag: "Celular",
      descricao: "Smartphone Motorola intermediário com tela pOLED de 120Hz e som estéreo Dolby Atmos.",
      precoMedio: 1499.90,
      lancamento: 2023,
      marca: "Motorola",
      imagens: [
        "https://i5.walmartimages.com.mx/mg/gm/1p/images/product-images/img_large/00762765199978l.jpg"
      ],
      especificacoes: {
        tela: "6.55 polegadas pOLED 120Hz",
        processador: "Snapdragon 695",
        ram: "8GB",
        armazenamento: "256GB",
        camera: "50MP + 8MP",
        bateria: "5000 mAh"
      },
      sitesCompra: [
        {
          loja: "Casas Bahia",
          preco: 1399.90,
          link: "https://www.casasbahia.com.br"
        },
        {
          loja: "Americanas",
          preco: 1449.90,
          link: "https://www.americanas.com.br"
        }
      ]
    },

    // ── Geladeiras ──

    {
      nome: "Geladeira Brastemp Frost Free 375L",
      imagem:
        "https://brastemp.vtexassets.com/arquivos/ids/285442-1600-auto?v=639120439093400000&width=1600&height=auto&aspect=true",
      categoriaTag: "Geladeira",
      descricao: "Geladeira duplex Frost Free com compartimento extra frio.",
      precoMedio: 3299.90,
      lancamento: 2023,
      marca: "Brastemp",
      imagens: [
        "https://brastemp.vtexassets.com/arquivos/ids/285442-1600-auto?v=639120439093400000&width=1600&height=auto&aspect=true"
      ],
      especificacoes: {
        capacidade: "375 litros",
        tipo: "Duplex Frost Free",
        eficienciaEnergetica: "A",
        corExterna: "Inox",
        voltagem: "220V"
      },
      sitesCompra: [
        {
          loja: "Magazine Luiza",
          preco: 3199.90,
          link: "https://www.magazineluiza.com.br"
        },
        {
          loja: "Casas Bahia",
          preco: 3249.90,
          link: "https://www.casasbahia.com.br"
        }
      ]
    },

    {
      nome: "Refrigerador French Door Electrolux Frost Free com 484 Litros",
      imagem:
        "https://fastshopbr.vtexassets.com/arquivos/ids/4739201-540-auto/0_2b5d20e4-c8a1-40f1-b6f6-4dfd2df653c2.jpeg.webp?v=639136684102100000&quality=8",
      categoriaTag: "Geladeira",
      descricao: "Geladeira Electrolux Frost Free Inverter 480L Efficient AutoSense 3 Portas Inox Look (IM7S), Tecnologia AutoSense, Gaveta HortiNatura, Tecnologia Inverter, TasteGuard, Fit the home e IceMax.",
      precoMedio: 5888.00,
      lancamento: 2023,
      marca: "Electrolux",
      imagens: [
        "https://fastshopbr.vtexassets.com/arquivos/ids/4739201-540-auto/0_2b5d20e4-c8a1-40f1-b6f6-4dfd2df653c2.jpeg.webp?v=639136684102100000&quality=8"
      ],
      especificacoes: {
        capacidade: "579 litros",
        tipo: "French Door Frost Free",
        eficienciaEnergetica: "A",
        corExterna: "Inox",
        voltagem: "Bivolt"
      },
      sitesCompra: [
        {
          loja: "Amazon",
          preco: 5799.90,
          link: "https://www.amazon.com.br"
        }
      ]
    },

    {
      nome: "Geladeira Samsung Side by Side 602L",
      imagem:
        "https://images.samsung.com/is/image/samsung/p5/br/RF265BEAESG-AZ_006_R-Perspective.png",
      categoriaTag: "Geladeira",
      descricao: "Geladeira Side by Side com dispenser de água e gelo na porta.",
      precoMedio: 6499.90,
      lancamento: 2023,
      marca: "Samsung",
      imagens: [
        "https://images.samsung.com/is/image/samsung/p5/br/RF265BEAESG-AZ_006_R-Perspective.png"
      ],
      especificacoes: {
        capacidade: "602 litros",
        tipo: "Side by Side",
        eficienciaEnergetica: "A",
        corExterna: "Inox Look",
        voltagem: "220V",
        dispenserAgua: true
      },
      sitesCompra: [
        {
          loja: "Magazine Luiza",
          preco: 6299.90,
          link: "https://www.magazineluiza.com.br"
        },
        {
          loja: "Kabum",
          preco: 6399.90,
          link: "https://www.kabum.com.br"
        }
      ]
    },

    {
      nome: "Geladeira Consul 340L",
      imagem:
        "https://m.media-amazon.com/images/I/315ViJS9TvL._AC_SX679_.jpg",
      categoriaTag: "Geladeira",
      descricao: "Geladeira compacta Frost Free ideal para apartamentos pequenos.",
      precoMedio: 2199.90,
      lancamento: 2022,
      marca: "Consul",
      imagens: [
        "https://m.media-amazon.com/images/I/315ViJS9TvL._AC_SX679_.jpg"
      ],
      especificacoes: {
        capacidade: "340 litros",
        tipo: "Duplex Frost Free",
        eficienciaEnergetica: "A",
        corExterna: "Branco",
        voltagem: "110V"
      },
      sitesCompra: [
        {
          loja: "Casas Bahia",
          preco: 2099.90,
          link: "https://www.casasbahia.com.br"
        }
      ]
    },
    {
      nome: "Geladeira LG French Door 525L",
      imagem:
        "https://cdn.leroymerlin.com.br/products/geladeira_smart_lg_french_door_,inverter_525l_preto_fosco_c_1567799593_9a54_600x600.jpg",
      categoriaTag: "Geladeira",
      descricao: "Geladeira LG French Door com Door-in-Door e inverter compressor.",
      precoMedio: 8999.90,
      lancamento: 2023,
      marca: "LG",
      imagens: [
        "https://cdn.leroymerlin.com.br/products/geladeira_smart_lg_french_door_,inverter_525l_preto_fosco_c_1567799593_9a54_600x600.jpg"
      ],
      especificacoes: {
        capacidade: "525 litros",
        tipo: "French Door",
        eficienciaEnergetica: "A++",
        corExterna: "Inox",
        voltagem: "Bivolt",
        inverterCompressor: true
      },
      sitesCompra: [
        {
          loja: "Magazine Luiza",
          preco: 8799.90,
          link: "https://www.magazineluiza.com.br"
        },
        {
          loja: "Amazon",
          preco: 8899.90,
          link: "https://www.amazon.com.br"
        }
      ]
    },

    {
      nome: "Geladeira Brastemp Inverse 443L",
      imagem:
        "https://www.frigelar.com.br/ccstore/v1/images/?source=/file/v7957207479638538637/products/kit2907_10.jpg&height=475&width=475",
      categoriaTag: "Geladeira",
      descricao: "Geladeira inverse com freezer embaixo, ideal para famílias grandes.",
      precoMedio: 4499.90,
      lancamento: 2023,
      marca: "Brastemp",
      imagens: [
        "https://www.frigelar.com.br/ccstore/v1/images/?source=/file/v7957207479638538637/products/kit2907_10.jpg&height=475&width=475"
      ],
      especificacoes: {
        capacidade: "443 litros",
        tipo: "Inverse Frost Free",
        eficienciaEnergetica: "A",
        corExterna: "Inox",
        voltagem: "110V"
      },
      sitesCompra: [
        {
          loja: "Casas Bahia",
          preco: 4299.90,
          link: "https://www.casasbahia.com.br"
        },
        {
          loja: "Kabum",
          preco: 4399.90,
          link: "https://www.kabum.com.br"
        }
      ]
    },

    {
      nome: "Geladeira Electrolux Top Freezer 431L",
      imagem:
        "https://electrolux.vtexassets.com/arquivos/ids/232600/Geladeira-Electrolux-Top-Freezer-431-litros-TF55S.png",
      categoriaTag: "Geladeira",
      descricao: "Geladeira duplex com prateleiras de vidro temperado e controle de temperatura.",
      precoMedio: 2899.90,
      lancamento: 2022,
      marca: "Electrolux",
      imagens: [
        "https://electrolux.vtexassets.com/arquivos/ids/232600/Geladeira-Electrolux-Top-Freezer-431-litros-TF55S.png"
      ],
      especificacoes: {
        capacidade: "431 litros",
        tipo: "Top Freezer Frost Free",
        eficienciaEnergetica: "A",
        corExterna: "Platinum",
        voltagem: "220V"
      },
      sitesCompra: [
        {
          loja: "Magazine Luiza",
          preco: 2799.90,
          link: "https://www.magazineluiza.com.br"
        }
      ]
    },

    {
      nome: "Geladeira Panasonic Econavi 480L",
      imagem:
        "https://panasonic.vtexassets.com/arquivos/ids/200123/NR-BB71GVFB-01.png",
      categoriaTag: "Geladeira",
      descricao: "Geladeira Panasonic com tecnologia Econavi para economia de energia inteligente.",
      precoMedio: 4999.90,
      lancamento: 2023,
      marca: "Panasonic",
      imagens: [
        "https://panasonic.vtexassets.com/arquivos/ids/200123/NR-BB71GVFB-01.png"
      ],
      especificacoes: {
        capacidade: "480 litros",
        tipo: "Bottom Freezer Frost Free",
        eficienciaEnergetica: "A+",
        corExterna: "Aço Escovado",
        voltagem: "Bivolt",
        econavi: true
      },
      sitesCompra: [
        {
          loja: "Amazon",
          preco: 4799.90,
          link: "https://www.amazon.com.br"
        },
        {
          loja: "Magazine Luiza",
          preco: 4899.90,
          link: "https://www.magazineluiza.com.br"
        }
      ]
    },

    // ── Bicicletas ──

    {
      nome: "Caloi Elite Carbon Racing",
      imagem:
        "https://www.pedal.com.br/fotos/noticias/10266005-w1920.jpg",
      categoriaTag: "Bike",
      descricao: "Bicicleta de mountain bike em carbono para competições XCO.",
      precoMedio: 14999.90,
      lancamento: 2024,
      marca: "Caloi",
      imagens: [
        "https://www.pedal.com.br/fotos/noticias/10266005-w1920.jpg"
      ],
      especificacoes: {
        quadro: "Carbono",
        aro: "29 polegadas",
        marchas: "12 velocidades",
        suspensao: "Dianteira Rock Shox SID",
        freios: "Disco hidráulico",
        peso: "10.5 kg"
      },
      sitesCompra: [
        {
          loja: "Netshoes",
          preco: 14499.90,
          link: "https://www.netshoes.com.br"
        },
        {
          loja: "Bike Plus",
          preco: 14799.90,
          link: "https://www.bikeplus.com.br"
        }
      ]
    },

    {
      nome: "Sense Impact SL",
      imagem:
        "https://www.bikemagazine.com.br/wp-content/uploads/2023/01/sense-impact-sl-2023.jpg",
      categoriaTag: "Bike",
      descricao: "Mountain bike intermediária com quadro em alumínio e suspensão a ar.",
      precoMedio: 6999.90,
      lancamento: 2023,
      marca: "Sense",
      imagens: [
        "https://www.bikemagazine.com.br/wp-content/uploads/2023/01/sense-impact-sl-2023.jpg"
      ],
      especificacoes: {
        quadro: "Alumínio",
        aro: "29 polegadas",
        marchas: "12 velocidades",
        suspensao: "Dianteira a ar",
        freios: "Disco hidráulico",
        peso: "13.2 kg"
      },
      sitesCompra: [
        {
          loja: "Bike Plus",
          preco: 6799.90,
          link: "https://www.bikeplus.com.br"
        }
      ]
    },

    {
      nome: "Specialized Allez Sprint",
      imagem:
        "https://tropixbike.com.br/wp-content/uploads/2024/02/image-2-1024x606.png",
      categoriaTag: "Bike",
      descricao: "Bicicleta speed de alta performance para estrada e competições.",
      precoMedio: 12499.90,
      lancamento: 2024,
      marca: "Specialized",
      imagens: [
        "https://tropixbike.com.br/wp-content/uploads/2024/02/image-2-1024x606.png"
      ],
      especificacoes: {
        quadro: "Alumínio D'Aluisio SmartWeld",
        aro: "700c",
        marchas: "22 velocidades",
        suspensao: "Nenhuma (speed)",
        freios: "Disco hidráulico",
        peso: "8.9 kg"
      },
      sitesCompra: [
        {
          loja: "Netshoes",
          preco: 12299.90,
          link: "https://www.netshoes.com.br"
        },
        {
          loja: "Amazon",
          preco: 12399.90,
          link: "https://www.amazon.com.br"
        }
      ]
    },

    {
      nome: "Oggi Big Wheel 7.0",
      imagem:
        "https://tse1.mm.bing.net/th/id/OIP.IHm6NE-I5YOvx4cZYvmCnwHaE7?rs=1&pid=ImgDetMain&o=7&rm=3",
      categoriaTag: "Bike",
      descricao: "Mountain bike de entrada com ótimo custo-benefício para trilhas leves.",
      precoMedio: 3799.90,
      lancamento: 2023,
      marca: "Oggi",
      imagens: [
        "https://tse1.mm.bing.net/th/id/OIP.IHm6NE-I5YOvx4cZYvmCnwHaE7?rs=1&pid=ImgDetMain&o=7&rm=3"
      ],
      especificacoes: {
        quadro: "Alumínio 6061",
        aro: "29 polegadas",
        marchas: "18 velocidades",
        suspensao: "Dianteira mola",
        freios: "Disco mecânico",
        peso: "14.8 kg"
      },
      sitesCompra: [
        {
          loja: "Magazine Luiza",
          preco: 3599.90,
          link: "https://www.magazineluiza.com.br"
        },
        {
          loja: "Casas Bahia",
          preco: 3699.90,
          link: "https://www.casasbahia.com.br"
        }
      ]
    },
    {
      nome: "Groove Hype 50",
      imagem:
        "https://www.groovebikes.com.br/wp-content/uploads/2023/01/hype-50-azul.jpg",
      categoriaTag: "Bike",
      descricao: "Mountain bike de entrada ideal para iniciantes em trilhas e uso urbano.",
      precoMedio: 2199.90,
      lancamento: 2023,
      marca: "Groove",
      imagens: [
        "https://www.groovebikes.com.br/wp-content/uploads/2023/01/hype-50-azul.jpg"
      ],
      especificacoes: {
        quadro: "Alumínio 6061",
        aro: "29 polegadas",
        marchas: "21 velocidades",
        suspensao: "Dianteira mola",
        freios: "Disco mecânico",
        peso: "15.5 kg"
      },
      sitesCompra: [
        {
          loja: "Netshoes",
          preco: 2099.90,
          link: "https://www.netshoes.com.br"
        },
        {
          loja: "Magazine Luiza",
          preco: 2149.90,
          link: "https://www.magazineluiza.com.br"
        }
      ]
    },

    {
      nome: "Cannondale Trail 5",
      imagem:
        "https://www.cannondale.com/media/catalog/product/c/a/cannondale-trail-5-2024.png",
      categoriaTag: "Bike",
      descricao: "Mountain bike premium com suspensão RockShox e câmbio Shimano Deore.",
      precoMedio: 8999.90,
      lancamento: 2024,
      marca: "Cannondale",
      imagens: [
        "https://www.cannondale.com/media/catalog/product/c/a/cannondale-trail-5-2024.png"
      ],
      especificacoes: {
        quadro: "Alumínio SmartForm C2",
        aro: "29 polegadas",
        marchas: "12 velocidades",
        suspensao: "RockShox Judy Silver",
        freios: "Disco hidráulico Shimano",
        peso: "13.0 kg"
      },
      sitesCompra: [
        {
          loja: "Bike Plus",
          preco: 8799.90,
          link: "https://www.bikeplus.com.br"
        }
      ]
    },

    {
      nome: "Caloi City Tour Sport",
      imagem:
        "https://www.caloi.com/media/catalog/product/c/a/caloi-city-tour-sport-2024.png",
      categoriaTag: "Bike",
      descricao: "Bicicleta urbana confortável com quadro em alumínio e câmbio Shimano.",
      precoMedio: 1899.90,
      lancamento: 2024,
      marca: "Caloi",
      imagens: [
        "https://www.caloi.com/media/catalog/product/c/a/caloi-city-tour-sport-2024.png"
      ],
      especificacoes: {
        quadro: "Alumínio",
        aro: "700c",
        marchas: "7 velocidades",
        suspensao: "Dianteira mola",
        freios: "V-Brake",
        peso: "13.8 kg"
      },
      sitesCompra: [
        {
          loja: "Magazine Luiza",
          preco: 1799.90,
          link: "https://www.magazineluiza.com.br"
        },
        {
          loja: "Americanas",
          preco: 1849.90,
          link: "https://www.americanas.com.br"
        }
      ]
    },

    {
      nome: "Trek Marlin 7",
      imagem:
        "https://trek.scene7.com/is/image/TrekBicycleProducts/Marlin7_2024_Black.png",
      categoriaTag: "Bike",
      descricao: "Mountain bike intermediária Trek com suspensão a ar e componentes de qualidade.",
      precoMedio: 5999.90,
      lancamento: 2024,
      marca: "Trek",
      imagens: [
        "https://trek.scene7.com/is/image/TrekBicycleProducts/Marlin7_2024_Black.png"
      ],
      especificacoes: {
        quadro: "Alumínio Alpha Silver",
        aro: "29 polegadas",
        marchas: "10 velocidades",
        suspensao: "RockShox Judy a ar",
        freios: "Disco hidráulico Shimano",
        peso: "13.5 kg"
      },
      sitesCompra: [
        {
          loja: "Bike Plus",
          preco: 5799.90,
          link: "https://www.bikeplus.com.br"
        },
        {
          loja: "Netshoes",
          preco: 5899.90,
          link: "https://www.netshoes.com.br"
        }
      ]
    },

    {
      nome: "GTS M1 Elétrica",
      imagem:
        "https://www.gtsbikes.com.br/wp-content/uploads/2023/06/gts-m1-eletrica.jpg",
      categoriaTag: "Bike",
      descricao: "Bicicleta elétrica urbana com motor de 350W e autonomia de 40km.",
      precoMedio: 4999.90,
      lancamento: 2024,
      marca: "GTS",
      imagens: [
        "https://www.gtsbikes.com.br/wp-content/uploads/2023/06/gts-m1-eletrica.jpg"
      ],
      especificacoes: {
        quadro: "Alumínio",
        aro: "29 polegadas",
        marchas: "7 velocidades",
        motor: "350W",
        bateria: "Lítio 36V 10Ah",
        autonomia: "40 km",
        freios: "Disco mecânico",
        peso: "22.0 kg"
      },
      sitesCompra: [
        {
          loja: "Amazon",
          preco: 4799.90,
          link: "https://www.amazon.com.br"
        },
        {
          loja: "Magazine Luiza",
          preco: 4899.90,
          link: "https://www.magazineluiza.com.br"
        }
      ]
    }
  ];

  for (const produto of produtos) {
    const resultado = await Produto.updateOne(
      { nome: produto.nome },       // filtro: procura pelo nome
      { $set: produto },            // atualiza os dados se já existir
      { upsert: true }              // insere caso não exista
    );

    if (resultado.upsertedCount > 0) {
      console.log(`Inserido: ${produto.nome}`);
    } else if (resultado.modifiedCount > 0) {
      console.log(`Atualizado: ${produto.nome}`);
    } else {
      console.log(`Sem alterações: ${produto.nome} (dados iguais)`);
    }
  }

  mongoose.connection.close();
}

inserirProdutos();