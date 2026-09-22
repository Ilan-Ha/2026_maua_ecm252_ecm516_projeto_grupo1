import { EntityInvalidParameterError } from './errors';

/** Copiado de user/entities/user.ts — User Nest domain ainda não existe neste flat layout */
export function validarNome(nome: unknown): string {
  const nomeStr = String(nome ?? '').trim();
  if (!nomeStr) {
    throw new EntityInvalidParameterError('Nome é obrigatório', 'nome');
  }
  if (nomeStr.length < 2) {
    throw new EntityInvalidParameterError('Mínimo de 2 caracteres', 'nome');
  }
  if (nomeStr.length > 50) {
    throw new EntityInvalidParameterError('Máximo de 50 caracteres', 'nome');
  }
  if (!/^[\p{L}\s'-]+$/u.test(nomeStr)) {
    throw new EntityInvalidParameterError(
      'Nome contém caracteres inválidos',
      'nome',
    );
  }
  return nomeStr;
}
