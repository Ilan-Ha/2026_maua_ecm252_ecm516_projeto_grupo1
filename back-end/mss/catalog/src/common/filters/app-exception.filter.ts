import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { AppError } from '../helpers/errors';
import { erro } from '../helpers/envelope';
import { SERVICE_NAME } from '../config/app-config';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const res = host.switchToHttp().getResponse<Response>();

    if (exception instanceof AppError) {
      const message = exception.campo ? { [exception.campo]: exception.message } : exception.message;
      console.error(`[${SERVICE_NAME}][${exception.code}] ${exception.message}`);
      res.status(200).json(erro(exception.statusCode, message));
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      const message =
        typeof body === 'string'
          ? body
          : ((body as { message?: string | string[] }).message ?? exception.message);
      res.status(status).json(
        typeof message === 'object' && !Array.isArray(message)
          ? message
          : { message: Array.isArray(message) ? message.join(', ') : String(message) },
      );
      return;
    }

    console.error(`[${SERVICE_NAME}][unknown]`, exception);
    res.status(200).json(erro(500, `Erro interno de servidor ${SERVICE_NAME}`));
  }
}
