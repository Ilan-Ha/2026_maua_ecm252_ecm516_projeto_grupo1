import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { ReviewService } from './review.service';
import { AuditLog } from '../common/logging/audit-log.decorator';

@Controller()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('health')
  health() {
    return this.reviewService.getHealth();
  }

  @Get('reviews/produto/:produtoId')
  listByProduto(@Param('produtoId') produtoId: string) {
    return this.reviewService.listByProduto(produtoId);
  }

  @Post('reviews')
  @HttpCode(201)
  @AuditLog({ message: 'Review criada/atualizada', kind: 'manual' })
  create(@Body() body: unknown) {
    return this.reviewService.createOrUpdate(body);
  }
}
