import { Module } from '@nestjs/common';
import { ProxyModule } from '../proxy/proxy.module';
import { HistoryController } from './history.controller';

@Module({
  imports: [ProxyModule],
  controllers: [HistoryController],
})
export class HistoryGatewayModule {}
