import { AppLayerError, ErrorLayer } from "./baseError.ts";

class EntityInvalidParameterError extends AppLayerError {
    constructor(message: string, campo: string) {
        super({
            layer: ErrorLayer.ENTITY,
            code: "ENTITY_INVALID_PARAMETER",
            message,
            description: `Validação de entidade falhou no campo "${campo}": ${message}`,
            campo,
            statusCode: 400,
        });
    }
}

export { EntityInvalidParameterError };
