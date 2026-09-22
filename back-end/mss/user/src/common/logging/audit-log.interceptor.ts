import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, tap } from 'rxjs';
import { Request } from 'express';
import { AUDIT_LOG_KEY, AuditLogOptions } from './audit-log.decorator';
import { writeLog } from './writer';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly serviceName: string,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const options = this.reflector.getAllAndOverride<AuditLogOptions | undefined>(
      AUDIT_LOG_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!options) {
      return next.handle();
    }

    const req = context.switchToHttp().getRequest<Request & { correlationId?: string }>();
    const message =
      options.message ||
      `${context.getClass().name}.${context.getHandler().name}`;

    return next.handle().pipe(
      tap({
        next: () => {
          void writeLog({
            service: this.serviceName,
            level: options.level || 'info',
            kind: options.kind || 'manual',
            message,
            correlationId: req.correlationId || (req.headers['x-correlation-id'] as string),
            method: req.method,
            path: req.originalUrl || req.url,
          });
        },
      }),
    );
  }
}
