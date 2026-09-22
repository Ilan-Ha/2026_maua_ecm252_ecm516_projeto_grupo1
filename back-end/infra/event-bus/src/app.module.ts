import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { EventBusModule } from './event-bus/event-bus.module';
import {
  CorrelationMiddleware,
  HttpLoggingMiddleware,
} from './common/middleware/logging.middleware';

@Module({
  imports: [EventBusModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorrelationMiddleware, HttpLoggingMiddleware)
      .forRoutes('*');
  }
}
