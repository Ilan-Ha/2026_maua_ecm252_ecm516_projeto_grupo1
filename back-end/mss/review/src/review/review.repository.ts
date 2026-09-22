import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { ReviewEntity } from './domain/review.entity';
import { wrapDbOperation } from '../common/helpers/db';

@Injectable()
export class ReviewRepository {
  constructor(
    @InjectModel(Review.name)
    private readonly reviewModel: Model<ReviewDocument>,
  ) {}

  async getStatsByProduto(produtoId: string): Promise<{
    mediaEstrelas: number;
    total: number;
  } | null> {
    return wrapDbOperation('aggregate', ReviewEntity.collection, async () => {
      const [stats] = await this.reviewModel.aggregate([
        { $match: { produtoId } },
        {
          $group: {
            _id: null,
            mediaEstrelas: { $avg: '$estrelas' },
            total: { $sum: 1 },
          },
        },
      ]);
      return stats ?? null;
    });
  }

  findByProduto(produtoId: string): Promise<ReviewDocument[]> {
    return wrapDbOperation('find', ReviewEntity.collection, () =>
      this.reviewModel.find({ produtoId }).sort({ createdAt: -1 }).exec(),
    );
  }

  upsert(data: {
    produtoId: string;
    email: string;
    nome: string;
    estrelas: number;
    comentario: string;
  }): Promise<ReviewDocument> {
    new ReviewEntity(data);
    return wrapDbOperation('upsert', ReviewEntity.collection, () =>
      this.reviewModel
        .findOneAndUpdate(
          { produtoId: data.produtoId, email: data.email },
          data,
          {
            upsert: true,
            new: true,
            runValidators: true,
            setDefaultsOnInsert: true,
          },
        )
        .exec() as Promise<ReviewDocument>,
    );
  }
}
