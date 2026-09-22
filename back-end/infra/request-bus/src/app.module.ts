import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RequestBusModule } from './request-bus/request-bus.module';
import {
  CorrelationMiddleware,
  HttpLoggingMiddleware,
} from './common/middleware/logging.middleware';

@Module({
  imports: [RequestBusModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorrelationMiddleware, HttpLoggingMiddleware)
      .forRoutes('*');
  }
}
