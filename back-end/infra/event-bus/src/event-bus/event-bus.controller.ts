import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { EventBusService } from './event-bus.service';
import { getAppConfig } from '../common/config/app-config';

@Controller()
export class EventBusController {
  constructor(private readonly eventBus: EventBusService) {}

  @Get('dados')
  snapshot() {
    return this.eventBus.snapshot();
  }

  @Post('inscricao')
  @HttpCode(204)
  subscribe(
    @Body()
    body: { calbackUrl?: string; serviceName?: string; events?: string[] },
    @Res() res: Response,
  ) {
    const { calbackUrl, serviceName, events } = body ?? {};
    if (!serviceName || !calbackUrl || !Array.isArray(events)) {
      return res.status(400).json({ error: true, message: 'Body inválido' });
    }
    this.eventBus.subscribe(serviceName, calbackUrl, events);
    return res.status(204).end();
  }

  @Post('desinscricao')
  @HttpCode(204)
  unsubscribe(
    @Body()
    body: { calbackUrl?: string; serviceName?: string; events?: string[] },
    @Res() res: Response,
  ) {
    const { calbackUrl, serviceName, events } = body ?? {};
    if (!serviceName || !calbackUrl || !Array.isArray(events)) {
      return res.status(400).json({ error: true, message: 'Body inválido' });
    }
    this.eventBus.unsubscribe(serviceName, calbackUrl, events);
    return res.status(204).end();
  }

  @Post('eventos')
  @HttpCode(202)
  async publish(
    @Body() body: { event?: string; payload?: unknown },
    @Res() res: Response,
  ) {
    const { event, payload } = body ?? {};
    if (!event || typeof event !== 'string' || payload == null) {
      return res.status(400).json({ error: true, message: 'Body inválido' });
    }
    await this.eventBus.publish(event, payload);
    return res.status(202).end();
  }
}

/** Ensure path constants stay aligned with config (used in docs/tests) */
export function eventPaths() {
  return getAppConfig().paths.events;
}
