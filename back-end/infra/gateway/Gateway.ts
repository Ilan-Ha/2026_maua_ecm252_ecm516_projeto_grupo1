import axios from "axios";
import config from "../../mss/shared/utils/config.js";
import { Endpoint, GatewayRequest, GatewayResponse, HealthReport, ServiceStatus } from "../../shared/interfaces/gateway/gatewayInterfaces.js";
const HEALTH_TIMEOUT_MS = 3000;

export default class Gateway {

    private base = config.url;
    private svc = config.ports.back;
    private paths = config.paths;

    private endpoints: Endpoint[]

    constructor() {
        this.endpoints = [];
    }

    registerEndpoint(
        endpoint: Endpoint
    ): void {
        if (!this.endpoints.find(ep => ep.url === endpoint.url)) {
            this.endpoints.push(endpoint);
            console.log(`[Gateway] Endpoint criado: ${endpoint.name} (${endpoint.url})`);
            return;
        } else {
            console.log(`[Gateway] Endpoint NÃO criado (duplicado): ${endpoint.name} (${endpoint.url})`);
        }
    }

    private getEndpoint(name: string): Endpoint | undefined {
        return this.endpoints.find((ep) => ep.name === name);
    }

    // metodo comum utilizado pelo gateway para fazer a request a seus endpoints registrados
    async makeRequest(
        request: GatewayRequest
    ): Promise<GatewayResponse> {

        const endpoint = this.getEndpoint(request.endpointName)

        if (!endpoint) {
            return {
                status: 404,
                endpointName: request.endpointName,
                data: { error: true, message: "Endpoint não registrado no gateway" },
            };
        }
        try {
            const targetUrl = request.pathSuffix
                ? `${endpoint.url.replace(/\/$/, "")}/${request.pathSuffix}`
                : endpoint.url;

            const response = await axios({
                method: request.method,
                url: targetUrl,
                data: request.body,
                params: request.query ?? {},
                headers: request.headers ?? {},
                validateStatus: () => true,
            });

            return {
                status: response.status,
                endpointName: request.endpointName,
                data: response.data,
                headers: response.headers as Record<string, string>
            }
        } catch (err) {
            return {
                status: 502,
                endpointName: request.endpointName,
                data: { error: true, message: "Serviço indisponível" },
            }
        }
    }
    

    //health report from individual services
    async singleServiceHealthcheck(
        name: string,
        url: string,
        validate: (data: unknown) => "up" | "degraded" | "down"
    ): Promise<ServiceStatus> {
        const start = Date.now();
        try {
            const response = await axios.get(url, {
                timeout: HEALTH_TIMEOUT_MS,
                validateStatus: () => true,
            });
            const status = validate(response.data);
            return {
                name,
                status,
                responseTimeMs: Date.now() - start,
                message: status === "up" ? undefined : `HTTP ${response.status}`,
            };
        } catch (err) {
            return {
                name,
                status: "down",
                responseTimeMs: Date.now() - start,
                message: err instanceof Error ? err.message : "service unreachable",
            };
        }
    }

    //health report from all services
    async globalHealthReport(): Promise<HealthReport> {
        const now = new Date().toISOString();
        // supondo que o config.ports.back tem: {auth, catalog, review, history, ...}
        const svcEntries = Object.entries(this.svc) as [string, number][];
        // monta os endpoints do tipo: `${base}:${porta}/health`
        const services = await Promise.all(
            svcEntries.map(async ([name, port]) => {
                const url = `${this.base}:${port}/health`;
                return this.singleServiceHealthcheck(
                    name,
                    url,
                    (data: any) => {
                        // lógica simples: se resposta status "ok" ou equivalente, retorna 'up'
                        if (data && (data.status === "ok" || data.backend === true)) {
                            return "up";
                        }
                        if (data && data.status === "degraded") {
                            return "degraded";
                        }
                        return "down";
                    }
                );
            })
        );
        // calcula status geral
        const hasDown = services.some(s => s.status === "down");
        const hasDegraded = services.some(s => s.status === "degraded");
        let overall: "healthy" | "degraded" | "unhealthy";
        if (hasDown) overall = "unhealthy";
        else if (hasDegraded) overall = "degraded";
        else overall = "healthy";
        return {
            status: overall,
            timestamp: now,
            services
        };
    }


}