import { Module } from '@nestjs/common';
import { CatalogModule } from '../catalog/catalog.module';
import { RequestBusController } from './request-bus.controller';
import { ProductExistHandler } from './handlers/product-exist.handler';

@Module({
  imports: [CatalogModule],
  controllers: [RequestBusController],
  providers: [ProductExistHandler],
})
export class RequestBusModule {}
