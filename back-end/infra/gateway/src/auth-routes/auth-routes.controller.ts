import {
  Body,
  Controller,
  Post,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { ProxyService } from '../proxy/proxy.service';
import {
  emptyGatewayFields,
  formatMssMessage,
  isGatewayTransportError,
  parseMssResponse,
  sessionFromContent,
} from '../common/mss-response';

@Controller()
export class AuthRoutesController {
  constructor(private readonly proxy: ProxyService) {}

  @Post('login')
  async login(
    @Body() body: { email?: string; senha?: string },
    @Res() res: Response,
  ) {
    try {
      const { email, senha } = body ?? {};
      const result = await this.proxy.makeRequest({
        method: 'POST',
        endpointName: 'authLogin',
        body: { payload: { email, senha } },
        ...emptyGatewayFields,
      });
      if (isGatewayTransportError(result.status)) {
        return res.status(result.status).json({ message: 'Erro ao conectar com o servidor' });
      }
      const data = parseMssResponse(result.data);
      if (data.error) {
        return res
          .status(data.status || 401)
          .json({ message: formatMssMessage(data.message) });
      }
      return res.json({
        message: data.message || 'Login OK',
        ...sessionFromContent(data.content),
      });
    } catch (err) {
      console.error('[gateway] Erro no login:', err);
      return res.status(500).json({ message: 'Erro ao conectar com o servidor' });
    }
  }

  @Post('auth/refresh')
  async refresh(
    @Body() body: { refreshToken?: string },
    @Res() res: Response,
  ) {
    try {
      const result = await this.proxy.makeRequest({
        method: 'POST',
        endpointName: 'authRefresh',
        body: { payload: { refreshToken: body?.refreshToken } },
        ...emptyGatewayFields,
      });
      if (isGatewayTransportError(result.status)) {
        return res.status(result.status).json({ message: 'Erro ao conectar com o servidor' });
      }
      const data = parseMssResponse(result.data);
      if (data.error) {
        return res
          .status(data.status || 401)
          .json({ message: formatMssMessage(data.message) });
      }
      return res.json({
        message: data.message || 'Token renovado',
        ...sessionFromContent(data.content),
      });
    } catch (err) {
      console.error('[gateway] Erro no refresh:', err);
      return res.status(500).json({ message: 'Erro ao renovar token' });
    }
  }

  @Post('auth/logout')
  async logout(
    @Body() body: { refreshToken?: string },
    @Res() res: Response,
  ) {
    try {
      const result = await this.proxy.makeRequest({
        method: 'POST',
        endpointName: 'authLogout',
        body: { payload: { refreshToken: body?.refreshToken } },
        ...emptyGatewayFields,
      });
      if (isGatewayTransportError(result.status)) {
        return res.status(result.status).json({ message: 'Erro ao conectar com o servidor' });
      }
      return res.json({ message: 'Logout OK' });
    } catch (err) {
      console.error('[gateway] Erro no logout:', err);
      return res.status(500).json({ message: 'Erro ao sair' });
    }
  }

  @Post('cadastro')
  async register(
    @Body()
    body: {
      nome?: string;
      email?: string;
      senha?: string;
      confirmarSenha?: string;
    },
    @Res() res: Response,
  ) {
    try {
      const { nome, email, senha, confirmarSenha } = body ?? {};
      const result = await this.proxy.makeRequest({
        method: 'POST',
        endpointName: 'authRegister',
        body: {
          payload: {
            nome,
            email,
            senha,
            confirmarSenha: confirmarSenha || senha,
          },
        },
        ...emptyGatewayFields,
      });
      if (isGatewayTransportError(result.status)) {
        return res.status(result.status).json({ message: 'Erro ao conectar com o servidor' });
      }
      const data = parseMssResponse(result.data);
      if (data.error) {
        return res
          .status(data.status || 400)
          .json({ message: formatMssMessage(data.message) });
      }
      return res
        .status(data.status || 201)
        .json({ message: data.message || 'Usuário cadastrado' });
    } catch (err) {
      console.error('[gateway] Erro no cadastro:', err);
      return res.status(500).json({ message: 'Erro ao conectar com o servidor' });
    }
  }
}
