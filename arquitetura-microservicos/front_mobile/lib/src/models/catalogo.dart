import 'categoria.dart';
import 'produto.dart';

class Catalogo {
  const Catalogo({required this.categorias, required this.itens});

  final List<Categoria> categorias;
  final Map<String, List<Produto>> itens;

  factory Catalogo.fromJson(Map<String, dynamic> json) {
    final cats = (json['Categorias'] as List? ?? [])
        .whereType<Map>()
        .map((e) => Categoria.fromJson(Map<String, dynamic>.from(e)))
        .toList();

    final rawItens = json['Itens'];
    final itens = <String, List<Produto>>{};
    if (rawItens is Map) {
      rawItens.forEach((key, value) {
        final list = value is List
            ? value
                .whereType<Map>()
                .map((e) => Produto.fromJson(Map<String, dynamic>.from(e)))
                .toList()
            : <Produto>[];
        itens['$key'] = list;
      });
    }
    return Catalogo(categorias: cats, itens: itens);
  }
}
