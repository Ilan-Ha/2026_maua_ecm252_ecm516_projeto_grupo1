import { Module } from '@nestjs/common';
import { EventBusController } from './event-bus.controller';
import { EventBusLifecycle } from './event-bus.lifecycle';

@Module({
  controllers: [EventBusController],
  providers: [EventBusLifecycle],
})
export class EventBusModule {}
