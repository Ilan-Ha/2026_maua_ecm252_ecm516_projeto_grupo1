import { Module, DynamicModule, Provider } from '@nestjs/common';
import { APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { HttpLoggingInterceptor } from './http-logging.interceptor';
import { AuditLogInterceptor } from './audit-log.interceptor';

@Module({})
export class AppLoggingModule {
  static forRoot(serviceName: string): DynamicModule {
    const httpProvider: Provider = {
      provide: APP_INTERCEPTOR,
      useFactory: () => new HttpLoggingInterceptor(serviceName),
    };
    const auditProvider: Provider = {
      provide: APP_INTERCEPTOR,
      useFactory: (reflector: Reflector) =>
        new AuditLogInterceptor(reflector, serviceName),
      inject: [Reflector],
    };
    return {
      module: AppLoggingModule,
      providers: [httpProvider, auditProvider],
    };
  }
}
