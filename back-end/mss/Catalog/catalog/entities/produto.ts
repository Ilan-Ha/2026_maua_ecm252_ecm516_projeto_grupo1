import { EntityInvalidParameterError } from "../../../shared/errors/entityErrors";

interface SiteCompra {
    loja: string;
    preco: number;
    link: string;
}

interface ProdutoProps {
    nome: string;
    imagem?: string;
    categoriaTag: string;
    descricao?: string;
    precoMedio: number;
    lancamento: number;
    marca: string;
    imagens?: string[];
    especificacoes?: Record<string, unknown>;
    sitesCompra?: SiteCompra[];
}

class Produto {
    nome: string;
    imagem?: string;
    categoriaTag: string;
    descricao?: string;
    precoMedio: number;
    lancamento: number;
    marca: string;
    imagens: string[];
    especificacoes: Record<string, unknown>;
    sitesCompra: SiteCompra[];

    constructor(props: ProdutoProps) {
        this.nome = props.nome;
        this.marca = props.marca;
        this.precoMedio = props.precoMedio;
        this.lancamento = props.lancamento;
        this.imagem = props.imagem;
        this.categoriaTag = props.categoriaTag;
        this.descricao = props.descricao;
        this.imagens = props.imagens ?? [];
        this.especificacoes = props.especificacoes ?? {};
        this.sitesCompra = props.sitesCompra ?? [];

        this.validar();
    }

    validar(): void {
        Produto.validarNome(this.nome);
        Produto.validarMarca(this.marca);
        Produto.validarCategoriaTag(this.categoriaTag);
        Produto.validarPrecoMedio(this.precoMedio);
        Produto.validarLancamento(this.lancamento);
        Produto.validarDescricao(this.descricao);
        Produto.validarImagem(this.imagem);
        Produto.validarImagens(this.imagens);
        Produto.validarEspecificacoes(this.especificacoes);
        Produto.validarSitesCompra(this.sitesCompra);
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
            throw new EntityInvalidParameterError("Nome é obrigatório", "nome", "OBRIGATORIO");
        }
        if (nome.trim().length > 200) {
            throw new EntityInvalidParameterError("Nome muito longo", "nome", "MUITO_LONGO");
        }
    }

    static validarMarca(marca: string): void {
        if (!marca?.trim()) {
            throw new EntityInvalidParameterError("Marca é obrigatória", "marca", "OBRIGATORIO");
        }
        if (marca.trim().length > 100) {
            throw new EntityInvalidParameterError("Marca muito longa", "marca", "MUITO_LONGO");
        }
    }

    static validarCategoriaTag(categoriaTag: string): void {
        if (!categoriaTag?.trim()) {
            throw new EntityInvalidParameterError("Categoria é obrigatória", "categoriaTag", "OBRIGATORIO");
        }
    }

    static validarPrecoMedio(precoMedio: number): void {
        if (typeof precoMedio !== "number" || Number.isNaN(precoMedio)) {
            throw new EntityInvalidParameterError("Preço médio inválido", "precoMedio", "INVALIDO");
        }
        if (precoMedio < 0) {
            throw new EntityInvalidParameterError(
                "Preço médio não pode ser negativo",
                "precoMedio",
                "NEGATIVO"
            );
        }
    }

    static validarLancamento(lancamento: number): void {
        if (typeof lancamento !== "number" || Number.isNaN(lancamento)) {
            throw new EntityInvalidParameterError("Lançamento inválido", "lancamento", "INVALIDO");
        }
        const anoAtual = new Date().getFullYear();
        if (lancamento < 1900 || lancamento > anoAtual + 1) {
            throw new EntityInvalidParameterError(
                "Ano de lançamento inválido",
                "lancamento",
                "ANO_INVALIDO"
            );
        }
    }

    static validarDescricao(descricao?: string): void {
        if (descricao != null && descricao.length > 5000) {
            throw new EntityInvalidParameterError("Descrição muito longa", "descricao", "MUITO_LONGO");
        }
    }

    static validarImagem(imagem?: string): void {
        if (imagem != null && imagem !== "" && !Produto.ehUrlHttp(imagem)) {
            throw new EntityInvalidParameterError("Imagem principal inválida", "imagem", "URL_INVALIDA");
        }
    }

    static validarImagens(imagens: string[]): void {
        for (const url of imagens) {
            if (!Produto.ehUrlHttp(url)) {
                throw new EntityInvalidParameterError("URL de imagem inválida", "imagens", "URL_INVALIDA");
            }
        }
    }

    static validarEspecificacoes(especificacoes: Record<string, unknown>): void {
        for (const [chave, valor] of Object.entries(especificacoes)) {
            if (!chave.trim()) {
                throw new EntityInvalidParameterError(
                    "Chave de especificação inválida",
                    "especificacoes",
                    "CHAVE_INVALIDA"
                );
            }
            const tipo = typeof valor;
            if (valor != null && tipo !== "string" && tipo !== "number" && tipo !== "boolean") {
                throw new EntityInvalidParameterError(
                    `Especificação "${chave}" com valor inválido`,
                    `especificacoes.${chave}`,
                    "VALOR_INVALIDO"
                );
            }
        }
    }

    static validarSiteCompra(site: SiteCompra): void {
        if (!site.loja?.trim()) {
            throw new EntityInvalidParameterError(
                "Loja do site de compra é obrigatória",
                "sitesCompra.loja",
                "OBRIGATORIO"
            );
        }
        if (typeof site.preco !== "number" || Number.isNaN(site.preco) || site.preco < 0) {
            throw new EntityInvalidParameterError(
                "Preço do site de compra inválido",
                "sitesCompra.preco",
                "INVALIDO"
            );
        }
        if (!site.link?.trim() || !Produto.ehUrlHttp(site.link)) {
            throw new EntityInvalidParameterError(
                "Link do site de compra inválido",
                "sitesCompra.link",
                "URL_INVALIDA"
            );
        }
    }

    static validarSitesCompra(sitesCompra: SiteCompra[]): void {
        for (const site of sitesCompra) {
            Produto.validarSiteCompra(site);
        }
    }
}

export { Produto, type ProdutoProps, type SiteCompra };
