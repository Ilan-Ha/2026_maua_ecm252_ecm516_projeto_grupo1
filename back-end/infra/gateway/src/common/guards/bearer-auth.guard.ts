import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import type { Request } from 'express';

export type AccessClaims = {
  sub: string;
  email: string;
  nome: string;
  typ: string;
};

declare global {
  namespace Express {
    interface Request {
      auth?: AccessClaims;
    }
  }
}

function secret(): string {
  const value = process.env.JWT_SECRET;
  if (!value) {
    throw new Error('JWT_SECRET não definida no .env');
  }
  return value;
}

@Injectable()
export class BearerAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const header = req.headers.authorization;
    if (!header || typeof header !== 'string') {
      throw new UnauthorizedException({ message: 'Token de acesso obrigatório' });
    }
    const [type, token] = header.split(' ');
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException({ message: 'Token de acesso obrigatório' });
    }
    try {
      const decoded = jwt.verify(token, secret()) as AccessClaims;
      if (decoded.typ !== 'access' || !decoded.sub) {
        throw new UnauthorizedException({ message: 'Token inválido' });
      }
      req.auth = decoded;
      return true;
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      throw new UnauthorizedException({ message: 'Token inválido ou expirado' });
    }
  }
}
