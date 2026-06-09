import mongoose from "mongoose";
import { History } from "../entities/history.ts";
import { wrapDbOperation } from "../../../shared/errors/index.ts";

const historySchema = History.toMongoseSchema();
const historyModel = mongoose.models.History || mongoose.model("History", historySchema);
const COLLECTION = History.collection;

export async function createHistoryEntry(data: { userId: string; productId: string }) {
    new History({ userId: data.userId, productId: data.productId });
    return wrapDbOperation("create", COLLECTION, () =>
        historyModel.create({
            userId: data.userId,
            productId: data.productId,
        })
    );
}
