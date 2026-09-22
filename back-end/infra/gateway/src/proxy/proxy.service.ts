import { Injectable, OnModuleInit } from '@nestjs/common';
import axios from 'axios';
import { getAppConfig } from '../common/config/app-config';
import { getCorrelationId } from '../common/middleware/logging.middleware';

export type GatewayRequest = {
  method: string;
  endpointName: string;
  body?: unknown;
  query?: Record<string, unknown>;
  headers?: Record<string, string>;
  pathSuffix?: string;
};

export type GatewayResponse = {
  status: number;
  endpointName: string;
  data: unknown;
  headers?: Record<string, string>;
};

type Endpoint = { name: string; description: string; url: string };

@Injectable()
export class ProxyService implements OnModuleInit {
  private endpoints: Endpoint[] = [];

  onModuleInit() {
    const config = getAppConfig();
    const svc = config.ports.back;
    const paths = config.paths;
    const base = config.url;

    const map: Record<string, string> = {
      authLogin: `${base}:${svc.auth}${paths.auth.login}`,
      authRegister: `${base}:${svc.auth}${paths.auth.register}`,
      authRefresh: `${base}:${svc.auth}${paths.auth.refresh}`,
      authLogout: `${base}:${svc.auth}${paths.auth.logout}`,
      authPassword: `${base}:${svc.auth}${paths.auth.update.password}`,
      catalogList: `${base}:${svc.catalog}${paths.catalog.catalog}`,
      catalogProduct: `${base}:${svc.catalog}${paths.catalog.product}`,
      reviewList: `${base}:${svc.review}${paths.review.list}`,
      reviewCreate: `${base}:${svc.review}${paths.review.create}`,
      reviewHealth: `${base}:${svc.review}/health`,
      history: `${base}:${svc.history}${paths.history.history}`,
      logsList: `${base}:${svc.logs}${paths.logs.list}`,
    };

    for (const [name, url] of Object.entries(map)) {
      this.registerEndpoint({ name, description: name, url });
    }
  }

  registerEndpoint(endpoint: Endpoint): void {
    if (!this.endpoints.find((ep) => ep.url === endpoint.url)) {
      this.endpoints.push(endpoint);
      console.log(`[Gateway] Endpoint criado: ${endpoint.name} (${endpoint.url})`);
    }
  }

  private getEndpoint(name: string): Endpoint | undefined {
    return this.endpoints.find((ep) => ep.name === name);
  }

  async makeRequest(request: GatewayRequest): Promise<GatewayResponse> {
    const endpoint = this.getEndpoint(request.endpointName);
    if (!endpoint) {
      return {
        status: 404,
        endpointName: request.endpointName,
        data: { error: true, message: 'Endpoint não registrado no gateway' },
      };
    }
    try {
      const targetUrl = request.pathSuffix
        ? `${endpoint.url.replace(/\/$/, '')}/${request.pathSuffix}`
        : endpoint.url;

      const correlationId = getCorrelationId();
      const headers: Record<string, string> = { ...(request.headers ?? {}) };
      if (correlationId) {
        headers['x-correlation-id'] = correlationId;
      }

      const response = await axios({
        method: request.method,
        url: targetUrl,
        data: request.body,
        params: request.query ?? {},
        headers,
        validateStatus: () => true,
      });

      return {
        status: response.status,
        endpointName: request.endpointName,
        data: response.data,
        headers: response.headers as Record<string, string>,
      };
    } catch {
      return {
        status: 502,
        endpointName: request.endpointName,
        data: { error: true, message: 'Serviço indisponível' },
      };
    }
  }
}
