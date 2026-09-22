import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';
import { serializeError, writeLog } from './writer';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  constructor(private readonly serviceName: string) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const http = context.switchToHttp();
    const req = http.getRequest<Request & { correlationId?: string }>();
    const res = http.getResponse<Response>();
    const started = Date.now();
    const correlationId =
      req.correlationId ||
      (req.headers['x-correlation-id'] as string | undefined);

    return next.handle().pipe(
      tap({
        next: () => {
          void writeLog({
            service: this.serviceName,
            level: res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info',
            kind: 'http',
            message: `${req.method} ${req.originalUrl || req.url} → ${res.statusCode}`,
            correlationId,
            method: req.method,
            path: req.originalUrl || req.url,
            statusCode: res.statusCode,
            durationMs: Date.now() - started,
          });
        },
        error: (err) => {
          void writeLog({
            service: this.serviceName,
            level: 'error',
            kind: 'exception',
            message: `${req.method} ${req.originalUrl || req.url} failed`,
            correlationId,
            method: req.method,
            path: req.originalUrl || req.url,
            durationMs: Date.now() - started,
            error: serializeError(err),
          });
        },
      }),
    );
  }
}
