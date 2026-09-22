import { Injectable } from '@nestjs/common';
import { findLogById, queryLogs } from '../common/logging/writer';
import { erro, sucesso } from '../common/helpers/envelope';
import { EntityInvalidParameterError } from '../common/helpers/errors';

@Injectable()
export class LogsService {
  async list(query: Record<string, string | undefined>) {
    const limit = query.limit ? Number(query.limit) : 100;
    if (Number.isNaN(limit) || limit < 1) {
      throw new EntityInvalidParameterError('limit inválido', 'limit');
    }

    const items = await queryLogs({
      service: query.service,
      level: query.level,
      q: query.q,
      from: query.from ? new Date(query.from) : undefined,
      to: query.to ? new Date(query.to) : undefined,
      before: query.cursor ? new Date(query.cursor) : undefined,
      limit,
    });

    return sucesso({
      items,
      nextCursor: items.length ? items[items.length - 1].createdAt : null,
    });
  }

  async byId(id: string) {
    const item = await findLogById(id);
    if (!item) {
      return erro(404, 'Log não encontrado');
    }
    return sucesso(item);
  }
}
