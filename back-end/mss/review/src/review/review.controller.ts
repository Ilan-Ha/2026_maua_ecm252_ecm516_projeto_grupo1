import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { ReviewService } from './review.service';

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
  create(@Body() body: unknown) {
    return this.reviewService.createOrUpdate(body);
  }
}
