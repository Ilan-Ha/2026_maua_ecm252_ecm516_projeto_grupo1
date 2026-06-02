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

    constructor(props: CategoriaProps) {
        this.nome = props.nome;
        this.tag = props.tag;
        this.imagem = props.imagem;

        this.validar();
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
            throw new EntityInvalidParameterError(
                "Nome da categoria é obrigatório",
                "nome",
                "OBRIGATORIO"
            );
        }
        if (nome.trim().length > 100) {
            throw new EntityInvalidParameterError(
                "Nome da categoria muito longo",
                "nome",
                "MUITO_LONGO"
            );
        }
    }

    static validarTag(tag: string): void {
        if (!tag?.trim()) {
            throw new EntityInvalidParameterError(
                "Tag da categoria é obrigatória",
                "tag",
                "OBRIGATORIO"
            );
        }
        const tagNormalizada = tag.trim();
        if (tagNormalizada.length > 50) {
            throw new EntityInvalidParameterError(
                "Tag da categoria muito longa",
                "tag",
                "MUITO_LONGO"
            );
        }
        if (/\s/.test(tagNormalizada)) {
            throw new EntityInvalidParameterError(
                "Tag da categoria não pode conter espaços",
                "tag",
                "FORMATO_INVALIDO"
            );
        }
    }

    static validarImagem(imagem: string): void {
        if (!imagem?.trim()) {
            throw new EntityInvalidParameterError(
                "Imagem da categoria é obrigatória",
                "imagem",
                "OBRIGATORIO"
            );
        }
        if (!Categoria.ehUrlHttp(imagem.trim())) {
            throw new EntityInvalidParameterError(
                "Imagem da categoria inválida",
                "imagem",
                "URL_INVALIDA"
            );
        }
    }
}

export { Categoria, type CategoriaProps };
