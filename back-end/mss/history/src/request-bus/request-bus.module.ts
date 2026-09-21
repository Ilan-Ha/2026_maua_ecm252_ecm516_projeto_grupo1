import { Module } from '@nestjs/common';
import { RequestBusController } from './request-bus.controller';

@Module({
  controllers: [RequestBusController],
})
export class RequestBusModule {}
