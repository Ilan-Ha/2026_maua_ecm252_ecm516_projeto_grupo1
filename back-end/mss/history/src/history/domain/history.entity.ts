import { EntityInvalidParameterError } from '../../common/helpers/errors';

function isValidObjectId(id: string): boolean {
  return /^[a-f\d]{24}$/i.test(id);
}

export type HistoryProps = {
  userId: string;
  productId: string;
  createdAt?: Date;
};

export class HistoryEntity {
  static readonly collection = 'history';

  userId: string;
  productId: string;
  createdAt?: Date;

  constructor(props: HistoryProps) {
    this.userId = String(props.userId).trim();
    this.productId = String(props.productId).trim();
    this.createdAt = props.createdAt;
    this.validar();
  }

  validar(): void {
    HistoryEntity.validarUserId(this.userId);
    HistoryEntity.validarProductId(this.productId);
  }

  static validarUserId(userId: unknown): void {
    const id = String(userId ?? '').trim();
    if (!id) {
      throw new EntityInvalidParameterError('userId é obrigatório', 'userId');
    }
    if (!isValidObjectId(id)) {
      throw new EntityInvalidParameterError('userId inválido', 'userId');
    }
  }

  static validarProductId(productId: unknown): void {
    const id = String(productId ?? '').trim();
    if (!id) {
      throw new EntityInvalidParameterError(
        'productId é obrigatório',
        'productId',
      );
    }
    if (!isValidObjectId(id)) {
      throw new EntityInvalidParameterError('productId inválido', 'productId');
    }
  }
}
