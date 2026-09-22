import { Module } from '@nestjs/common';
import { ProxyModule } from '../proxy/proxy.module';
import { AuthRoutesController } from './auth-routes.controller';

@Module({
  imports: [ProxyModule],
  controllers: [AuthRoutesController],
})
export class AuthRoutesModule {}
