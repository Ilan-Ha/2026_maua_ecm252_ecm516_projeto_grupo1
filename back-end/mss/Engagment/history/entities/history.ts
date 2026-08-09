import mongoose from "mongoose";
import { EntityInvalidParameterError } from "../../../shared/errors/entityErrors.ts";

interface HistoryProps {
    userId: mongoose.Types.ObjectId | string;
    productId: mongoose.Types.ObjectId | string;
    createdAt?: Date;
}

class History {
    userId: mongoose.Types.ObjectId | string;
    productId: mongoose.Types.ObjectId | string;
    createdAt?: Date;

    static collection: string = "history";

    constructor(props: HistoryProps) {
        this.userId = props.userId;
        this.productId = props.productId;
        this.createdAt = props.createdAt;

        this.validar();
    }

    validar(): void {
        History.validarUserId(this.userId);
        History.validarProductId(this.productId);
    }

    static validarUserId(userId: unknown): void {
        const id = String(userId ?? "").trim();
        if (!id) {
            throw new EntityInvalidParameterError("userId é obrigatório", "userId");
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new EntityInvalidParameterError("userId inválido", "userId");
        }
    }

    static validarProductId(productId: unknown): void {
        const id = String(productId ?? "").trim();
        if (!id) {
            throw new EntityInvalidParameterError("productId é obrigatório", "productId");
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new EntityInvalidParameterError("productId inválido", "productId");
        }
    }

    static toMongoseSchema(): mongoose.Schema {
        const schema = new mongoose.Schema<HistoryProps>(
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                },
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
            { collection: "history" }
        );

        schema.index({ userId: 1, productId: 1 }, { unique: true });
        return schema;
    }
}

export { History, type HistoryProps };
