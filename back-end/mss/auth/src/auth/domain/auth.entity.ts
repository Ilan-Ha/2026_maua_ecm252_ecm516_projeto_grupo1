import { EntityInvalidParameterError } from '../../common/helpers/errors';

export type AuthProps = {
  email: string;
  senha_hash: string;
  senha?: string;
  usuarioCadastrado?: boolean;
};

export class AuthEntity {
  static readonly collection = 'auth';

  email: string;
  senha_hash: string;
  usuarioCadastrado: boolean;

  constructor(props: AuthProps) {
    this.email = props.email.trim().toLowerCase();
    this.senha_hash = props.senha_hash;
    this.usuarioCadastrado = props.usuarioCadastrado ?? false;
    this.validar();
  }

  validar(): void {
    AuthEntity.validarEmail(this.email);
    AuthEntity.validarSenhaHash(this.senha_hash);
    AuthEntity.validarUsuarioCadastrado(this.usuarioCadastrado);
  }

  static validarEmail(email: string): void {
    if (!email?.trim()) {
      throw new EntityInvalidParameterError('Email é obrigatório', 'email');
    }
    if (email.length > 254) {
      throw new EntityInvalidParameterError('Email muito longo', 'email');
    }
  }

  static validarSenhaHash(senhaHash: string): void {
    if (!senhaHash?.trim()) {
      throw new EntityInvalidParameterError('Hash de senha é obrigatório', 'senha');
    }
    if (senhaHash.length !== 60) {
      throw new EntityInvalidParameterError('Hash de senha inválido', 'senha');
    }
    if (!/^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(senhaHash)) {
      throw new EntityInvalidParameterError('Hash de senha inválido', 'senha');
    }
  }

  static validarUsuarioCadastrado(usuarioCadastrado: boolean): void {
    if (typeof usuarioCadastrado !== 'boolean') {
      throw new EntityInvalidParameterError(
        'usuarioCadastrado deve ser boolean',
        'usuarioCadastrado',
      );
    }
  }
}
