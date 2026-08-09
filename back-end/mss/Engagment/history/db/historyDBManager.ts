import mongoose from "mongoose";
import { History } from "../entities/history.ts";
import { wrapDbOperation } from "../../../shared/errors/index.ts";

const historySchema = History.toMongoseSchema();
const historyModel = mongoose.models.History || mongoose.model("History", historySchema);
const COLLECTION = History.collection;

export async function createHistoryEntry(data: { userId: string; productId: string }) {
    new History({ userId: data.userId, productId: data.productId });
    return wrapDbOperation("create", COLLECTION, () =>
        historyModel.findOneAndUpdate(
            { userId: data.userId, productId: data.productId },
            { $set: { userId: data.userId, productId: data.productId }, $currentDate: { createdAt: true } },
            { upsert: true, new: true }
        )
    );
}

export async function getHistoryByUserId(userId: string): Promise<{ productId: string; createdAt: Date }[]> {
    return wrapDbOperation("find", COLLECTION, () =>
        historyModel
            .find({ userId })
            .sort({ createdAt: -1 })
            .limit(50)
            .select("productId createdAt")
            .lean()
    );
}

export async function clearHistoryByUserId(userId: string) {
    return wrapDbOperation("delete", COLLECTION, () =>
        historyModel.deleteMany({ userId })
    );
}
