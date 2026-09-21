import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ReviewModule } from './review/review.module';

@Module({
  imports: [DatabaseModule, ReviewModule],
})
export class AppModule {}
