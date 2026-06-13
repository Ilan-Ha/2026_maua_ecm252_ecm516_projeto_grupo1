import { AppLayerError, ErrorLayer } from "./baseError.ts";

class ServiceNotFoundError extends AppLayerError {
    constructor(recurso: string, identificador?: string) {
        super({
            layer: ErrorLayer.SERVICE,
            code: "SERVICE_NOT_FOUND",
            message: `${recurso} não encontrado`,
            description: identificador
                ? `${recurso} não encontrado (identificador: ${identificador})`
                : `${recurso} não encontrado`,
            statusCode: 404,
        });
    }
}

class ServiceConflictError extends AppLayerError {
    constructor(message: string, campo?: string) {
        super({
            layer: ErrorLayer.SERVICE,
            code: "SERVICE_CONFLICT",
            message,
            description: campo
                ? `Conflito de regra de negócio no campo "${campo}": ${message}`
                : `Conflito de regra de negócio: ${message}`,
            campo,
            statusCode: 409,
        });
    }
}

class ServiceUnauthorizedError extends AppLayerError {
    constructor(message: string) {
        super({
            layer: ErrorLayer.SERVICE,
            code: "SERVICE_UNAUTHORIZED",
            message,
            description: `Falha de autorização: ${message}`,
            statusCode: 401,
        });
    }
}

class ServiceBusinessError extends AppLayerError {
    constructor(message: string, description: string, statusCode = 400) {
        super({
            layer: ErrorLayer.SERVICE,
            code: "SERVICE_BUSINESS",
            message,
            description,
            statusCode,
        });
    }
}

export {
    ServiceNotFoundError,
    ServiceConflictError,
    ServiceUnauthorizedError,
    ServiceBusinessError,
};
