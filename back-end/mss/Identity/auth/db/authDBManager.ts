import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { Auth } from "../entities/auth.ts";
import { wrapDbOperation } from "../../../shared/errors/index.ts";

const authSchema = Auth.toMongoseSchema();
const COLLECTION = Auth.collection;

authSchema.pre("save", async function () {
    if (!this.isModified("senha_hash")) return;

    const atual = this.senha_hash as string;

    if (/^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(atual)) return;

    this.senha_hash = await bcrypt.hash(atual, 10);
});

const authModel = mongoose.models.Auth || mongoose.model("Auth", authSchema);

export async function findAuthByEmail(email: string) {
    return wrapDbOperation("findOne", COLLECTION, () =>
        authModel.findOne({ email: email.trim().toLowerCase() })
    );
}

export async function findAuthById(authId: string) {
    return wrapDbOperation("findById", COLLECTION, () => authModel.findById(authId));
}

export async function createAuth(data: { email: string; senha: string }) {
    return wrapDbOperation("create", COLLECTION, () =>
        authModel.create({
            email: data.email.trim().toLowerCase(),
            senha_hash: data.senha,
        })
    );
}

export async function updateSenhaByEmail(email: string, senha: string) {
    return wrapDbOperation("update", COLLECTION, async () => {
        const usuario = await authModel.findOne({ email });
        if (!usuario) return null;

        usuario.senha_hash = senha;
        await usuario.save();
        return usuario;
    });
}

export async function markUsuarioCadastrado(authId: string) {
    return wrapDbOperation("update", COLLECTION, async () => {
        const auth = await authModel.findById(authId);
        if (!auth) return null;

        auth.usuarioCadastrado = true;
        await auth.save();
        return auth;
    });
}
