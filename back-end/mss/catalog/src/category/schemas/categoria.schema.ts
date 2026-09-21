import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CategoriaEntity } from '../domain/categoria.entity';

export type CategoriaDocument = HydratedDocument<Categoria>;

@Schema({ collection: CategoriaEntity.collection })
export class Categoria {
  @Prop({ required: true })
  nome!: string;

  @Prop({ unique: true, required: true })
  tag!: string;

  @Prop({ required: true })
  imagem!: string;
}

export const CategoriaSchema = SchemaFactory.createForClass(Categoria);
