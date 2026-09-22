import { Module } from '@nestjs/common';
import { LogsModule } from './logs/logs.module';
import { AppLoggingModule } from './common/logging/logging.module';

@Module({
  imports: [AppLoggingModule.forRoot('logs'), LogsModule],
})
export class AppModule {}
