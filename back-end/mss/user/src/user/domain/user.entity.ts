import { EntityInvalidParameterError } from '../../common/helpers/errors';

export type UserProps = {
  authId: string;
  nome: string;
};

function isValidObjectId(id: string): boolean {
  return /^[a-f\d]{24}$/i.test(id);
}

export class UserEntity {
  static readonly collection = 'user';

  authId: string;
  nome: string;

  constructor(props: UserProps) {
    this.authId = String(props.authId).trim();
    this.nome = props.nome.trim();
    this.validar();
  }

  validar(): void {
    UserEntity.validarAuthId(this.authId);
    UserEntity.validarNome(this.nome);
  }

  static validarAuthId(authId: unknown): void {
    const id = String(authId ?? '').trim();
    if (!id) {
      throw new EntityInvalidParameterError('authId é obrigatório', 'authId');
    }
    if (!isValidObjectId(id)) {
      throw new EntityInvalidParameterError('authId inválido', 'authId');
    }
  }

  static validarNome(nome: unknown): string {
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
}
