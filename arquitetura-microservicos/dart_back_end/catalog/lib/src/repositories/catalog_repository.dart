import 'dart:io';

import 'package:mongo_dart/mongo_dart.dart';

import '../mongo/json_utils.dart';

class CatalogRepository {
  CatalogRepository({
    required this.mongoUri,
    required this.dbName,
  });

  final String mongoUri;
  final String dbName;
  Db? _db;

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

  Future<Db> _connection({bool force = false}) async {
    if (!force && _db != null && _db!.isConnected) {
      return _db!;
    }
    try {
      await _db?.close();
    } catch (_) {}

    final db = Db(mongoUri);
    db.databaseName = dbName;
    await db.open();
    _db = db;
    return db;
  }

  Future<T> _withDb<T>(Future<T> Function(Db db) action) async {
    try {
      final db = await _connection();
      return await action(db);
    } catch (e) {
      stderr.writeln('[catalog] Mongo falhou, tentando reconectar: $e');
      final db = await _connection(force: true);
      return await action(db);
    }
  }

  Future<void> ensureSeed() async {
    await _withDb((db) async {
      final categorias = db.collection('categorias');
      for (final cat in _seedCategorias) {
        final existing =
            await categorias.findOne(where.eq('tag', cat['tag']));
        if (existing == null) {
          await categorias.insertOne(Map<String, dynamic>.from(cat));
        }
      }
    });
  }

  Future<Map<String, dynamic>> getCatalogo() async {
    return _withDb((db) async {
      final categorias = await db.collection('categorias').find().toList();
      final produtos = await db.collection('produtos').find().toList();

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
    });
  }

  Future<Map<String, dynamic>?> getProdutoById(String id) async {
    return _withDb((db) async {
      final objectId = ObjectId.fromHexString(id);
      final prod =
          await db.collection('produtos').findOne(where.id(objectId));
      return prod == null ? null : docToJson(prod);
    });
  }

  Future<bool> isConnected() async {
    try {
      await _withDb((db) async {
        await db.collection('categorias').find(where.limit(1)).toList();
      });
      return true;
    } catch (e) {
      stderr.writeln('[catalog] health/db falhou: $e');
      return false;
    }
  }

  Future<void> close() async {
    try {
      await _db?.close();
    } catch (_) {}
    _db = null;
  }
}
