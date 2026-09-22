import { Module } from '@nestjs/common';
import { ProxyModule } from '../proxy/proxy.module';
import { UserController } from './user.controller';

@Module({
  imports: [ProxyModule],
  controllers: [UserController],
})
export class UserGatewayModule {}
