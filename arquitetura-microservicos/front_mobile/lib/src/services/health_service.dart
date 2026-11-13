import '../config/api_config.dart';
import 'api_client.dart';

class HealthStatus {
  const HealthStatus({required this.backend, required this.db});

  final bool backend;
  final bool db;
}

class HealthService {
  HealthService(this._api);

  final ApiClient _api;

  Future<HealthStatus> check() async {
    try {
      final health = await _api.get(pathHealth);
      final db = await _api.get(pathHealthDb);
      final backendOk = health is Map && health['backend'] == true;
      final dbOk = db is Map && db['db'] == true;
      return HealthStatus(backend: backendOk, db: dbOk);
    } catch (_) {
      return const HealthStatus(backend: false, db: false);
    }
  }
}
