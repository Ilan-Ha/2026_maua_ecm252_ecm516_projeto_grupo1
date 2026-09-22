import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ProxyService } from '../proxy/proxy.service';
import {
  emptyGatewayFields,
  isGatewayTransportError,
  parseMssResponse,
} from '../common/mss-response';

@Controller()
export class HealthController {
  constructor(private readonly proxy: ProxyService) {}

  @Get('health')
  async health(@Res() res: Response) {
    const [catalogResult, reviewResult] = await Promise.all([
      this.proxy.makeRequest({
        method: 'GET',
        endpointName: 'catalogList',
        ...emptyGatewayFields,
      }),
      this.proxy.makeRequest({
        method: 'GET',
        endpointName: 'reviewHealth',
        ...emptyGatewayFields,
      }),
    ]);

    const catalogData = parseMssResponse(catalogResult.data);
    const catalogOk = !catalogData.error && Boolean(catalogData.content);
    const reviewBody = reviewResult.data as Record<string, unknown> | undefined;
    const reviewDb = reviewBody?.db === true;

    return res.json({
      backend: true,
      catalog: catalogOk,
      db: catalogOk || reviewDb,
      status: catalogOk ? 'ok' : 'degraded',
    });
  }

  @Get('health/db')
  async healthDb(@Res() res: Response) {
    try {
      const result = await this.proxy.makeRequest({
        method: 'GET',
        endpointName: 'catalogList',
        ...emptyGatewayFields,
      });
      if (isGatewayTransportError(result.status)) {
        return res.json({ db: false, status: 'error' });
      }
      const data = parseMssResponse(result.data);
      const ok = !data.error;
      return res.json({ db: ok, status: ok ? 'ok' : 'error' });
    } catch {
      return res.json({ db: false, status: 'error' });
    }
  }
}
