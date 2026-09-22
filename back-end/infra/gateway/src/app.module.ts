import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ProxyModule } from './proxy/proxy.module';
import { AuthRoutesModule } from './auth-routes/auth-routes.module';
import { CatalogGatewayModule } from './catalog/catalog.module';
import { ReviewGatewayModule } from './review/review.module';
import { HistoryGatewayModule } from './history/history.module';
import { UserGatewayModule } from './user/user.module';
import { LogsGatewayModule } from './logs/logs.module';
import { HealthModule } from './health/health.module';
import {
  CorrelationMiddleware,
  HttpLoggingMiddleware,
} from './common/middleware/logging.middleware';

@Module({
  imports: [
    ProxyModule,
    AuthRoutesModule,
    CatalogGatewayModule,
    ReviewGatewayModule,
    HistoryGatewayModule,
    UserGatewayModule,
    LogsGatewayModule,
    HealthModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorrelationMiddleware, HttpLoggingMiddleware)
      .forRoutes('*');
  }
}
