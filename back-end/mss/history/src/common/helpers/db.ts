import { AppError } from './errors';

export async function wrapDbOperation<T>(operation: string, collection: string, fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof AppError) throw err;
    const message = err instanceof Error ? err.message : `Erro de banco em ${collection}`;
    throw new AppError({
      message: `Erro ao executar "${operation}" em "${collection}": ${message}`,
      statusCode: 500,
      code: 'DB_OPERATION',
    });
  }
}
