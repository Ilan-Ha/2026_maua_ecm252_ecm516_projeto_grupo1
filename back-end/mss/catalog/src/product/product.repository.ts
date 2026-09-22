import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Produto, ProdutoDocument } from './schemas/produto.schema';
import { ProdutoEntity } from './domain/produto.entity';
import { wrapDbOperation } from '../common/helpers/db';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel(Produto.name) private readonly produtoModel: Model<ProdutoDocument>,
  ) {}

  findAll(): Promise<ProdutoDocument[]> {
    return wrapDbOperation('find', ProdutoEntity.collection, () =>
      this.produtoModel.find().exec(),
    );
  }

  findById(id: string): Promise<ProdutoDocument | null> {
    return wrapDbOperation('findById', ProdutoEntity.collection, () =>
      this.produtoModel.findById(id).exec(),
    );
  }
}
