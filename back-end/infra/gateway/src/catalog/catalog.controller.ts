import { Controller, Get, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ProxyService } from '../proxy/proxy.service';
import {
  emptyGatewayFields,
  formatMssMessage,
  isGatewayTransportError,
  parseMssResponse,
} from '../common/mss-response';

@Controller()
export class CatalogController {
  constructor(private readonly proxy: ProxyService) {}

  @Get('catalogo')
  async list(@Res() res: Response) {
    try {
      const result = await this.proxy.makeRequest({
        method: 'GET',
        endpointName: 'catalogList',
        ...emptyGatewayFields,
      });
      if (isGatewayTransportError(result.status)) {
        return res.status(502).json({ error: 'Serviço de catálogo indisponível' });
      }
      const data = parseMssResponse(result.data);
      if (data.error) {
        return res
          .status(data.status || 500)
          .json({
            error: formatMssMessage(data.message) || 'Erro ao carregar catálogo',
          });
      }
      return res.json(data.content);
    } catch (err) {
      console.error('[gateway] Erro no catálogo:', err);
      return res.status(502).json({ error: 'Serviço de catálogo indisponível' });
    }
  }

  @Get('produto/:id')
  async product(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.proxy.makeRequest({
        method: 'GET',
        endpointName: 'catalogProduct',
        ...emptyGatewayFields,
        query: { id },
      });
      if (isGatewayTransportError(result.status)) {
        return res.status(502).json({ error: 'Serviço de catálogo indisponível' });
      }
      const data = parseMssResponse(result.data);
      if (data.error) {
        return res
          .status(data.status || 404)
          .json({
            error: formatMssMessage(data.message) || 'Produto não encontrado',
          });
      }
      return res.json(data.content);
    } catch (err) {
      console.error('[gateway] Erro no produto:', err);
      return res.status(502).json({ error: 'Serviço de catálogo indisponível' });
    }
  }
}
