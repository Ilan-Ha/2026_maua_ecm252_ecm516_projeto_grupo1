import mongoose from "mongoose";
import { Review } from "../entities/review.ts";
import { wrapDbOperation } from "../../../shared/errors/index.ts";

const reviewSchema = Review.toMongoseSchema();
const reviewModel = mongoose.models.Review || mongoose.model("Review", reviewSchema);
const COLLECTION = Review.collection;

export async function getReviewStatsByProduto(produtoId: string) {
    return wrapDbOperation("aggregate", COLLECTION, async () => {
        const [stats] = await reviewModel.aggregate([
            { $match: { produtoId } },
            {
                $group: {
                    _id: null,
                    mediaEstrelas: { $avg: "$estrelas" },
                    total: { $sum: 1 },
                },
            },
        ]);
        return stats;
    });
}

export async function findReviewsByProduto(produtoId: string) {
    return wrapDbOperation("find", COLLECTION, () =>
        reviewModel.find({ produtoId }).sort({ createdAt: -1 }).lean()
    );
}

export async function upsertReview(data: {
    produtoId: string;
    email: string;
    nome: string;
    estrelas: number;
    comentario: string;
}) {
    new Review(data);
    return wrapDbOperation("upsert", COLLECTION, () =>
        reviewModel.findOneAndUpdate(
            { produtoId: data.produtoId, email: data.email },
            data,
            { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
        )
    );
}
