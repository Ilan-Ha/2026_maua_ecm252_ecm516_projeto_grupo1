import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { HistoryEntity } from '../domain/history.entity';

export type HistoryDocument = HydratedDocument<History>;

@Schema({ collection: HistoryEntity.collection })
export class History {
  @Prop({ type: Types.ObjectId, required: true })
  userId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  productId!: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  createdAt!: Date;
}

export const HistorySchema = SchemaFactory.createForClass(History);
HistorySchema.index({ userId: 1, productId: 1 }, { unique: true });
