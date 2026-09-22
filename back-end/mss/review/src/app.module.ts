import { AppLoggingModule } from './common/logging/logging.module';
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ReviewModule } from './review/review.module';

@Module({
  imports: [AppLoggingModule.forRoot('review'), DatabaseModule, ReviewModule],
})
export class AppModule {}
