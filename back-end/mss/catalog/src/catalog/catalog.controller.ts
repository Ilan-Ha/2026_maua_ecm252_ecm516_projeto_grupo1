import { Controller, Get, Query } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { sucesso } from '../common/helpers/envelope';
import { validarObjectId } from '../common/helpers/validation';
import { GetProdutoQueryDto } from './dto/get-produto-query.dto';

@Controller()
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('catalogo')
  async getCatalogo() {
    const data = await this.catalogService.getCatalogo();
    return sucesso(data);
  }

  @Get('produto')
  async getProduto(@Query() query: GetProdutoQueryDto) {
    const id = validarObjectId(query.id, 'id');
    const produto = await this.catalogService.getProdutoById(id);
    return sucesso(produto);
  }
}
