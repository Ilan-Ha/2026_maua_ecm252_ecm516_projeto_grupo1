import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ProdutoEntity } from '../domain/produto.entity';

export type ProdutoDocument = HydratedDocument<Produto>;

@Schema({ collection: ProdutoEntity.collection })
export class Produto {
  @Prop({ required: true })
  nome!: string;

  @Prop()
  imagem?: string;

  @Prop({ required: true, index: true })
  categoriaTag!: string;

  @Prop()
  descricao?: string;

  @Prop({ required: true })
  lancamento!: number;

  @Prop({ required: true })
  marca!: string;

  @Prop({ type: [String], default: [] })
  imagens!: string[];

  @Prop({ type: Object, default: {} })
  especificacoes!: Record<string, unknown>;
}

export const ProdutoSchema = SchemaFactory.createForClass(Produto);
