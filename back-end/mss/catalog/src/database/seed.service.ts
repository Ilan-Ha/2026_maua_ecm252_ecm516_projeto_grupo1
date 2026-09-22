import { Injectable, OnModuleInit } from '@nestjs/common';
import { CategoryRepository } from '../category/category.repository';

const CATEGORIAS_SEED = [
  {
    nome: 'Celulares',
    tag: 'Celular',
    imagem:
      'https://static.vecteezy.com/system/resources/previews/000/576/831/original/smartphone-icon-vector-illustration.jpg',
  },
  {
    nome: 'Placas de Vídeo',
    tag: 'GPU',
    imagem:
      'https://tse1.mm.bing.net/th/id/OIP.HMW3NgXewMev1TjuoaKQuAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
  },
  {
    nome: 'Geladeiras',
    tag: 'Geladeira',
    imagem:
      'https://img.freepik.com/vetores-premium/vetor-de-icone-de-geladeira-em-design-moderno_777568-2353.jpg',
  },
  {
    nome: 'Bicicletas',
    tag: 'Bike',
    imagem:
      'https://th.bing.com/th/id/R.001d09dd02871412d7a578e3331f4084?rik=4HmPB4l%2fmd5JKw&pid=ImgRaw&r=0',
  },
];

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async onModuleInit(): Promise<void> {
    for (const cat of CATEGORIAS_SEED) {
      await this.categoryRepository.upsertByTag(cat);
    }
    console.log('Categorias verificadas/inseridas');
  }
}
