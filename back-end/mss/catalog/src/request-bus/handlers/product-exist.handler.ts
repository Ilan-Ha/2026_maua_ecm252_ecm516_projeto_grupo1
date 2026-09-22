import { Injectable } from '@nestjs/common';
import { CatalogService } from '../../catalog/catalog.service';
import { validarObjectId, validarPayload } from '../../common/helpers/validation';
import { AppError, NotFoundError } from '../../common/helpers/errors';
import { SERVICE_NAME, getAppConfig } from '../../common/config/app-config';

@Injectable()
export class ProductExistHandler {
  readonly requestName: string;

  constructor(private readonly catalogService: CatalogService) {
    this.requestName = getAppConfig().requests.catalog.product.exist;
  }

  async handle(payload: unknown): Promise<{
    error: boolean;
    status?: number;
    message?: string | Record<string, string>;
  }> {
    try {
      const dados = validarPayload(payload);
      const productId = validarObjectId(dados.productId, 'productId');
      const exists = await this.catalogService.productExists(productId);
      if (!exists) {
        throw new NotFoundError('Produto não encontrado');
      }
      return { error: false };
    } catch (e) {
      console.error(
        `[${SERVICE_NAME}][request] ${this.requestName}`,
        e instanceof Error ? e.message : e,
      );
      if (e instanceof AppError) {
        return {
          error: true,
          status: e.statusCode,
          message: e.campo ? { [e.campo]: e.message } : e.message,
        };
      }
      return {
        error: true,
        status: 500,
        message: 'Erro interno de servidor catalog',
      };
    }
  }
}
