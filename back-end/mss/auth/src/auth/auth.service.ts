import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from './auth.repository';
import { RefreshTokenRepository } from './refresh-token.repository';
import { TokenService } from './token.service';
import { authSchemaZod, formatZodPasswordErrors } from './password.schema';
import { validarNome } from '../common/helpers/nome';
import {
  validarCampoObrigatorio,
  validarObjectId,
  validarPayload,
} from '../common/helpers/validation';
import { erro, sucesso, sucessoMsg } from '../common/helpers/envelope';
import { getAppConfig } from '../common/config/app-config';
import { AuthDocument } from './schemas/auth.schema';

function resolveSenhaHash(doc: {
  senha_hash?: string;
  senha?: string;
} | null): string | undefined {
  if (!doc) return undefined;
  return doc.senha_hash ?? doc.senha;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly tokenService: TokenService,
  ) {}

  private requestUrl(): string {
    const config = getAppConfig();
    return `${config.url}:${config.ports.back.requestBus}${config.paths.requests.request}`;
  }

  private eventUrl(): string {
    const config = getAppConfig();
    return `${config.url}:${config.ports.back.eventBus}${config.paths.events.event}`;
  }

  private async issueSession(claims: {
    authId: string;
    email: string;
    nome: string;
  }) {
    const accessToken = this.tokenService.signAccess(claims);
    const refresh = this.tokenService.signRefresh(claims.authId);
    await this.refreshTokenRepository.create({
      authId: claims.authId,
      jti: refresh.jti,
      expiresAt: refresh.expiresAt,
    });

    return {
      usuario: {
        nome: claims.nome,
        email: claims.email,
        authId: claims.authId,
      },
      accessToken,
      refreshToken: refresh.token,
      expiresIn: this.tokenService.accessTtlSeconds(),
      tokenType: 'Bearer',
    };
  }

  async cadastro(body: unknown) {
    const payload = validarPayload(
      (body as { payload?: unknown })?.payload ?? body,
    );
    const email = validarCampoObrigatorio(payload.email, 'email');
    const senha = validarCampoObrigatorio(payload.senha, 'senha');
    const confirmarSenha = validarCampoObrigatorio(
      payload.confirmarSenha,
      'confirmarSenha',
    );
    const nome = validarCampoObrigatorio(payload.nome, 'nome');
    validarNome(nome);

    const result = authSchemaZod.safeParse({ email, senha, confirmarSenha });
    if (!result.success) {
      return erro(400, formatZodPasswordErrors(result.error));
    }

    const config = getAppConfig();
    const nomeResult = await axios.post(this.requestUrl(), {
      request: config.requests.user.name.valdate,
      payload: { nome },
    });
    const nomeValidation = nomeResult.data;
    if (nomeValidation.error) {
      return erro(nomeValidation.status, nomeValidation.message);
    }

    const emailExiste = await this.authRepository.findByEmail(email);
    if (emailExiste) {
      return erro(409, { email: 'Email já cadastrado' });
    }

    const nomeExisteResult = await axios.post(this.requestUrl(), {
      request: config.requests.user.name.exits,
      payload: { nome },
    });
    const nomeExiste = nomeExisteResult.data;
    if (nomeExiste.error) {
      return erro(nomeExiste.status, nomeExiste.message);
    }

    const auth = await this.authRepository.create({ email, senha });

    await axios.post(this.eventUrl(), {
      event: config.events.user.register,
      payload: {
        authId: auth._id,
        nome,
      },
    });

    return sucessoMsg('Usuário cadastrado', 201);
  }

  async login(body: unknown) {
    const payload = validarPayload(
      (body as { payload?: unknown })?.payload ?? body,
    );
    const email = validarCampoObrigatorio(payload.email, 'email');
    const senha = validarCampoObrigatorio(payload.senha, 'senha');

    const autentificacao = await this.authRepository.findByEmail(email);
    if (!autentificacao) {
      return erro(401, 'Email não encontrado');
    }

    const config = getAppConfig();

    if (!autentificacao.usuarioCadastrado) {
      await axios.post(this.eventUrl(), {
        event: config.events.user['not.register'],
        payload: {
          id: autentificacao._id,
          email: autentificacao.email,
        },
      });
      return erro(500, 'Erro durante cadastro. Por favor tente novamente.');
    }

    const senhaHash = resolveSenhaHash(autentificacao);
    if (!senhaHash) {
      return erro(500, 'Conta com dados de autenticação inválidos');
    }

    const senhaCorreta = await bcrypt.compare(senha, senhaHash);
    if (!senhaCorreta) {
      return erro(401, 'Senha inválida');
    }

    const result = await axios.post(this.requestUrl(), {
      request: config.requests.user.name.tell,
      payload: { authId: autentificacao._id },
    });

    const { content } = result.data;
    const { nome } = content;
    const session = await this.issueSession({
      authId: String(autentificacao._id),
      email: autentificacao.email,
      nome,
    });

    return sucesso(session, 200, 'Login OK');
  }

  async refresh(body: unknown) {
    const payload = validarPayload(
      (body as { payload?: unknown })?.payload ?? body,
    );
    const refreshToken = validarCampoObrigatorio(
      payload.refreshToken,
      'refreshToken',
    );

    try {
      const decoded = this.tokenService.verifyRefresh(refreshToken);
      const stored = await this.refreshTokenRepository.findValid(decoded.jti);
      if (!stored || stored.authId !== decoded.sub) {
        return erro(401, 'Refresh token inválido');
      }

      const auth = await this.authRepository.findById(decoded.sub);
      if (!auth) {
        return erro(401, 'Usuário não encontrado');
      }

      await this.refreshTokenRepository.revoke(decoded.jti);

      const config = getAppConfig();
      const result = await axios.post(this.requestUrl(), {
        request: config.requests.user.name.tell,
        payload: { authId: auth._id },
      });
      const nome = result.data?.content?.nome || '';

      const session = await this.issueSession({
        authId: String(auth._id),
        email: auth.email,
        nome,
      });
      return sucesso(session, 200, 'Token renovado');
    } catch {
      return erro(401, 'Refresh token inválido ou expirado');
    }
  }

  async logout(body: unknown) {
    const payload = validarPayload(
      (body as { payload?: unknown })?.payload ?? body,
    );
    const refreshToken = payload.refreshToken
      ? String(payload.refreshToken)
      : '';
    if (refreshToken) {
      try {
        const decoded = this.tokenService.verifyRefresh(refreshToken);
        await this.refreshTokenRepository.revoke(decoded.jti);
      } catch {
        // already invalid
      }
    }
    return sucessoMsg('Logout OK', 200);
  }

  async atualizarSenha(body: unknown) {
    const payload = validarPayload(
      (body as { payload?: unknown })?.payload ?? body,
    );
    const email = validarCampoObrigatorio(payload.email, 'email');
    const senha = validarCampoObrigatorio(payload.senha, 'senha');
    const confirmarSenha = validarCampoObrigatorio(
      payload.confirmarSenha,
      'confirmarSenha',
    );

    const usuario = await this.authRepository.findByEmail(email);
    if (!usuario) {
      return erro(404, 'Usuário não encontrado');
    }

    const result = authSchemaZod.safeParse({ email, senha, confirmarSenha });
    if (!result.success) {
      return erro(400, formatZodPasswordErrors(result.error));
    }

    await this.authRepository.updateSenhaByEmail(email, senha);
    await this.refreshTokenRepository.revokeAllForAuth(String(usuario._id));
    return sucessoMsg('Senha atualizada', 200);
  }

  async markUsuarioCadastrado(payload: unknown): Promise<AuthDocument | null> {
    const dados = validarPayload(payload);
    const authId = validarObjectId(dados.authId, 'authId');
    return this.authRepository.markUsuarioCadastrado(authId);
  }
}
