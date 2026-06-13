import mongoose from "mongoose";
import { EntityInvalidParameterError } from "../../../shared/errors/entityErrors.ts";

interface ReviewProps {
    produtoId: string;
    email: string;
    nome: string;
    estrelas: number;
    comentario: string;
}

class Review {
    produtoId: string;
    email: string;
    nome: string;
    estrelas: number;
    comentario: string;

    static collection: string = "reviews";

    constructor(props: ReviewProps) {
        this.produtoId = props.produtoId.trim();
        this.email = props.email.trim().toLowerCase();
        this.nome = props.nome.trim();
        this.estrelas = props.estrelas;
        this.comentario = props.comentario.trim();

        this.validar();
    }

    validar(): void {
        Review.validarProdutoId(this.produtoId);
        Review.validarEmail(this.email);
        Review.validarNome(this.nome);
        Review.validarEstrelas(this.estrelas);
        Review.validarComentario(this.comentario);
    }

    static validarProdutoId(produtoId: unknown): void {
        const id = String(produtoId ?? "").trim();
        if (!id) {
            throw new EntityInvalidParameterError("Produto inválido", "produtoId");
        }
    }

    static validarEmail(email: unknown): void {
        const emailStr = String(email ?? "").trim().toLowerCase();
        if (!emailStr) {
            throw new EntityInvalidParameterError("Email é obrigatório", "email");
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr)) {
            throw new EntityInvalidParameterError("Email inválido", "email");
        }
    }

    static validarNome(nome: unknown): void {
        const nomeStr = String(nome ?? "").trim();
        if (nomeStr.length < 2) {
            throw new EntityInvalidParameterError("Nome inválido", "nome");
        }
        if (nomeStr.length > 50) {
            throw new EntityInvalidParameterError("Nome muito longo", "nome");
        }
    }

    static validarEstrelas(estrelas: unknown): void {
        if (typeof estrelas !== "number" || Number.isNaN(estrelas)) {
            throw new EntityInvalidParameterError("Estrelas inválidas", "estrelas");
        }
        if (!Number.isInteger(estrelas) || estrelas < 1 || estrelas > 5) {
            throw new EntityInvalidParameterError("Estrelas deve ser entre 1 e 5", "estrelas");
        }
    }

    static validarComentario(comentario: unknown): void {
        const texto = String(comentario ?? "").trim();
        if (texto.length < 3) {
            throw new EntityInvalidParameterError("Comentário muito curto", "comentario");
        }
        if (texto.length > 500) {
            throw new EntityInvalidParameterError("Comentário muito longo", "comentario");
        }
    }

    static toMongoseSchema(): mongoose.Schema {
        const schema = new mongoose.Schema<ReviewProps>(
            {
                produtoId: { type: String, required: true, index: true },
                email: { type: String, required: true, trim: true, lowercase: true },
                nome: { type: String, required: true, trim: true },
                estrelas: { type: Number, required: true, min: 1, max: 5 },
                comentario: { type: String, required: true, trim: true },
            },
            { timestamps: true, collection: "reviews" }
        );

        schema.index({ produtoId: 1, email: 1 }, { unique: true });
        return schema;
    }
}

export { Review, type ReviewProps };
