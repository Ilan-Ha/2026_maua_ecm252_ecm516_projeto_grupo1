import { Body, Controller, Post } from '@nestjs/common';
import { validarCampoObrigatorio } from '../common/helpers/validation';

type RequestBusBody = {
  request?: string;
  payload?: unknown;
};

@Controller()
export class RequestBusController {
  private readonly handlers = new Map<
    string,
    (payload: unknown) => Promise<unknown>
  >();

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

      const result = await handler(body.payload);
      return { values: result };
    } catch {
      return {
        values: {
          error: true,
          status: 404,
          message: 'Requisição desconhecida',
        },
      };
    }
  }
}
