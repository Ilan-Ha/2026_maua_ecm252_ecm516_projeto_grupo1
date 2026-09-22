import { Body, Controller, Put, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { ProxyService } from '../proxy/proxy.service';
import { BearerAuthGuard } from '../common/guards/bearer-auth.guard';
import {
  emptyGatewayFields,
  formatMssMessage,
  isGatewayTransportError,
  parseMssResponse,
} from '../common/mss-response';

@Controller()
export class UserController {
  constructor(private readonly proxy: ProxyService) {}

  @Put('perfil')
  @UseGuards(BearerAuthGuard)
  async update(
    @Req() req: Request,
    @Body() body: { email?: string; nome?: string; senha?: string },
    @Res() res: Response,
  ) {
    try {
      const email = req.auth?.email || body?.email;
      const { nome, senha } = body ?? {};

      if (senha) {
        const result = await this.proxy.makeRequest({
          method: 'POST',
          endpointName: 'authPassword',
          body: { payload: { email, senha, confirmarSenha: senha } },
          ...emptyGatewayFields,
        });
        if (isGatewayTransportError(result.status)) {
          return res
            .status(result.status)
            .json({ message: 'Erro ao conectar com o servidor' });
        }
        const data = parseMssResponse(result.data);
        if (data.error) {
          return res
            .status(data.status || 400)
            .json({ message: formatMssMessage(data.message) });
        }
      }

      return res.json({
        message: 'Dados atualizados',
        usuario: {
          email,
          nome: nome || req.auth?.nome,
          authId: req.auth?.sub,
        },
      });
    } catch (err) {
      console.error('[gateway] Erro no perfil:', err);
      return res.status(500).json({ message: 'Erro ao atualizar' });
    }
  }
}
