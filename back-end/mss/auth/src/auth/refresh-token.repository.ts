import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  RefreshToken,
  RefreshTokenDocument,
} from './schemas/refresh-token.schema';
import { wrapDbOperation } from '../common/helpers/db';

@Injectable()
export class RefreshTokenRepository {
  constructor(
    @InjectModel(RefreshToken.name)
    private readonly model: Model<RefreshTokenDocument>,
  ) {}

  create(data: {
    authId: string;
    jti: string;
    expiresAt: Date;
  }): Promise<RefreshTokenDocument> {
    return wrapDbOperation('create', 'refresh_tokens', () =>
      this.model.create(data),
    );
  }

  findValid(jti: string): Promise<RefreshTokenDocument | null> {
    return wrapDbOperation('findOne', 'refresh_tokens', () =>
      this.model
        .findOne({
          jti,
          revoked: false,
          expiresAt: { $gt: new Date() },
        })
        .exec(),
    );
  }

  revoke(jti: string): Promise<unknown> {
    return wrapDbOperation('update', 'refresh_tokens', () =>
      this.model.updateOne({ jti }, { $set: { revoked: true } }).exec(),
    );
  }

  revokeAllForAuth(authId: string): Promise<unknown> {
    return wrapDbOperation('update', 'refresh_tokens', () =>
      this.model
        .updateMany({ authId, revoked: false }, { $set: { revoked: true } })
        .exec(),
    );
  }
}
