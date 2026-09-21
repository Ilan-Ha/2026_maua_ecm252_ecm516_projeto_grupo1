import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { EventBusController } from './event-bus.controller';
import { EventBusLifecycle } from './event-bus.lifecycle';

@Module({
  imports: [UserModule],
  controllers: [EventBusController],
  providers: [EventBusLifecycle],
})
export class EventBusModule {}
