import mongoose from "mongoose";
import { EntityInvalidParameterError } from "../../../shared/errors/entityErrors.ts";

interface UserProps {
    authId: mongoose.Types.ObjectId | string;
    nome: string;
}

class User {
    authId: mongoose.Types.ObjectId | string;
    nome: string;

    static collection: string = "user";

    constructor(props: UserProps) {
        this.authId = props.authId;
        this.nome = props.nome.trim();

        this.validar();
    }

    validar(): void {
        User.validarAuthId(this.authId);
        User.validarNome(this.nome);
    }

    static validarAuthId(authId: unknown): void {
        const id = String(authId ?? "").trim();
        if (!id) {
            throw new EntityInvalidParameterError("authId é obrigatório", "authId");
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new EntityInvalidParameterError("authId inválido", "authId");
        }
    }

    static validarNome(nome: unknown): void {
        const nomeStr = String(nome ?? "").trim();
        if (!nomeStr) {
            throw new EntityInvalidParameterError("Nome é obrigatório", "nome");
        }
        if (nomeStr.length < 2) {
            throw new EntityInvalidParameterError("Mínimo de 2 caracteres", "nome");
        }
        if (nomeStr.length > 50) {
            throw new EntityInvalidParameterError("Máximo de 50 caracteres", "nome");
        }
        if (!/^[\p{L}\s'-]+$/u.test(nomeStr)) {
            throw new EntityInvalidParameterError("Nome contém caracteres inválidos", "nome");
        }
    }

    static toMongoseSchema(): mongoose.Schema {
        return new mongoose.Schema<UserProps>(
            {
                authId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    unique: true,
                },
                nome: {
                    type: String,
                    unique: true,
                    required: true,
                },
            },
            { timestamps: true, collection: "user" }
        );
    }
}

export { User, type UserProps };
