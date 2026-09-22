import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { RequestBusController } from './request-bus.controller';

@Module({
  imports: [UserModule],
  controllers: [RequestBusController],
})
export class RequestBusModule {}
