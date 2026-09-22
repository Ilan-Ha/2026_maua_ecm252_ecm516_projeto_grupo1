import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';

@Catch(HttpException)
export class GatewayHttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    const status = exception.getStatus();
    const body = exception.getResponse();
    if (typeof body === 'object' && body !== null && 'message' in body) {
      const msg = (body as { message: string | string[] }).message;
      return res.status(status).json({
        message: Array.isArray(msg) ? msg.join(', ') : msg,
      });
    }
    return res.status(status).json({
      message: typeof body === 'string' ? body : exception.message,
    });
  }
}

@Catch()
export class GatewayAllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    console.error('[gateway] unhandled', exception);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Erro ao conectar com o servidor',
    });
  }
}
