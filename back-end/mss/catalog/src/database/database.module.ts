import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGO_DB_NAME } from '../common/config/app-config';
import { Produto, ProdutoSchema } from '../product/schemas/produto.schema';
import { Categoria, CategoriaSchema } from '../category/schemas/categoria.schema';
import { ProductRepository } from '../product/product.repository';
import { CategoryRepository } from '../category/category.repository';
import { SeedService } from './seed.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => {
        const uri = process.env.MONGO_URI;
        if (!uri) {
          throw new Error('MONGO_URI não definida no .env');
        }
        return {
          uri,
          dbName: MONGO_DB_NAME,
        };
      },
    }),
    MongooseModule.forFeature([
      { name: Produto.name, schema: ProdutoSchema },
      { name: Categoria.name, schema: CategoriaSchema },
    ]),
  ],
  providers: [ProductRepository, CategoryRepository, SeedService],
  exports: [MongooseModule, ProductRepository, CategoryRepository],
})
export class DatabaseModule {}
