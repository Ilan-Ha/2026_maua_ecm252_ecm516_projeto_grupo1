import type { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { serializeError, writeLog } from './writer.ts';
import { correlationStore } from './correlation.ts';

export const CORRELATION_HEADER = 'x-correlation-id';

export function correlationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const incoming = req.header(CORRELATION_HEADER);
  const correlationId =
    incoming && incoming.trim() ? incoming.trim() : randomUUID();
  (req as Request & { correlationId?: string }).correlationId = correlationId;
  res.setHeader(CORRELATION_HEADER, correlationId);
  correlationStore.run(correlationId, () => next());
}

export function httpLoggingMiddleware(service: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const started = Date.now();
    const correlationId =
      (req as Request & { correlationId?: string }).correlationId ||
      req.header(CORRELATION_HEADER) ||
      undefined;

    const kind =
      service === 'event-bus'
        ? 'event'
        : service === 'request-bus'
          ? 'request'
          : 'http';

    res.on('finish', () => {
      const statusCode = res.statusCode;
      const level =
        statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';
      void writeLog({
        service,
        level,
        kind,
        message: `${req.method} ${req.originalUrl || req.url} → ${statusCode}`,
        correlationId,
        method: req.method,
        path: req.originalUrl || req.url,
        statusCode,
        durationMs: Date.now() - started,
      });
    });

    next();
  };
}

export function logInfraError(
  service: string,
  message: string,
  err?: unknown,
  meta?: Record<string, unknown>,
) {
  void writeLog({
    service,
    level: 'error',
    kind: 'exception',
    message,
    error: serializeError(err),
    meta,
  });
}
