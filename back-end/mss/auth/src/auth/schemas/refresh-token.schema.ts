import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RefreshTokenDocument = HydratedDocument<RefreshToken>;

@Schema({ collection: 'refresh_tokens', timestamps: true })
export class RefreshToken {
  @Prop({ required: true, index: true })
  authId!: string;

  @Prop({ required: true, unique: true })
  jti!: string;

  @Prop({ required: true })
  expiresAt!: Date;

  @Prop({ default: false })
  revoked!: boolean;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
