import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { NextFunction, Request, Response } from 'express';
import { AsyncLocalStorage } from 'async_hooks';
import { writeLog } from '../logging/writer';

export const correlationStore = new AsyncLocalStorage<string>();
export const CORRELATION_HEADER = 'x-correlation-id';

export function getCorrelationId(): string | undefined {
  return correlationStore.getStore();
}

@Injectable()
export class CorrelationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const incoming = req.header(CORRELATION_HEADER);
    const correlationId =
      incoming && incoming.trim() ? incoming.trim() : randomUUID();
    (req as Request & { correlationId?: string }).correlationId = correlationId;
    res.setHeader(CORRELATION_HEADER, correlationId);
    correlationStore.run(correlationId, () => next());
  }
}

@Injectable()
export class HttpLoggingMiddleware implements NestMiddleware {
  private readonly serviceName = 'gateway';

  use(req: Request, res: Response, next: NextFunction) {
    const started = Date.now();
    const correlationId =
      (req as Request & { correlationId?: string }).correlationId ||
      req.header(CORRELATION_HEADER) ||
      undefined;

    res.on('finish', () => {
      const statusCode = res.statusCode;
      const level =
        statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';
      void writeLog({
        service: this.serviceName,
        level,
        kind: 'http',
        message: `${req.method} ${req.originalUrl || req.url} → ${statusCode}`,
        correlationId,
        method: req.method,
        path: req.originalUrl || req.url,
        statusCode,
        durationMs: Date.now() - started,
      });
    });
    next();
  }
}
