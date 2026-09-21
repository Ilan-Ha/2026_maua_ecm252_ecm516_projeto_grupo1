import { AppLoggingModule } from './common/logging/logging.module';
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { EventBusModule } from './event-bus/event-bus.module';

@Module({
  imports: [AppLoggingModule.forRoot('auth'), DatabaseModule, AuthModule, EventBusModule],
})
export class AppModule {}
