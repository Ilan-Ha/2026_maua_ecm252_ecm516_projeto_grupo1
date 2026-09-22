import { Module } from '@nestjs/common';
import { RequestBusController } from './request-bus.controller';
import { RequestBusService } from './request-bus.service';

@Module({
  controllers: [RequestBusController],
  providers: [RequestBusService],
})
export class RequestBusModule {}
