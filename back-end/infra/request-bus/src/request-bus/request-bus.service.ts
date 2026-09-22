import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { getAppConfig } from '../common/config/app-config';

type Handler = (payload: unknown) => Promise<unknown>;

@Injectable()
export class RequestBusService {
  private readonly handlers: Record<string, Handler>;

  constructor() {
    const config = getAppConfig();
    const svc = config.ports.back;
    const paths = config.paths.requests;
    const request = config.requests;
    const url = config.url;
    const urls = {
      user: `${url}:${svc.user}${paths.request}`,
      catalog: `${url}:${svc.catalog}${paths.request}`,
    };

    const forward = async (
      payload: unknown,
      requestName: string,
      urlString: string,
    ) => {
      const result = await axios.post(urlString, {
        request: requestName,
        payload,
      });
      return result.data.values;
    };

    this.handlers = {
      [request.user.name.exits]: (payload) =>
        forward(payload, request.user.name.exits, urls.user),
      [request.user.name.valdate]: (payload) =>
        forward(payload, request.user.name.valdate, urls.user),
      [request.user.name.tell]: (payload) =>
        forward(payload, request.user.name.tell, urls.user),
      [request.user.exist]: (payload) =>
        forward(payload, request.user.exist, urls.user),
      [request.user.byAuthId]: (payload) =>
        forward(payload, request.user.byAuthId, urls.user),
      [request.catalog.product.exist]: (payload) =>
        forward(payload, request.catalog.product.exist, urls.catalog),
    };
  }

  async dispatch(requestName: string, payload: unknown) {
    const handler = this.handlers[requestName];
    if (!handler) {
      return {
        error: true,
        status: 404,
        message: `Request desconhecida: ${requestName}`,
      };
    }
    try {
      const r = (await handler(payload)) as {
        error?: boolean;
        message?: unknown;
        status?: number;
        content?: unknown;
      };
      if (typeof r?.error !== 'boolean') {
        return {
          error: true,
          status: 500,
          message: 'Erro interno de servidor request',
        };
      }
      return {
        error: r.error,
        status: r.status,
        message: r.message,
        content: r.content,
      };
    } catch (e: any) {
      return {
        error: true,
        status: e.response?.status || 500,
        message: e.response?.data || 'Erro interno de servidor request',
      };
    }
  }
}
