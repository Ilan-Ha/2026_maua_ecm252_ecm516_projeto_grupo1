import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { HistoryModule } from './history/history.module';
import { EventBusModule } from './event-bus/event-bus.module';
import { RequestBusModule } from './request-bus/request-bus.module';

@Module({
  imports: [DatabaseModule, HistoryModule, EventBusModule, RequestBusModule],
})
export class AppModule {}
