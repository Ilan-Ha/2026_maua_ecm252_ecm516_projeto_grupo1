import { AppLayerError, ErrorLayer, isAppLayerError } from "./baseError.ts";
import { EntityInvalidParameterError } from "./entityErrors.ts";
import { DbDuplicateKeyError } from "./dbErrors.ts";
import { ControllerValidationError } from "./controllerErrors.ts";
import { ServiceConflictError } from "./serviceErrors.ts";

export type ErrorResponse = {
    error: true;
    status: number;
    message: Record<string, string> | string;
    layer?: ErrorLayer;
    code?: string;
};

export function logAppError(
    err: unknown,
    context?: { service?: string; route?: string; operation?: string }
): void {
    if (isAppLayerError(err)) {
        console.error(
            `[${context?.service ?? "ms"}][${err.layer}][${err.code}] ${err.description}`,
            {
                ...err.toJSON(),
                route: context?.route,
                operation: context?.operation,
            }
        );
        return;
    }

    console.error(`[${context?.service ?? "ms"}][unknown] Erro não classificado`, {
        message: err instanceof Error ? err.message : String(err),
        route: context?.route,
        operation: context?.operation,
    });
}

function formatFieldMessage(err: AppLayerError): Record<string, string> | string {
    if (err.campo) {
        return { [err.campo]: err.message };
    }
    return err.message;
}

export function mapErrorToResponse(err: unknown): ErrorResponse {
    if (!isAppLayerError(err)) {
        throw err;
    }

    if (
        err instanceof EntityInvalidParameterError ||
        err instanceof ControllerValidationError ||
        err instanceof DbDuplicateKeyError ||
        err instanceof ServiceConflictError
    ) {
        return {
            error: true,
            status: err.statusCode,
            message: formatFieldMessage(err),
            layer: err.layer,
            code: err.code,
        };
    }

    return {
        error: true,
        status: err.statusCode,
        message: err.message,
        layer: err.layer,
        code: err.code,
    };
}

export function respostaErroApp(err: unknown): ErrorResponse {
    return mapErrorToResponse(err);
}

export function handleRouteError(
    err: unknown,
    context: { service?: string; route?: string; operation?: string },
    fallback: () => { error: boolean; status: number; message: string | Record<string, string> | Record<string, string[]> }
): ErrorResponse | { error: boolean; status: number; message: string | Record<string, string> | Record<string, string[]> } {
    logAppError(err, context);
    try {
        return respostaErroApp(err);
    } catch {
        return fallback();
    }
}

export function mapErrorToReviewResponse(err: unknown): {
    status: number;
    body: {
        message: string;
        errors?: Record<string, string[]>;
        layer?: ErrorLayer;
        code?: string;
    };
} {
    const resposta = mapErrorToResponse(err);

    if (typeof resposta.message === "object") {
        const errors: Record<string, string[]> = {};
        for (const [campo, mensagem] of Object.entries(resposta.message)) {
            errors[campo] = [mensagem];
        }
        return {
            status: resposta.status,
            body: {
                message: "Dados inválidos",
                errors,
                layer: resposta.layer,
                code: resposta.code,
            },
        };
    }

    return {
        status: resposta.status,
        body: {
            message: resposta.message,
            layer: resposta.layer,
            code: resposta.code,
        },
    };
}
