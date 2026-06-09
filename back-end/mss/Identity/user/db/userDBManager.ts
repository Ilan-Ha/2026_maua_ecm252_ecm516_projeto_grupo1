import mongoose from "mongoose";
import { User } from "../entities/user.ts";
import { wrapDbOperation } from "../../../shared/errors/index.ts";

const userSchema = User.toMongoseSchema();
const userModel = mongoose.models.User || mongoose.model("User", userSchema);
const COLLECTION = User.collection;

export async function createUser(data: { authId: string; nome: string }) {
    new User({ authId: data.authId, nome: data.nome });
    return wrapDbOperation("create", COLLECTION, () =>
        userModel.create({
            authId: data.authId,
            nome: data.nome.trim(),
        })
    );
}

export function existsByAuthId(authId: string) {
    return wrapDbOperation("exists", COLLECTION, () => userModel.exists({ authId }));
}

export function existsByNome(nome: string) {
    return wrapDbOperation("exists", COLLECTION, () => userModel.exists({ nome }));
}

export async function findUserByNome(nome: string) {
    return wrapDbOperation("findOne", COLLECTION, () => userModel.findOne({ nome }));
}

export async function findUserByAuthId(authId: string) {
    return wrapDbOperation("findOne", COLLECTION, () => userModel.findOne({ authId }));
}

export async function findUser(userId: string) {
    return wrapDbOperation("findById", COLLECTION, () => userModel.findById(userId));
}
