export class AppError extends Error {
  readonly statusCode: number;
  readonly campo?: string;
  readonly code: string;
  constructor(opts: { message: string; statusCode?: number; campo?: string; code?: string }) {
    super(opts.message);
    this.name = 'AppError';
    this.statusCode = opts.statusCode ?? 400;
    this.campo = opts.campo;
    this.code = opts.code ?? 'APP_ERROR';
  }
}
export class ValidationError extends AppError {
  constructor(message: string, campo: string) {
    super({ message, statusCode: 400, campo, code: 'VALIDATION' });
    this.name = 'ValidationError';
  }
}
export class NotFoundError extends AppError {
  constructor(message: string) {
    super({ message, statusCode: 404, code: 'NOT_FOUND' });
    this.name = 'NotFoundError';
  }
}
export class EntityInvalidParameterError extends AppError {
  constructor(message: string, campo: string) {
    super({ message, statusCode: 400, campo, code: 'ENTITY_INVALID_PARAMETER' });
    this.name = 'EntityInvalidParameterError';
  }
}
