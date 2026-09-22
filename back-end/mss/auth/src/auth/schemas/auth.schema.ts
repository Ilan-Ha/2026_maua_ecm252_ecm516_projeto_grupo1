import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { AuthEntity } from '../domain/auth.entity';

export type AuthDocument = HydratedDocument<Auth>;

@Schema({ timestamps: true, collection: AuthEntity.collection })
export class Auth {
  @Prop({ unique: true, required: true })
  email!: string;

  @Prop({ required: false })
  senha_hash?: string;

  /** @deprecated legado — hash bcrypt ficava no campo `senha` */
  @Prop({ required: false })
  senha?: string;

  @Prop({ default: false })
  usuarioCadastrado!: boolean;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);

AuthSchema.pre('save', async function () {
  if (!this.isModified('senha_hash')) return;

  const atual = this.senha_hash as string;
  if (/^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(atual)) return;

  this.senha_hash = await bcrypt.hash(atual, 10);
});
