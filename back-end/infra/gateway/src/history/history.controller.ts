import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
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
export class HistoryController {
  constructor(private readonly proxy: ProxyService) {}

  @Post('historico')
  @UseGuards(BearerAuthGuard)
  async register(@Req() req: Request, @Body() body: any, @Res() res: Response) {
    try {
      const authId = req.auth!.sub;
      const result = await this.proxy.makeRequest({
        method: 'POST',
        endpointName: 'history',
        body: {
          authId,
          productId: body?.productId ?? body?._id,
          _id: body?._id ?? body?.productId,
        },
        ...emptyGatewayFields,
      });
      if (isGatewayTransportError(result.status)) {
        return res.status(502).json({ error: 'Serviço de histórico indisponível' });
      }
      const data = parseMssResponse(result.data);
      if (data.error) {
        return res
          .status(data.status || 400)
          .json({
            error: formatMssMessage(data.message) || 'Erro ao registrar histórico',
          });
      }
      return res
        .status(data.status || 200)
        .json({ message: data.message || 'Acesso registrado' });
    } catch (err) {
      console.error('[gateway] Erro no histórico:', err);
      return res.status(502).json({ error: 'Serviço de histórico indisponível' });
    }
  }

  @Get('historico')
  @UseGuards(BearerAuthGuard)
  async list(@Req() req: Request, @Res() res: Response) {
    try {
      const result = await this.proxy.makeRequest({
        method: 'GET',
        endpointName: 'history',
        ...emptyGatewayFields,
        query: { authId: req.auth!.sub },
      });
      if (isGatewayTransportError(result.status)) {
        return res.status(502).json({ error: 'Serviço de histórico indisponível' });
      }
      const data = parseMssResponse(result.data);
      if (data.error) {
        return res
          .status(data.status || 400)
          .json({
            error: formatMssMessage(data.message) || 'Erro ao carregar histórico',
          });
      }
      return res.status(data.status || 200).json({
        error: false,
        content: data.content ?? [],
      });
    } catch (err) {
      console.error('[gateway] Erro ao listar histórico:', err);
      return res.status(502).json({ error: 'Serviço de histórico indisponível' });
    }
  }

  @Delete('historico')
  @UseGuards(BearerAuthGuard)
  async clear(@Req() req: Request, @Res() res: Response) {
    try {
      const result = await this.proxy.makeRequest({
        method: 'DELETE',
        endpointName: 'history',
        ...emptyGatewayFields,
        query: { authId: req.auth!.sub },
      });
      if (isGatewayTransportError(result.status)) {
        return res.status(502).json({ error: 'Serviço de histórico indisponível' });
      }
      const data = parseMssResponse(result.data);
      if (data.error) {
        return res
          .status(data.status || 400)
          .json({
            error: formatMssMessage(data.message) || 'Erro ao limpar histórico',
          });
      }
      return res
        .status(data.status || 200)
        .json({ message: data.message || 'Histórico limpo' });
    } catch (err) {
      console.error('[gateway] Erro ao limpar histórico:', err);
      return res.status(502).json({ error: 'Serviço de histórico indisponível' });
    }
  }
}
