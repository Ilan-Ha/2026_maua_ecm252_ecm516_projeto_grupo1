import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../product/product.repository';
import { CategoryRepository } from '../category/category.repository';
import { NotFoundError } from '../common/helpers/errors';

@Injectable()
export class CatalogService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async getCatalogo() {
    const [categoriasDb, produtos] = await Promise.all([
      this.categoryRepository.findAll(),
      this.productRepository.findAll(),
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
  }

  async getProdutoById(id: string) {
    const produto = await this.productRepository.findById(id);
    if (!produto) {
      throw new NotFoundError('Produto não encontrado');
    }
    return produto;
  }

  async productExists(productId: string): Promise<boolean> {
    const produto = await this.productRepository.findById(productId);
    return produto != null;
  }
}
