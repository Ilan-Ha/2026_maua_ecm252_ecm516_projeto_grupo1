import { AppLayerError, ErrorLayer } from "./baseError.ts";

class ControllerValidationError extends AppLayerError {
    constructor(message: string, campo: string) {
        super({
            layer: ErrorLayer.CONTROLLER,
            code: "CONTROLLER_VALIDATION",
            message,
            description: `Validação da rota falhou no campo "${campo}": ${message}`,
            campo,
            statusCode: 400,
        });
    }
}

class ControllerRouteError extends AppLayerError {
    constructor(message: string) {
        super({
            layer: ErrorLayer.CONTROLLER,
            code: "CONTROLLER_ROUTE",
            message,
            description: `Erro de rota: ${message}`,
            statusCode: 404,
        });
    }
}

class ControllerPayloadError extends AppLayerError {
    constructor(message: string) {
        super({
            layer: ErrorLayer.CONTROLLER,
            code: "CONTROLLER_PAYLOAD",
            message,
            description: `Payload inválido na requisição: ${message}`,
            statusCode: 400,
        });
    }
}

export { ControllerValidationError, ControllerRouteError, ControllerPayloadError };
