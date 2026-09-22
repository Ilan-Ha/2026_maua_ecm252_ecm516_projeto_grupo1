import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { UserEntity } from '../domain/user.entity';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, collection: UserEntity.collection })
export class User {
  @Prop({ type: Types.ObjectId, required: true, unique: true })
  authId!: Types.ObjectId;

  @Prop({ unique: true, required: true })
  nome!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
