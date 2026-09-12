import type { HttpMethod } from "../../types/http/httpMethod.js";

/** Envelope padrão que os MSS devolvem (auth, catalog, etc.) */
export interface MssServiceResponse<TContent = unknown> {
  error: boolean;
  status?: number;
  message?: string | Record<string, string | string[]>;
  content?: TContent;
}

/** Resposta HTTP bruta do gateway após chamar um MSS via makeRequest/axios */
export interface GatewayRequest<
  TBody = unknown,
  TQuery = Record<string, string>,
  TParams = Record<string, string>
> {
  endpointName: string;
  method: HttpMethod;
  body?: TBody;
  query?: TQuery;
  params?: TParams;
  headers?: Record<string, string>;
  /** Anexa segmento ao final da URL registrada (ex.: produtoId em reviews) */
  pathSuffix?: string;
}

export interface GatewayResponse<TData = unknown> {
  endpointName: string;
  status: number;
  /** Corpo HTTP — em chamadas a MSS costuma ser MssServiceResponse */
  data?: TData;
  headers?: Record<string, string>;
  message?: string;
}

export interface HealthReport {
    status: "healthy" | "degraded" | "unhealthy";
    timestamp: string;
    services: ServiceStatus[];
}

export interface ServiceStatus {
    name: string;
    status: "up" | "down" | "degraded";
    responseTimeMs?: number;
    message?: string;
}

export interface Endpoint {
    name: string;
    description: string;
    url: string;
}