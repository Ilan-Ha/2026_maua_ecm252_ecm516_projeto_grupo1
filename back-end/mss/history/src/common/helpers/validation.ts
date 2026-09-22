import { ValidationError } from './errors';

function isValidObjectId(id: string): boolean {
  return /^[a-f\d]{24}$/i.test(id);
}

export function validarPayload(payload: unknown): Record<string, unknown> {
  if (!payload || typeof payload !== 'object') {
    throw new ValidationError('Payload é obrigatório', 'payload');
  }
  return payload as Record<string, unknown>;
}

export function validarCampoObrigatorio(valor: unknown, campo: string, mensagem?: string): string {
  if (valor == null || (typeof valor === 'string' && !valor.trim())) {
    throw new ValidationError(mensagem ?? `${campo} é obrigatório`, campo);
  }
  return String(valor).trim();
}

export function validarObjectId(valor: unknown, campo: string): string {
  const id = validarCampoObrigatorio(valor, campo);
  if (!isValidObjectId(id)) throw new ValidationError('ID inválido', campo);
  return id;
}
