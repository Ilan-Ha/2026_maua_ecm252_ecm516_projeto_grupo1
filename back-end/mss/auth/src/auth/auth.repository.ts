import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auth, AuthDocument } from './schemas/auth.schema';
import { AuthEntity } from './domain/auth.entity';
import { wrapDbOperation } from '../common/helpers/db';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel(Auth.name) private readonly authModel: Model<AuthDocument>,
  ) {}

  findByEmail(email: string): Promise<AuthDocument | null> {
    return wrapDbOperation('findOne', AuthEntity.collection, () =>
      this.authModel.findOne({ email: email.trim().toLowerCase() }).exec(),
    );
  }

  findById(authId: string): Promise<AuthDocument | null> {
    return wrapDbOperation('findById', AuthEntity.collection, () =>
      this.authModel.findById(authId).exec(),
    );
  }

  create(data: { email: string; senha: string }): Promise<AuthDocument> {
    return wrapDbOperation('create', AuthEntity.collection, () =>
      this.authModel.create({
        email: data.email.trim().toLowerCase(),
        senha_hash: data.senha,
      }),
    );
  }

  async updateSenhaByEmail(
    email: string,
    senha: string,
  ): Promise<AuthDocument | null> {
    return wrapDbOperation('update', AuthEntity.collection, async () => {
      const usuario = await this.authModel.findOne({ email });
      if (!usuario) return null;
      usuario.senha_hash = senha;
      await usuario.save();
      return usuario;
    });
  }

  async markUsuarioCadastrado(authId: string): Promise<AuthDocument | null> {
    return wrapDbOperation('update', AuthEntity.collection, async () => {
      const auth = await this.authModel.findById(authId);
      if (!auth) return null;
      auth.usuarioCadastrado = true;
      await auth.save();
      return auth;
    });
  }
}
