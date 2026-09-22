import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ProxyService } from '../proxy/proxy.service';
import { emptyGatewayFields, isGatewayTransportError } from '../common/mss-response';

@Controller()
export class LogsController {
  constructor(private readonly proxy: ProxyService) {}

  @Get('logs')
  async list(@Query() query: Record<string, string>, @Res() res: Response) {
    try {
      const result = await this.proxy.makeRequest({
        method: 'GET',
        endpointName: 'logsList',
        ...emptyGatewayFields,
        query,
      });
      if (isGatewayTransportError(result.status)) {
        return res.status(502).json({ error: 'Serviço de logs indisponível' });
      }
      return res.status(result.status).json(result.data);
    } catch (err) {
      console.error('[gateway] Erro no proxy logs:', err);
      return res.status(502).json({ error: 'Serviço de logs indisponível' });
    }
  }

  @Get('logs/:id')
  async byId(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.proxy.makeRequest({
        method: 'GET',
        endpointName: 'logsList',
        pathSuffix: id,
        ...emptyGatewayFields,
      });
      if (isGatewayTransportError(result.status)) {
        return res.status(502).json({ error: 'Serviço de logs indisponível' });
      }
      return res.status(result.status).json(result.data);
    } catch (err) {
      console.error('[gateway] Erro no proxy logs/:id:', err);
      return res.status(502).json({ error: 'Serviço de logs indisponível' });
    }
  }
}
