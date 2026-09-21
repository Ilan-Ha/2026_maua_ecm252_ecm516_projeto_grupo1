import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGO_DB_NAME } from '../common/config/app-config';
import { Auth, AuthSchema } from '../auth/schemas/auth.schema';
import {
  RefreshToken,
  RefreshTokenSchema,
} from '../auth/schemas/refresh-token.schema';
import { AuthRepository } from '../auth/auth.repository';
import { RefreshTokenRepository } from '../auth/refresh-token.repository';

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
    MongooseModule.forFeature([
      { name: Auth.name, schema: AuthSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
  ],
  providers: [AuthRepository, RefreshTokenRepository],
  exports: [MongooseModule, AuthRepository, RefreshTokenRepository],
})
export class DatabaseModule {}
