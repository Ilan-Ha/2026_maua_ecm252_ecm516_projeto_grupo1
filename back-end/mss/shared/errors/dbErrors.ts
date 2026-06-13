import { AppLayerError, ErrorLayer } from "./baseError.ts";
import { EntityInvalidParameterError } from "./entityErrors.ts";

class DbConnectionError extends AppLayerError {
    constructor(description: string, cause?: unknown) {
        super({
            layer: ErrorLayer.DB,
            code: "DB_CONNECTION",
            message: "Falha na conexão com o banco de dados",
            description,
            statusCode: 503,
            cause,
        });
    }
}

class DbNotFoundError extends AppLayerError {
    constructor(collection: string, operation: string, filter?: string) {
        super({
            layer: ErrorLayer.DB,
            code: "DB_NOT_FOUND",
            message: "Registro não encontrado",
            description: `Nenhum documento encontrado em "${collection}" durante "${operation}"${
                filter ? ` (filtro: ${filter})` : ""
            }`,
            statusCode: 404,
        });
    }
}

class DbDuplicateKeyError extends AppLayerError {
    constructor(collection: string, operation: string, campo?: string, cause?: unknown) {
        super({
            layer: ErrorLayer.DB,
            code: "DB_DUPLICATE_KEY",
            message: campo ? `${campo} já cadastrado` : "Registro duplicado",
            description: `Violação de chave única em "${collection}" durante "${operation}"${
                campo ? ` no campo "${campo}"` : ""
            }`,
            campo,
            statusCode: 409,
            cause,
        });
    }
}

class DbReadError extends AppLayerError {
    constructor(collection: string, operation: string, cause?: unknown) {
        super({
            layer: ErrorLayer.DB,
            code: "DB_READ",
            message: "Erro ao consultar dados",
            description: `Falha de leitura em "${collection}" durante "${operation}"`,
            statusCode: 500,
            cause,
        });
    }
}

class DbWriteError extends AppLayerError {
    constructor(collection: string, operation: string, cause?: unknown) {
        super({
            layer: ErrorLayer.DB,
            code: "DB_WRITE",
            message: "Erro ao persistir dados",
            description: `Falha de escrita em "${collection}" durante "${operation}"`,
            statusCode: 500,
            cause,
        });
    }
}

class DbOperationError extends AppLayerError {
    constructor(collection: string, operation: string, cause?: unknown) {
        super({
            layer: ErrorLayer.DB,
            code: "DB_OPERATION",
            message: "Erro na operação do banco de dados",
            description: `Operação "${operation}" falhou na coleção "${collection}"`,
            statusCode: 500,
            cause,
        });
    }
}

type MongoLikeError = {
    name?: string;
    code?: number;
    path?: string;
    keyPattern?: Record<string, number>;
    errors?: Record<string, { message?: string }>;
};

function asMongoError(err: unknown): MongoLikeError | null {
    if (!err || typeof err !== "object") return null;
    return err as MongoLikeError;
}

function extrairCampoDuplicado(err: MongoLikeError): string | undefined {
    if (err.keyPattern) {
        return Object.keys(err.keyPattern)[0];
    }
    return undefined;
}

function mapMongooseError(
    err: unknown,
    operation: string,
    collection: string
): AppLayerError {
    if (err instanceof AppLayerError) {
        return err;
    }

    const mongoErr = asMongoError(err);

    if (mongoErr?.name === "CastError") {
        return new EntityInvalidParameterError("ID inválido", mongoErr.path ?? "id");
    }

    if (mongoErr?.code === 11000) {
        return new DbDuplicateKeyError(collection, operation, extrairCampoDuplicado(mongoErr), err);
    }

    if (mongoErr?.name === "ValidationError" && mongoErr.errors) {
        const primeiroCampo = Object.keys(mongoErr.errors)[0];
        const detalhe = mongoErr.errors[primeiroCampo];
        return new EntityInvalidParameterError(
            detalhe?.message ?? "Dados inválidos",
            primeiroCampo ?? "campo"
        );
    }

    const mensagem = err instanceof Error ? err.message.toLowerCase() : "";

    if (mensagem.includes("connection") || mensagem.includes("connect")) {
        return new DbConnectionError(
            `Conexão indisponível durante "${operation}" em "${collection}"`,
            err
        );
    }

    const operacoesLeitura = ["find", "findone", "findbyid", "aggregate", "exists", "count"];
    const operacaoNormalizada = operation.toLowerCase();

    if (operacoesLeitura.some((op) => operacaoNormalizada.includes(op))) {
        return new DbReadError(collection, operation, err);
    }

    const operacoesEscrita = ["create", "save", "update", "insert", "delete", "upsert"];
    if (operacoesEscrita.some((op) => operacaoNormalizada.includes(op))) {
        return new DbWriteError(collection, operation, err);
    }

    return new DbOperationError(collection, operation, err);
}

async function wrapDbOperation<T>(
    operation: string,
    collection: string,
    fn: () => Promise<T>
): Promise<T> {
    try {
        return await fn();
    } catch (err) {
        throw mapMongooseError(err, operation, collection);
    }
}

export {
    DbConnectionError,
    DbNotFoundError,
    DbDuplicateKeyError,
    DbReadError,
    DbWriteError,
    DbOperationError,
    mapMongooseError,
    wrapDbOperation,
};
