import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UserEntity } from './domain/user.entity';
import { wrapDbOperation } from '../common/helpers/db';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  create(data: { authId: string; nome: string }): Promise<UserDocument> {
    new UserEntity({ authId: data.authId, nome: data.nome });
    return wrapDbOperation('create', UserEntity.collection, () =>
      this.userModel.create({
        authId: data.authId,
        nome: data.nome.trim(),
      }),
    );
  }

  existsByAuthId(authId: string): Promise<{ _id: unknown } | null> {
    return wrapDbOperation('exists', UserEntity.collection, () =>
      this.userModel.exists({ authId }),
    );
  }

  existsByNome(nome: string): Promise<{ _id: unknown } | null> {
    return wrapDbOperation('exists', UserEntity.collection, () =>
      this.userModel.exists({ nome }),
    );
  }

  findByNome(nome: string): Promise<UserDocument | null> {
    return wrapDbOperation('findOne', UserEntity.collection, () =>
      this.userModel.findOne({ nome }).exec(),
    );
  }

  findByAuthId(authId: string): Promise<UserDocument | null> {
    return wrapDbOperation('findOne', UserEntity.collection, () =>
      this.userModel.findOne({ authId }).exec(),
    );
  }

  findById(userId: string): Promise<UserDocument | null> {
    return wrapDbOperation('findById', UserEntity.collection, () =>
      this.userModel.findById(userId).exec(),
    );
  }
}
