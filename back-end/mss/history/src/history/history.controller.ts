import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { HistoryService } from './history.service';
import { AuditLog } from '../common/logging/audit-log.decorator';

@Controller()
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Post('historico')
  @AuditLog({ message: 'Acesso registrado no histórico', kind: 'manual' })
  registrar(@Body() body: unknown) {
    return this.historyService.registrarAcesso(body);
  }

  @Get('historico')
  listar(@Query('authId') authId: string) {
    return this.historyService.listar(authId);
  }

  @Delete('historico')
  limpar(@Query('authId') authId: string) {
    return this.historyService.limpar(authId);
  }
}
