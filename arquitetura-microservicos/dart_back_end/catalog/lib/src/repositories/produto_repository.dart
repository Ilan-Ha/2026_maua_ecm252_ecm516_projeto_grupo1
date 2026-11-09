import '../models/produto.dart';

class FiltroProduto {
  final String? nome;
  final String? tag;
  final Map<String, dynamic>? especificacoes;
  final int? lancamento;
  final String? marca;
  final double? precoMedio;
  final double? avaliacao;
  final String? slug;
  final int pagina;
  final int tamanhoPagina;

  const FiltroProduto({
    this.nome,
    this.tag,
    this.especificacoes,
    this.lancamento,
    this.marca,
    this.precoMedio,
    this.avaliacao,
    this.slug,
    this.pagina = 1,
    this.tamanhoPagina = 10,
  });

  int get deslocamento => (pagina - 1) * tamanhoPagina;
}

class Pagina<T> {
  const Pagina({
    required this.itens,
    required this.total,
    required this.pagina,
    required this.tamanhoPagina,
  });

  final List<T> itens;
  final int total;
  final int pagina;
  final int tamanhoPagina;

  int get totalPaginas => total == 0 ? 1 : (total / tamanhoPagina).ceil();
  bool get temProxima => pagina < totalPaginas;
  bool get temAnterior => pagina > 1;
}

abstract interface class ProdutoRepository {
  Future<Pagina<Produto>> listar(FiltroProduto filtro);
  Future<Produto?> buscarPorNome(String nome);
  Future<Produto?> buscarPorTag(String tag);
  Future<Produto?> buscarPorEspecificacoes(Map<String, dynamic> esp);
  Future<Produto?> buscarPorLancamento(int data);
  Future<Produto?> buscarPorMarca(String marca);
  Future<Produto?> buscarPorPrecoMedio(double preco);
  Future<Produto?> buscarPorAvaliacao(double nota);
  Future<Produto?> buscarPorSlug(String slug);
}
