import '../config/api_config.dart';
import '../models/usuario.dart';
import 'api_client.dart';

class AuthService {
  AuthService(this._api);

  final ApiClient _api;

  Future<String> register({
    required String nome,
    required String email,
    required String senha,
    required String confirmarSenha,
  }) async {
    final data = await _api.post(pathRegister, {
      'nome': nome,
      'email': email,
      'senha': senha,
      'confirmarSenha': confirmarSenha,
    });
    if (data is Map && data['message'] is String) {
      return data['message'] as String;
    }
    return 'Usuário cadastrado';
  }

  Future<Usuario> login({
    required String email,
    required String senha,
  }) async {
    final data = await _api.post(pathLogin, {
      'email': email,
      'senha': senha,
    });
    if (data is! Map) throw ApiException('Resposta inválida no login');
    final usuario = data['usuario'] ?? data['content']?['usuario'];
    if (usuario is! Map) throw ApiException('Usuário não retornado');
    return Usuario.fromJson(Map<String, dynamic>.from(usuario));
  }

  Future<Usuario> updateProfile({
    required String email,
    required String nome,
    String? senha,
  }) async {
    final body = <String, dynamic>{'email': email, 'nome': nome};
    if (senha != null && senha.isNotEmpty) body['senha'] = senha;
    final data = await _api.put(pathProfile, body);
    if (data is Map && data['usuario'] is Map) {
      return Usuario.fromJson(Map<String, dynamic>.from(data['usuario'] as Map));
    }
    return Usuario(nome: nome, email: email);
  }
}
