import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loadEnv } from './common/config/load-env';
import { getAppConfig, PORT_KEY } from './common/config/app-config';
import {
  GatewayAllExceptionFilter,
  GatewayHttpExceptionFilter,
} from './common/filters/http-exception.filter';

async function bootstrap() {
  loadEnv(__dirname);
  const config = getAppConfig();
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: [/localhost/, /127\.0\.0\.1/] });
  app.useGlobalFilters(
    new GatewayHttpExceptionFilter(),
    new GatewayAllExceptionFilter(),
  );
  const port = config.ports.back[PORT_KEY];
  const base = config.url;
  const svc = config.ports.back;
  await app.listen(port);
  console.log(`[gateway] Rodando em ${base}:${port}`);
  console.log(`[gateway] Auth    → ${base}:${svc.auth}`);
  console.log(`[gateway] Catalog → ${base}:${svc.catalog}`);
  console.log(`[gateway] Review  → ${base}:${svc.review}`);
  console.log(`[gateway] History → ${base}:${svc.history}`);
  console.log(`[gateway] Logs    → ${base}:${svc.logs}`);
}

bootstrap();
