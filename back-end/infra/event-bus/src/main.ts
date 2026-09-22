import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loadEnv } from './common/config/load-env';
import { getAppConfig, PORT_KEY } from './common/config/app-config';

async function bootstrap() {
  loadEnv(__dirname);
  const config = getAppConfig();
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: [/localhost/, /127\.0\.0\.1/] });
  const port = config.ports.back[PORT_KEY];
  await app.listen(port);
  console.log(`Rodando em ${config.url}:${port}`);
}

bootstrap();
