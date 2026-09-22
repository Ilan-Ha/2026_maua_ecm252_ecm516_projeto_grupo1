import { AppLoggingModule } from './common/logging/logging.module';
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { EventBusModule } from './event-bus/event-bus.module';
import { RequestBusModule } from './request-bus/request-bus.module';

@Module({
  imports: [AppLoggingModule.forRoot('user'), DatabaseModule, UserModule, EventBusModule, RequestBusModule],
})
export class AppModule {}
