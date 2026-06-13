export { ErrorLayer, AppLayerError, isAppLayerError, type AppErrorJSON } from "./baseError.ts";
export { EntityInvalidParameterError } from "./entityErrors.ts";
export {
    DbConnectionError,
    DbNotFoundError,
    DbDuplicateKeyError,
    DbReadError,
    DbWriteError,
    DbOperationError,
    mapMongooseError,
    wrapDbOperation,
} from "./dbErrors.ts";
export {
    ControllerValidationError,
    ControllerRouteError,
    ControllerPayloadError,
} from "./controllerErrors.ts";
export {
    ServiceNotFoundError,
    ServiceConflictError,
    ServiceUnauthorizedError,
    ServiceBusinessError,
} from "./serviceErrors.ts";
export {
    logAppError,
    mapErrorToResponse,
    respostaErroApp,
    handleRouteError,
    mapErrorToReviewResponse,
    type ErrorResponse,
} from "./errorHandler.ts";
