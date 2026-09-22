import { ControllerPayloadError, ControllerValidationError } from "../errors/controllerErrors.ts";
import { respostaErroApp, type ErrorResponse } from "../errors/errorHandler.ts";

function isValidObjectId(id: string): boolean {
    return /^[a-f\d]{24}$/i.test(id);
}

export function validarPayload(payload: unknown): Record<string, unknown> {
    if (!payload || typeof payload !== "object") {
        throw new ControllerPayloadError("Payload é obrigatório");
    }
    return payload as Record<string, unknown>;
}

export function validarCampoObrigatorio(
    valor: unknown,
    campo: string,
    mensagem?: string
): string {
    if (valor == null || (typeof valor === "string" && !valor.trim())) {
        throw new ControllerValidationError(mensagem ?? `${campo} é obrigatório`, campo);
    }
    return String(valor).trim();
}

export function validarObjectId(valor: unknown, campo: string): string {
    const id = validarCampoObrigatorio(valor, campo);
    if (!isValidObjectId(id)) {
        throw new ControllerValidationError("ID inválido", campo);
    }
    return id;
}

/** @deprecated Use respostaErroApp */
export function respostaErroEntidade(err: unknown): ErrorResponse {
    return respostaErroApp(err);
}
