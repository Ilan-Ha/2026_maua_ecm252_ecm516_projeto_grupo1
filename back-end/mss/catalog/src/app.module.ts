import { AppLoggingModule } from './common/logging/logging.module';
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { CatalogModule } from './catalog/catalog.module';
import { RequestBusModule } from './request-bus/request-bus.module';
import { EventBusModule } from './event-bus/event-bus.module';

@Module({
  imports: [AppLoggingModule.forRoot('catalog'), DatabaseModule, CatalogModule, RequestBusModule, EventBusModule],
})
export class AppModule {}
