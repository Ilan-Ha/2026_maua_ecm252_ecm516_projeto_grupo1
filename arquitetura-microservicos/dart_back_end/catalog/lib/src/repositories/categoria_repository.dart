import '../models/categoria.dart';

class FiltroCategoria {
  final String? nome;

  const FiltroCategoria({this.nome});
}

class Pagina<T> {
  final List<T> itens;
  const Pagina({required this.itens});
}

abstract interface class CategoriaRepository {
  Future<Pagina<Categoria>> listar(FiltroCategoria filtro);
  Future<Categoria?> buscarPorNome(String nome);
}
