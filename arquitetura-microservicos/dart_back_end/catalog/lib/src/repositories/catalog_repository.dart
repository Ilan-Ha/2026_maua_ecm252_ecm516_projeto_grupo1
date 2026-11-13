import 'package:mongo_dart/mongo_dart.dart';

import '../mongo/json_utils.dart';

class CatalogRepository {
  CatalogRepository(this._db);

  final Db _db;

  DbCollection get _categorias => _db.collection('categorias');
  DbCollection get _produtos => _db.collection('produtos');

  static const _seedCategorias = [
    {
      'nome': 'Celulares',
      'tag': 'Celular',
      'imagem':
          'https://static.vecteezy.com/system/resources/previews/000/576/831/original/smartphone-icon-vector-illustration.jpg',
    },
    {
      'nome': 'Placas de Vídeo',
      'tag': 'GPU',
      'imagem':
          'https://tse1.mm.bing.net/th/id/OIP.HMW3NgXewMev1TjuoaKQuAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
    },
    {
      'nome': 'Geladeiras',
      'tag': 'Geladeira',
      'imagem':
          'https://img.freepik.com/vetores-premium/vetor-de-icone-de-geladeira-em-design-moderno_777568-2353.jpg',
    },
    {
      'nome': 'Bicicletas',
      'tag': 'Bike',
      'imagem':
          'https://th.bing.com/th/id/R.001d09dd02871412d7a578e3331f4084?rik=4HmPB4l%2fmd5JKw&pid=ImgRaw&r=0',
    },
  ];

  Future<void> ensureSeed() async {
    for (final cat in _seedCategorias) {
      final existing = await _categorias.findOne(where.eq('tag', cat['tag']));
      if (existing == null) {
        await _categorias.insertOne(Map<String, dynamic>.from(cat));
      }
    }
  }

  Future<Map<String, dynamic>> getCatalogo() async {
    final categorias = await _categorias.find().toList();
    final produtos = await _produtos.find().toList();

    final itens = <String, List<Map<String, dynamic>>>{};
    for (final cat in categorias) {
      final tag = (cat['tag'] as String?)?.trim() ?? '';
      if (tag.isNotEmpty) itens[tag] = [];
    }

    for (final prod in produtos) {
      final key = (prod['categoriaTag'] as String?)?.trim();
      if (key == null || key.isEmpty) continue;
      itens.putIfAbsent(key, () => []);
      itens[key]!.add(docToJson(prod));
    }

    return {
      'Categorias': categorias.map(docToJson).toList(),
      'Itens': itens,
    };
  }

  Future<Map<String, dynamic>?> getProdutoById(String id) async {
    ObjectId objectId;
    try {
      objectId = ObjectId.fromHexString(id);
    } catch (_) {
      rethrow;
    }
    final prod = await _produtos.findOne(where.id(objectId));
    return prod == null ? null : docToJson(prod);
  }

  Future<bool> isConnected() async {
    try {
      await _db.collection('categorias').find(where.limit(1)).toList();
      return true;
    } catch (_) {
      return false;
    }
  }
}
