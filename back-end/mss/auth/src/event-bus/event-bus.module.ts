import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { EventBusController } from './event-bus.controller';
import { EventBusLifecycle } from './event-bus.lifecycle';

@Module({
  imports: [AuthModule],
  controllers: [EventBusController],
  providers: [EventBusLifecycle],
})
export class EventBusModule {}
