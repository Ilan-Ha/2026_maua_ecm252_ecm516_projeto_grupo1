import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Categoria, CategoriaDocument } from './schemas/categoria.schema';
import { CategoriaEntity } from './domain/categoria.entity';
import { wrapDbOperation } from '../common/helpers/db';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectModel(Categoria.name)
    private readonly categoriaModel: Model<CategoriaDocument>,
  ) {}

  findAll(): Promise<CategoriaDocument[]> {
    return wrapDbOperation('find', CategoriaEntity.collection, () =>
      this.categoriaModel.find().exec(),
    );
  }

  upsertByTag(cat: {
    nome: string;
    tag: string;
    imagem: string;
  }): Promise<unknown> {
    return wrapDbOperation('upsert', CategoriaEntity.collection, () =>
      this.categoriaModel
        .updateOne({ tag: cat.tag }, { $setOnInsert: cat }, { upsert: true })
        .exec(),
    );
  }
}
