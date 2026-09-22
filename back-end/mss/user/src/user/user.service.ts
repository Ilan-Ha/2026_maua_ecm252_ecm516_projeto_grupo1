import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { UserRepository } from './user.repository';
import { UserEntity } from './domain/user.entity';
import {
  validarCampoObrigatorio,
  validarObjectId,
  validarPayload,
} from '../common/helpers/validation';
import { AppError, NotFoundError } from '../common/helpers/errors';
import { getAppConfig, SERVICE_NAME } from '../common/config/app-config';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  private eventUrl(): string {
    const config = getAppConfig();
    return `${config.url}:${config.ports.back.eventBus}${config.paths.events.event}`;
  }

  async createUser(payload: { authId: string; nome: string }): Promise<void> {
    const dados = validarPayload(payload);
    const authId = validarObjectId(dados.authId, 'authId');
    const nome = validarCampoObrigatorio(dados.nome, 'nome');
    UserEntity.validarNome(nome);

    await this.userRepository.create({ authId, nome });
    const config = getAppConfig();
    await axios.post(this.eventUrl(), {
      event: config.events.user.added,
      payload: { authId },
    });
  }

  async handleReRegister(payload: unknown): Promise<void> {
    const dados = validarPayload(payload);
    const id = validarObjectId(dados.id, 'id');
    const email = validarCampoObrigatorio(dados.email, 'email');

    const usuarioExiste = await this.userRepository.existsByAuthId(id);
    if (!usuarioExiste) {
      const tempBase = email.split('@')[0];
      let tempName = tempBase;
      let i = 0;
      while (await this.userRepository.existsByNome(tempName)) {
        i++;
        tempName = `${tempBase}${i}`;
      }
      await this.createUser({ authId: id, nome: tempName });
    } else {
      const config = getAppConfig();
      await axios.post(this.eventUrl(), {
        event: config.events.user.added,
        payload: { authId: id },
      });
    }
  }

  validateNome(payload: unknown) {
    try {
      const dados = validarPayload(payload);
      const nome = validarCampoObrigatorio(dados.nome, 'nome');
      UserEntity.validarNome(nome);
      return { error: false };
    } catch (e) {
      console.error(
        `[${SERVICE_NAME}][request] name.validate`,
        e instanceof Error ? e.message : e,
      );
      return this.toErrorResult(e, 409);
    }
  }

  async nameExists(payload: unknown) {
    try {
      const dados = validarPayload(payload);
      const nome = validarCampoObrigatorio(dados.nome, 'nome');
      UserEntity.validarNome(nome);

      const nomeExiste = await this.userRepository.findByNome(nome);
      if (nomeExiste) {
        return {
          error: true,
          status: 409,
          message: { email: 'Nome já cadastrado' },
        };
      }
      return { error: false };
    } catch (e) {
      console.error(
        `[${SERVICE_NAME}][request] name.exists`,
        e instanceof Error ? e.message : e,
      );
      return this.toErrorResult(e);
    }
  }

  async nameTell(payload: unknown) {
    try {
      const dados = validarPayload(payload);
      const authId = validarObjectId(dados.authId, 'authId');
      const usuario = await this.userRepository.findByAuthId(authId);
      if (!usuario) {
        throw new NotFoundError('Usuário não encontrado');
      }
      return {
        error: false,
        content: {
          nome: usuario.nome,
          userId: String(usuario._id),
        },
      };
    } catch (e) {
      console.error(
        `[${SERVICE_NAME}][request] name.tell`,
        e instanceof Error ? e.message : e,
      );
      return this.toErrorResult(e);
    }
  }

  async userExist(payload: unknown) {
    try {
      const dados = validarPayload(payload);
      const userId = validarObjectId(dados.userId, 'userId');
      const usuario = await this.userRepository.findById(userId);
      if (!usuario) {
        throw new NotFoundError('Usuário não encontrado');
      }
      return { error: false };
    } catch (e) {
      console.error(
        `[${SERVICE_NAME}][request] user.exist`,
        e instanceof Error ? e.message : e,
      );
      return this.toErrorResult(e);
    }
  }

  async byAuthId(payload: unknown) {
    try {
      const dados = validarPayload(payload);
      const authId = validarObjectId(dados.authId, 'authId');
      const usuario = await this.userRepository.findByAuthId(authId);
      if (!usuario) {
        return { error: true, status: 404, message: 'Usuário não encontrado' };
      }
      return {
        error: false,
        content: { userId: String(usuario._id) },
      };
    } catch (e) {
      console.error(
        `[${SERVICE_NAME}][request] user.byAuthId`,
        e instanceof Error ? e.message : e,
      );
      return this.toErrorResult(e);
    }
  }

  private toErrorResult(
    e: unknown,
    forceStatus?: number,
  ): {
    error: boolean;
    status: number;
    message: string | Record<string, string>;
  } {
    if (e instanceof AppError) {
      return {
        error: true,
        status: forceStatus ?? e.statusCode,
        message: e.campo ? { [e.campo]: e.message } : e.message,
      };
    }
    return {
      error: true,
      status: forceStatus ?? 500,
      message: `Erro interno de servidor ${SERVICE_NAME}`,
    };
  }
}
