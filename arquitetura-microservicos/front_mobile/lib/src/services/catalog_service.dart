import '../config/api_config.dart';
import '../models/catalogo.dart';
import '../models/produto.dart';
import 'api_client.dart';

class CatalogService {
  CatalogService(this._api);

  final ApiClient _api;

  Future<Catalogo> getCatalogo() async {
    final data = await _api.get(pathCatalog);
    if (data is! Map) {
      throw ApiException('Resposta inválida do catálogo');
    }
    return Catalogo.fromJson(Map<String, dynamic>.from(data));
  }

  Future<Produto> getProduto(String id) async {
    final data = await _api.get('$pathProduct/$id');
    if (data is! Map) {
      throw ApiException('Produto não encontrado');
    }
    return Produto.fromJson(Map<String, dynamic>.from(data));
  }
}
