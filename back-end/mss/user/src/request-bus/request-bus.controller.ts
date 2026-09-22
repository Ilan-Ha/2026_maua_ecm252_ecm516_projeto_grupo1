import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { validarCampoObrigatorio } from '../common/helpers/validation';
import { getAppConfig, SERVICE_NAME } from '../common/config/app-config';
import { AppError } from '../common/helpers/errors';

type RequestBusBody = {
  request?: string;
  payload?: unknown;
};

type RequestHandler = (payload: unknown) => Promise<unknown> | unknown;

@Controller()
export class RequestBusController {
  private readonly handlers: Map<string, RequestHandler>;

  constructor(private readonly userService: UserService) {
    const requests = getAppConfig().requests;
    this.handlers = new Map<string, RequestHandler>([
      [
        requests.user.name.valdate,
        (payload) => this.userService.validateNome(payload),
      ],
      [
        requests.user.name.exits,
        (payload) => this.userService.nameExists(payload),
      ],
      [
        requests.user.name.tell,
        (payload) => this.userService.nameTell(payload),
      ],
      [requests.user.exist, (payload) => this.userService.userExist(payload)],
      [
        requests.user.byAuthId,
        (payload) => this.userService.byAuthId(payload),
      ],
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

      const result = await handler(body.payload);
      return { values: result };
    } catch (e) {
      console.error(
        `[${SERVICE_NAME}][request]`,
        e instanceof Error ? e.message : e,
      );
      if (e instanceof AppError) {
        return {
          values: {
            error: true,
            status: e.statusCode,
            message: e.campo ? { [e.campo]: e.message } : e.message,
          },
        };
      }
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
