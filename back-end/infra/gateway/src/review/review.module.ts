import { Module } from '@nestjs/common';
import { ProxyModule } from '../proxy/proxy.module';
import { ReviewController } from './review.controller';

@Module({
  imports: [ProxyModule],
  controllers: [ReviewController],
})
export class ReviewGatewayModule {}
