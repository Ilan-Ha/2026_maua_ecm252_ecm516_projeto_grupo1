import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGO_DB_NAME } from '../common/config/app-config';
import { User, UserSchema } from '../user/schemas/user.schema';
import { UserRepository } from '../user/user.repository';

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
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserRepository],
  exports: [MongooseModule, UserRepository],
})
export class DatabaseModule {}
