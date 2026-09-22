import { Controller, Get, Param, Query } from '@nestjs/common';
import { LogsService } from './logs.service';

@Controller()
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get('logs')
  list(
    @Query('service') service?: string,
    @Query('level') level?: string,
    @Query('q') q?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    return this.logsService.list({ service, level, q, from, to, cursor, limit });
  }

  @Get('logs/:id')
  byId(@Param('id') id: string) {
    return this.logsService.byId(id);
  }
}
