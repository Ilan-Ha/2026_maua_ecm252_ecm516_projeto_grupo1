import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ProxyService } from '../proxy/proxy.service';
import { BearerAuthGuard } from '../common/guards/bearer-auth.guard';
import { emptyGatewayFields, isGatewayTransportError } from '../common/mss-response';

@Controller()
export class ReviewController {
  constructor(private readonly proxy: ProxyService) {}

  @Get('reviews/produto/:produtoId')
  async list(@Param('produtoId') produtoId: string, @Res() res: Response) {
    try {
      const result = await this.proxy.makeRequest({
        method: 'GET',
        endpointName: 'reviewList',
        pathSuffix: produtoId,
        ...emptyGatewayFields,
      });
      if (isGatewayTransportError(result.status)) {
        return res.status(502).json({ error: 'Serviço de avaliações indisponível' });
      }
      return res.status(result.status).json(result.data);
    } catch (err) {
      console.error('[gateway] Erro no proxy review:', err);
      return res.status(502).json({ error: 'Serviço de avaliações indisponível' });
    }
  }

  @Post('reviews')
  @UseGuards(BearerAuthGuard)
  async create(@Req() req: Request, @Body() body: unknown, @Res() res: Response) {
    try {
      const result = await this.proxy.makeRequest({
        method: 'POST',
        endpointName: 'reviewCreate',
        body: {
          ...(body as object),
          email: req.auth?.email,
          nome: req.auth?.nome,
        },
        ...emptyGatewayFields,
      });
      if (isGatewayTransportError(result.status)) {
        return res.status(502).json({ error: 'Serviço de avaliações indisponível' });
      }
      return res.status(result.status).json(result.data);
    } catch (err) {
      console.error('[gateway] Erro no proxy review:', err);
      return res.status(502).json({ error: 'Serviço de avaliações indisponível' });
    }
  }
}
