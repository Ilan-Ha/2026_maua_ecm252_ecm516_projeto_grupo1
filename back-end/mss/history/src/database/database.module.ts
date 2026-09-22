import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGO_DB_NAME } from '../common/config/app-config';
import { History, HistorySchema } from '../history/schemas/history.schema';
import { HistoryRepository } from '../history/history.repository';

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
    MongooseModule.forFeature([{ name: History.name, schema: HistorySchema }]),
  ],
  providers: [HistoryRepository],
  exports: [MongooseModule, HistoryRepository],
})
export class DatabaseModule {}
