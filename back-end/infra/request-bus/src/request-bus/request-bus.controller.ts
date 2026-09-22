import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { RequestBusService } from './request-bus.service';

@Controller()
export class RequestBusController {
  constructor(private readonly requestBus: RequestBusService) {}

  @Post('requisicao')
  @HttpCode(200)
  handle(@Body() body: { request?: string; payload?: unknown }) {
    const { request, payload } = body ?? {};
    return this.requestBus.dispatch(String(request ?? ''), payload);
  }
}
