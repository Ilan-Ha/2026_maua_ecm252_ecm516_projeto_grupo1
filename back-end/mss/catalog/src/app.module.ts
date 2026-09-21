import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { CatalogModule } from './catalog/catalog.module';
import { RequestBusModule } from './request-bus/request-bus.module';
import { EventBusModule } from './event-bus/event-bus.module';

@Module({
  imports: [DatabaseModule, CatalogModule, RequestBusModule, EventBusModule],
})
export class AppModule {}
