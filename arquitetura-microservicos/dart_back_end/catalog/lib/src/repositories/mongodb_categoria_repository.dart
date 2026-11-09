import 'package:mongo_dart/mongo_dart.dart';
import 'package:mongo_pool/mongo_pool.dart';

import 'categoria_repository.dart';
import '../models/categoria.dart';

class MongodbCategoriaRepository implements CategoriaRepository {
  final MongoDbPoolService _pool;

  MongodbCategoriaRepository(this._pool);

  Categoria _mapear(ResultSetRow linha) {
    final dados = linha.assoc().cast<String, String?>();
    return Categoria(
      id: dados['_id'],
      nome: dados['nome'],
      tag: dados['tag'],
      imagem: dados['imagem'],

    );
  }
}
