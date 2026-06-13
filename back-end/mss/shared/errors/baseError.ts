export enum ErrorLayer {
    ENTITY = "entity",
    DB = "db",
    SERVICE = "service",
    CONTROLLER = "controller",
}

export type AppErrorJSON = {
    name: string;
    layer: ErrorLayer;
    code: string;
    message: string;
    description: string;
    campo?: string;
    statusCode: number;
    cause?: string;
};

export abstract class AppLayerError extends Error {
    readonly layer: ErrorLayer;
    readonly code: string;
    readonly description: string;
    readonly campo?: string;
    readonly statusCode: number;
    readonly cause?: unknown;

    constructor(options: {
        layer: ErrorLayer;
        code: string;
        message: string;
        description: string;
        campo?: string;
        statusCode?: number;
        cause?: unknown;
    }) {
        super(options.message);
        this.name = new.target.name;
        this.layer = options.layer;
        this.code = options.code;
        this.description = options.description;
        this.campo = options.campo;
        this.statusCode = options.statusCode ?? 500;
        this.cause = options.cause;
    }

    toJSON(): AppErrorJSON {
        return {
            name: this.name,
            layer: this.layer,
            code: this.code,
            message: this.message,
            description: this.description,
            campo: this.campo,
            statusCode: this.statusCode,
            cause: this.cause instanceof Error ? this.cause.message : undefined,
        };
    }
}

export function isAppLayerError(err: unknown): err is AppLayerError {
    return err instanceof AppLayerError;
}
