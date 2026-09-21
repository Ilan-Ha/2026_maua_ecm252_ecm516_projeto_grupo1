import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { HistoryRepository } from './history.repository';
import {
  validarCampoObrigatorio,
  validarObjectId,
} from '../common/helpers/validation';
import { erro, sucesso, sucessoMsg } from '../common/helpers/envelope';
import { getAppConfig } from '../common/config/app-config';
import { AppError } from '../common/helpers/errors';

@Injectable()
export class HistoryService {
  constructor(private readonly historyRepository: HistoryRepository) {}

  private requestUrl(): string {
    const config = getAppConfig();
    return `${config.url}:${config.ports.back.requestBus}${config.paths.requests.request}`;
  }

  private async resolveUserId(authId: string): Promise<string> {
    const config = getAppConfig();
    const result = await axios.post(this.requestUrl(), {
      request: config.requests.user.byAuthId,
      payload: { authId },
    });
    const data = result.data?.content
      ? result.data
      : result.data?.values || result.data;
    const { error, message, status, content } = data;
    if (error || !content?.userId) {
      throw new AppError({
        message: message || 'Usuário não encontrado',
        statusCode: status || 404,
      });
    }
    return content.userId;
  }

  private async getProdutoData(productId: string): Promise<Record<
    string,
    unknown
  > | null> {
    try {
      const config = getAppConfig();
      const response = await axios.get(
        `${config.url}:${config.ports.back.catalog}${config.paths.catalog.product}`,
        { params: { id: productId }, timeout: 3000 },
      );
      const { error, content } = response.data;
      if (error || !content) return null;
      return content;
    } catch {
      return null;
    }
  }

  async registrarAcesso(body: unknown) {
    const raw = (body as { payload?: unknown })?.payload ?? body;
    const dados = (raw ?? {}) as Record<string, unknown>;
    const authId = validarCampoObrigatorio(dados.authId, 'authId');
    const productId = validarCampoObrigatorio(
      dados._id ?? dados.productId,
      'productId',
    );
    validarObjectId(productId, 'productId');

    const userId = await this.resolveUserId(authId);

    const config = getAppConfig();
    const productResult = await axios.post(this.requestUrl(), {
      request: config.requests.catalog.product.exist,
      payload: { productId },
    });
    const productData = productResult.data?.content
      ? productResult.data
      : productResult.data?.values || productResult.data;
    const {
      error: productError,
      message: productMessage,
      status: productStatus,
    } = productData;
    if (productError) {
      return erro(productStatus, productMessage);
    }

    await this.historyRepository.createEntry({ userId, productId });
    return sucessoMsg('Acesso registrado', 200);
  }

  async listar(authIdQuery: unknown) {
    const authId = validarCampoObrigatorio(authIdQuery, 'authId');
    const userId = await this.resolveUserId(String(authId));

    const registros = await this.historyRepository.getByUserId(userId);
    if (!registros || registros.length === 0) {
      return sucesso([]);
    }

    const produtos = await Promise.all(
      registros.map(async (r) => {
        const produto = await this.getProdutoData(String(r.productId));
        if (!produto) return null;
        return {
          _id: String(r.productId),
          nome: produto.nome || '',
          marca: produto.marca || '',
          imagem: produto.imagem || '',
          precoMedio: produto.precoMedio || 0,
          categoriaTag: produto.categoriaTag || '',
          acessadoEm: r.createdAt,
        };
      }),
    );

    return sucesso(produtos.filter(Boolean));
  }

  async limpar(authIdQuery: unknown) {
    const authId = validarCampoObrigatorio(authIdQuery, 'authId');
    const userId = await this.resolveUserId(String(authId));
    await this.historyRepository.clearByUserId(userId);
    return sucessoMsg('Histórico limpo', 200);
  }
}
