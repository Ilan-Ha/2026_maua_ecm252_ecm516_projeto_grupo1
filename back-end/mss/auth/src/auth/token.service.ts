import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';

export type AccessPayload = {
  sub: string;
  email: string;
  nome: string;
  typ: 'access';
};

export type RefreshPayload = {
  sub: string;
  jti: string;
  typ: 'refresh';
};

@Injectable()
export class TokenService {
  private secret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET não definida no .env');
    }
    return secret;
  }

  accessTtl(): string {
    return process.env.JWT_ACCESS_TTL || '15m';
  }

  refreshTtl(): string {
    return process.env.JWT_REFRESH_TTL || '7d';
  }

  accessTtlSeconds(): number {
    return parseDurationToSeconds(this.accessTtl());
  }

  signAccess(claims: { authId: string; email: string; nome: string }): string {
    const payload: AccessPayload = {
      sub: claims.authId,
      email: claims.email,
      nome: claims.nome,
      typ: 'access',
    };
    return jwt.sign(payload, this.secret(), {
      expiresIn: this.accessTtl() as jwt.SignOptions['expiresIn'],
    });
  }

  signRefresh(authId: string): { token: string; jti: string; expiresAt: Date } {
    const jti = crypto.randomUUID();
    const payload: RefreshPayload = {
      sub: authId,
      jti,
      typ: 'refresh',
    };
    const token = jwt.sign(payload, this.secret(), {
      expiresIn: this.refreshTtl() as jwt.SignOptions['expiresIn'],
    });
    const expiresAt = new Date(
      Date.now() + parseDurationToSeconds(this.refreshTtl()) * 1000,
    );
    return { token, jti, expiresAt };
  }

  verifyAccess(token: string): AccessPayload {
    const decoded = jwt.verify(token, this.secret()) as AccessPayload;
    if (decoded.typ !== 'access') {
      throw new Error('Token inválido');
    }
    return decoded;
  }

  verifyRefresh(token: string): RefreshPayload {
    const decoded = jwt.verify(token, this.secret()) as RefreshPayload;
    if (decoded.typ !== 'refresh') {
      throw new Error('Token inválido');
    }
    return decoded;
  }
}

function parseDurationToSeconds(value: string): number {
  const match = /^(\d+)([smhd])$/i.exec(value.trim());
  if (!match) {
    return 900;
  }
  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  const mult =
    unit === 's' ? 1 : unit === 'm' ? 60 : unit === 'h' ? 3600 : 86400;
  return amount * mult;
}
