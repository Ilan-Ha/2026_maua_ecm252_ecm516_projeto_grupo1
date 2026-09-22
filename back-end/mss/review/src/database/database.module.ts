import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGO_DB_NAME } from '../common/config/app-config';
import { Review, ReviewSchema } from '../review/schemas/review.schema';
import { ReviewRepository } from '../review/review.repository';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => {
        const uri = process.env.MONGO_URI;
        if (!uri) {
          throw new Error('MONGO_URI não definida no .env');
        }
        return {
          uri,
          dbName: MONGO_DB_NAME,
        };
      },
    }),
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
  ],
  providers: [ReviewRepository],
  exports: [MongooseModule, ReviewRepository],
})
export class DatabaseModule {}
