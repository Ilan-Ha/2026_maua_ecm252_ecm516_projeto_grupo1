import { HttpException, Injectable } from '@nestjs/common';
import axios from 'axios';
import mongoose from 'mongoose';
import { ReviewRepository } from './review.repository';
import { ReviewEntity } from './domain/review.entity';
import { validarPayload } from '../common/helpers/validation';
import { AppError } from '../common/helpers/errors';
import { getAppConfig, SERVICE_NAME } from '../common/config/app-config';
import { ReviewDocument } from './schemas/review.schema';

function mapErrorToReviewHttp(err: unknown): HttpException {
  if (err instanceof AppError) {
    if (err.campo) {
      return new HttpException(
        {
          message: 'Dados inválidos',
          errors: { [err.campo]: [err.message] },
          code: err.code,
        },
        err.statusCode,
      );
    }
    return new HttpException(
      { message: err.message, code: err.code },
      err.statusCode,
    );
  }
  return new HttpException({ message: 'Erro interno' }, 500);
}

@Injectable()
export class ReviewService {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  getHealth() {
    const dbOk = mongoose.connection.readyState === 1;
    return {
      backend: true,
      db: dbOk,
      status: dbOk ? 'ok' : 'degraded',
    };
  }

  async listByProduto(produtoId: string) {
    try {
      ReviewEntity.validarProdutoId(produtoId);
      const stats = await this.reviewRepository.getStatsByProduto(produtoId);
      const reviews = await this.reviewRepository.findByProduto(produtoId);

      return {
        mediaEstrelas: stats?.mediaEstrelas
          ? Math.round(stats.mediaEstrelas * 10) / 10
          : 0,
        total: stats?.total || 0,
        reviews: reviews.map((r) => ({
          _id: r._id,
          produtoId: r.produtoId,
          email: r.email,
          nome: r.nome,
          estrelas: r.estrelas,
          comentario: r.comentario,
          createdAt: (r as ReviewDocument & { createdAt?: Date }).createdAt,
          updatedAt: (r as ReviewDocument & { updatedAt?: Date }).updatedAt,
        })),
      };
    } catch (err) {
      console.error(
        `[${SERVICE_NAME}][list]`,
        err instanceof Error ? err.message : err,
      );
      throw mapErrorToReviewHttp(err);
    }
  }

  async createOrUpdate(body: unknown) {
    try {
      const dados = validarPayload(body);
      const review = await this.reviewRepository.upsert({
        produtoId: String(dados.produtoId ?? ''),
        email: String(dados.email ?? ''),
        nome: String(dados.nome ?? ''),
        estrelas: dados.estrelas as number,
        comentario: String(dados.comentario ?? ''),
      });

      await this.publishReviewCreated(review);

      return {
        message: 'Avaliação salva',
        review: {
          _id: review._id,
          produtoId: review.produtoId,
          email: review.email,
          nome: review.nome,
          estrelas: review.estrelas,
          comentario: review.comentario,
          createdAt: (review as ReviewDocument & { createdAt?: Date })
            .createdAt,
          updatedAt: (review as ReviewDocument & { updatedAt?: Date })
            .updatedAt,
        },
      };
    } catch (err) {
      console.error(
        `[${SERVICE_NAME}][create]`,
        err instanceof Error ? err.message : err,
      );
      throw mapErrorToReviewHttp(err);
    }
  }

  private async publishReviewCreated(review: ReviewDocument): Promise<void> {
    try {
      const config = getAppConfig();
      await axios.post(
        `${config.url}:${config.ports.back.eventBus}${config.paths.events.event}`,
        {
          event: config.events.review.created,
          payload: {
            produtoId: review.produtoId,
            reviewId: review._id.toString(),
            estrelas: review.estrelas,
          },
        },
      );
    } catch (err) {
      console.error(
        `[${SERVICE_NAME}][publishReviewCreated]`,
        err instanceof Error ? err.message : err,
      );
    }
  }
}
