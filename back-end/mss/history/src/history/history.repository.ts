import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { History, HistoryDocument } from './schemas/history.schema';
import { HistoryEntity } from './domain/history.entity';
import { wrapDbOperation } from '../common/helpers/db';

@Injectable()
export class HistoryRepository {
  constructor(
    @InjectModel(History.name)
    private readonly historyModel: Model<HistoryDocument>,
  ) {}

  createEntry(data: {
    userId: string;
    productId: string;
  }): Promise<HistoryDocument> {
    new HistoryEntity({ userId: data.userId, productId: data.productId });
    return wrapDbOperation('create', HistoryEntity.collection, () =>
      this.historyModel
        .findOneAndUpdate(
          { userId: data.userId, productId: data.productId },
          {
            $set: { userId: data.userId, productId: data.productId },
            $currentDate: { createdAt: true },
          },
          { upsert: true, new: true },
        )
        .exec() as Promise<HistoryDocument>,
    );
  }

  getByUserId(
    userId: string,
  ): Promise<Array<{ productId: unknown; createdAt: Date }>> {
    return wrapDbOperation('find', HistoryEntity.collection, () =>
      this.historyModel
        .find({ userId })
        .sort({ createdAt: -1 })
        .limit(50)
        .select('productId createdAt')
        .lean()
        .exec(),
    );
  }

  clearByUserId(userId: string): Promise<{ deletedCount?: number }> {
    return wrapDbOperation('delete', HistoryEntity.collection, () =>
      this.historyModel.deleteMany({ userId }).exec(),
    );
  }
}
