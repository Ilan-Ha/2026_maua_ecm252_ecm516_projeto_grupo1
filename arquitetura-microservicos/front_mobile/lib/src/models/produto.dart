class SiteCompra {
  const SiteCompra({
    required this.loja,
    required this.preco,
    required this.link,
  });

  final String loja;
  final double preco;
  final String link;

  factory SiteCompra.fromJson(Map<String, dynamic> json) {
    return SiteCompra(
      loja: '${json['loja'] ?? ''}',
      preco: (json['preco'] as num?)?.toDouble() ?? 0,
      link: '${json['link'] ?? ''}',
    );
  }
}

class Produto {
  const Produto({
    required this.id,
    required this.nome,
    required this.imagem,
    required this.categoriaTag,
    required this.descricao,
    required this.precoMedio,
    required this.lancamento,
    required this.marca,
    required this.imagens,
    required this.especificacoes,
    required this.sitesCompra,
  });

  final String id;
  final String nome;
  final String imagem;
  final String categoriaTag;
  final String descricao;
  final double precoMedio;
  final int lancamento;
  final String marca;
  final List<String> imagens;
  final Map<String, dynamic> especificacoes;
  final List<SiteCompra> sitesCompra;

  factory Produto.fromJson(Map<String, dynamic> json) {
    final specs = json['especificacoes'];
    final sites = json['sitesCompra'];
    final imgs = json['imagens'];
    return Produto(
      id: '${json['_id'] ?? ''}',
      nome: '${json['nome'] ?? ''}',
      imagem: '${json['imagem'] ?? ''}',
      categoriaTag: '${json['categoriaTag'] ?? ''}',
      descricao: '${json['descricao'] ?? ''}',
      precoMedio: (json['precoMedio'] as num?)?.toDouble() ?? 0,
      lancamento: (json['lancamento'] as num?)?.toInt() ?? 0,
      marca: '${json['marca'] ?? ''}',
      imagens: imgs is List ? imgs.map((e) => '$e').toList() : const [],
      especificacoes: specs is Map
          ? specs.map((k, v) => MapEntry('$k', v))
          : const {},
      sitesCompra: sites is List
          ? sites
              .whereType<Map>()
              .map((e) => SiteCompra.fromJson(Map<String, dynamic>.from(e)))
              .toList()
          : const [],
    );
  }

  Map<String, dynamic> toHistoryJson() => {
        '_id': id,
        'nome': nome,
        'marca': marca,
        'imagem': imagem,
        'precoMedio': precoMedio,
        'categoriaTag': categoriaTag,
        'acessadoEm': DateTime.now().toIso8601String(),
      };
}
