import { EntityInvalidParameterError } from '../../common/helpers/errors';

export type ProdutoProps = {
  nome: string;
  imagem?: string;
  categoriaTag: string;
  descricao?: string;
  lancamento: number;
  marca: string;
  imagens?: string[];
  especificacoes?: Record<string, unknown>;
};

export class ProdutoEntity {
  static readonly collection = 'produtos';

  nome: string;
  imagem?: string;
  categoriaTag: string;
  descricao?: string;
  lancamento: number;
  marca: string;
  imagens: string[];
  especificacoes: Record<string, unknown>;

  constructor(props: ProdutoProps) {
    this.nome = props.nome;
    this.marca = props.marca;
    this.lancamento = props.lancamento;
    this.imagem = props.imagem;
    this.categoriaTag = props.categoriaTag;
    this.descricao = props.descricao;
    this.imagens = props.imagens ?? [];
    this.especificacoes = props.especificacoes ?? {};
    this.validar();
  }

  toObject(): ProdutoProps {
    return {
      nome: this.nome,
      imagem: this.imagem,
      categoriaTag: this.categoriaTag,
      descricao: this.descricao,
      lancamento: this.lancamento,
      marca: this.marca,
      imagens: this.imagens,
      especificacoes: this.especificacoes,
    };
  }

  validar(): void {
    ProdutoEntity.validarNome(this.nome);
    ProdutoEntity.validarMarca(this.marca);
    ProdutoEntity.validarCategoriaTag(this.categoriaTag);
    ProdutoEntity.validarLancamento(this.lancamento);
    ProdutoEntity.validarDescricao(this.descricao);
    ProdutoEntity.validarImagem(this.imagem);
    ProdutoEntity.validarImagens(this.imagens);
    ProdutoEntity.validarEspecificacoes(this.especificacoes);
  }

  static ehUrlHttp(valor: string): boolean {
    try {
      const url = new URL(valor);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }

  static validarNome(nome: string): void {
    if (!nome?.trim()) {
      throw new EntityInvalidParameterError('Nome é obrigatório', 'nome');
    }
    if (nome.trim().length > 200) {
      throw new EntityInvalidParameterError('Nome muito longo', 'nome');
    }
  }

  static validarMarca(marca: string): void {
    if (!marca?.trim()) {
      throw new EntityInvalidParameterError('Marca é obrigatória', 'marca');
    }
    if (marca.trim().length > 100) {
      throw new EntityInvalidParameterError('Marca muito longa', 'marca');
    }
  }

  static validarCategoriaTag(categoriaTag: string): void {
    if (!categoriaTag?.trim()) {
      throw new EntityInvalidParameterError(
        'Categoria é obrigatória',
        'categoriaTag',
      );
    }
  }

  static validarLancamento(lancamento: number): void {
    if (typeof lancamento !== 'number' || Number.isNaN(lancamento)) {
      throw new EntityInvalidParameterError(
        'Lançamento inválido',
        'lancamento',
      );
    }
    const anoAtual = new Date().getFullYear();
    if (lancamento < 1900 || lancamento > anoAtual + 1) {
      throw new EntityInvalidParameterError(
        'Ano de lançamento inválido',
        'lancamento',
      );
    }
  }

  static validarDescricao(descricao?: string): void {
    if (descricao != null && descricao.length > 5000) {
      throw new EntityInvalidParameterError(
        'Descrição muito longa',
        'descricao',
      );
    }
  }

  static validarImagem(imagem?: string): void {
    if (imagem != null && imagem !== '' && !ProdutoEntity.ehUrlHttp(imagem)) {
      throw new EntityInvalidParameterError(
        'Imagem principal inválida',
        'imagem',
      );
    }
  }

  static validarImagens(imagens: string[]): void {
    for (const url of imagens) {
      if (!ProdutoEntity.ehUrlHttp(url)) {
        throw new EntityInvalidParameterError(
          'URL de imagem inválida',
          'imagens',
        );
      }
    }
  }

  static validarEspecificacoes(
    especificacoes: Record<string, unknown>,
  ): void {
    for (const [chave, valor] of Object.entries(especificacoes)) {
      if (!chave.trim()) {
        throw new EntityInvalidParameterError(
          'Chave de especificação inválida',
          'especificacoes',
        );
      }
      const tipo = typeof valor;
      if (
        valor != null &&
        tipo !== 'string' &&
        tipo !== 'number' &&
        tipo !== 'boolean'
      ) {
        throw new EntityInvalidParameterError(
          `Especificação "${chave}" com valor inválido`,
          `especificacoes.${chave}`,
        );
      }
    }
  }
}
