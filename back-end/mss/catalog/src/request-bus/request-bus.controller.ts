import { Body, Controller, Post } from '@nestjs/common';
import { ProductExistHandler } from './handlers/product-exist.handler';
import { validarCampoObrigatorio } from '../common/helpers/validation';

type RequestBusBody = {
  request?: string;
  payload?: unknown;
};

@Controller()
export class RequestBusController {
  private readonly handlers: Map<
    string,
    { handle: (payload: unknown) => Promise<unknown> }
  >;

  constructor(productExistHandler: ProductExistHandler) {
    this.handlers = new Map([
      [productExistHandler.requestName, productExistHandler],
    ]);
  }

  @Post('requisicao')
  async handleRequest(@Body() body: RequestBusBody) {
    try {
      const reqName = validarCampoObrigatorio(body.request, 'request');
      const handler = this.handlers.get(reqName);

      if (!handler) {
        return {
          content: {
            error: true,
            status: 404,
            message: 'Requisição desconhecida',
          },
        };
      }

      const result = await handler.handle(body.payload);
      return { values: result };
    } catch {
      return {
        content: {
          error: true,
          status: 404,
          message: 'Requisição desconhecida',
        },
      };
    }
  }
}
