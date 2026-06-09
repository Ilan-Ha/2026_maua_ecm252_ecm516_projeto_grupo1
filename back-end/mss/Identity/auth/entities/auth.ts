import mongoose from "mongoose";
import { EntityInvalidParameterError } from "../../../shared/errors/entityErrors.ts";
import bcrypt from 'bcrypt'

interface AuthProps {
    email: string;
    senha_hash: string;
    usuarioCadastrado?: boolean;
}

class Auth {
    email: string;
    senha_hash: string;
    usuarioCadastrado: boolean;

    static collection: string = "auth";

    constructor(props: AuthProps) {
        this.email = props.email.trim().toLowerCase();
        this.senha_hash = props.senha_hash;
        this.usuarioCadastrado = props.usuarioCadastrado ?? false;

        this.validar();
    }

    validar(): void {
        Auth.validarEmail(this.email);
        Auth.validarSenhaHash(this.senha_hash);
        Auth.validarUsuarioCadastrado(this.usuarioCadastrado);
    }

    toObject(): AuthProps {
        return {
            email: this.email,
            senha_hash: this.senha_hash,
            usuarioCadastrado: this.usuarioCadastrado
        }
    }

    toJson(): string {
        let object = this.toObject();

        return JSON.stringify(object);
    }

    async compare_password(plain: string): Promise<boolean> {
        return bcrypt.compare(plain, this.senha_hash);
    }

    static toMongoseSchema(): mongoose.Schema {

        return new mongoose.Schema<AuthProps>(
            {
                email: {
                    type: String,
                    unique: true,
                    required: true,
                },
                senha_hash: {
                    type: String,
                    required: true,
                },
                usuarioCadastrado: {
                    type: Boolean,
                    default: false,
                },
            },
            { timestamps: true, collection: "auth" }
        );

    }

    static validarEmail(email: string): void {
        if (!email?.trim()) {
            throw new EntityInvalidParameterError("Email é obrigatório", "email");
        }
        if (email.length > 254) {
            throw new EntityInvalidParameterError("Email muito longo", "email");
        }
    }

    /** Entidade persiste hash bcrypt, não senha em texto plano */
    static validarSenhaHash(senhaHash: string): void {
        if (!senhaHash?.trim()) {
            throw new EntityInvalidParameterError("Hash de senha é obrigatório", "senha");
        }
        if (senhaHash.length !== 60) {
            throw new EntityInvalidParameterError("Hash de senha inválido", "senha");
        }
        if (!/^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(senhaHash)) {
            throw new EntityInvalidParameterError("Hash de senha inválido", "senha");
        }
    }

    static validarUsuarioCadastrado(usuarioCadastrado: boolean): void {
        if (typeof usuarioCadastrado !== "boolean") {
            throw new EntityInvalidParameterError(
                "usuarioCadastrado deve ser boolean",
                "usuarioCadastrado"
            );
        }
    }
}

export { Auth, type AuthProps };
