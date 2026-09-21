import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

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
    throw new Error("JWT_SECRET não definida no .env");
  }
  return value;
}

export function extractBearer(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header || typeof header !== "string") return null;
  const [type, token] = header.split(" ");
  if (type !== "Bearer" || !token) return null;
  return token;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = extractBearer(req);
    if (!token) {
      return res.status(401).json({ message: "Token de acesso obrigatório" });
    }
    const decoded = jwt.verify(token, secret()) as AccessClaims;
    if (decoded.typ !== "access" || !decoded.sub) {
      return res.status(401).json({ message: "Token inválido" });
    }
    req.auth = decoded;
    return next();
  } catch {
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
}
