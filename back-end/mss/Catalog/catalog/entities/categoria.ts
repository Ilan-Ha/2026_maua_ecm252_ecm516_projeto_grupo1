import mongoose from "mongoose";
import { EntityInvalidParameterError } from "../../../shared/errors/entityErrors";

interface CategoriaProps {
    nome: string;
    tag: string;
    imagem: string;
}

class Categoria {
    nome: string;
    tag: string;
    imagem: string;
    
    // default collections para essa entidade
    static collection: string = "categorias"

    constructor(props: CategoriaProps) {
        this.nome = props.nome;
        this.tag = props.tag;
        this.imagem = props.imagem;

        this.validar();
    }

    toObject(): CategoriaProps {

        return {
            nome: this.nome,
            tag: this.tag,
            imagem: this.imagem,
        }

    } 

    toJson(): string {

        let object = this.toObject()

        return JSON.stringify(object)

    }

    static toMongoseSchema(): mongoose.Schema {

        return new mongoose.Schema<CategoriaProps>({
            nome: { type: String, required: true },
            tag: { type: String, unique: true },
            imagem: { type: String, required: true }
        })
    }

    validar(): void {
        Categoria.validarNome(this.nome);
        Categoria.validarTag(this.tag);
        Categoria.validarImagem(this.imagem);
    }

    static ehUrlHttp(valor: string): boolean {
        try {
            const url = new URL(valor);
            return url.protocol === "http:" || url.protocol === "https:";
        } catch {
            return false;
        }
    }

    static validarNome(nome: string): void {
        if (!nome?.trim()) {
            throw new EntityInvalidParameterError("Nome da categoria é obrigatório", "nome");
        }
        if (nome.trim().length > 100) {
            throw new EntityInvalidParameterError("Nome da categoria muito longo", "nome");
        }
    }

    static validarTag(tag: string): void {
        if (!tag?.trim()) {
            throw new EntityInvalidParameterError("Tag da categoria é obrigatória", "tag");
        }
        const tagNormalizada = tag.trim();
        if (tagNormalizada.length > 50) {
            throw new EntityInvalidParameterError("Tag da categoria muito longa", "tag");
        }
        if (/\s/.test(tagNormalizada)) {
            throw new EntityInvalidParameterError(
                "Tag da categoria não pode conter espaços",
                "tag"
            );
        }
    }

    static validarImagem(imagem: string): void {
        if (!imagem?.trim()) {
            throw new EntityInvalidParameterError("Imagem da categoria é obrigatória", "imagem");
        }
        if (!Categoria.ehUrlHttp(imagem.trim())) {
            throw new EntityInvalidParameterError("Imagem da categoria inválida", "imagem");
        }
    }
}

export { Categoria, type CategoriaProps };
