import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ReviewEntity } from '../domain/review.entity';

export type ReviewDocument = HydratedDocument<Review>;

@Schema({ timestamps: true, collection: ReviewEntity.collection })
export class Review {
  @Prop({ required: true, index: true })
  produtoId!: string;

  @Prop({ required: true, trim: true, lowercase: true })
  email!: string;

  @Prop({ required: true, trim: true })
  nome!: string;

  @Prop({ required: true, min: 1, max: 5 })
  estrelas!: number;

  @Prop({ required: true, trim: true })
  comentario!: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
ReviewSchema.index({ produtoId: 1, email: 1 }, { unique: true });
