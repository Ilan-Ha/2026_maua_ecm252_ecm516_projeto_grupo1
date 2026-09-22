import { Module } from '@nestjs/common';
import { ProxyModule } from '../proxy/proxy.module';
import { LogsController } from './logs.controller';

@Module({
  imports: [ProxyModule],
  controllers: [LogsController],
})
export class LogsGatewayModule {}
