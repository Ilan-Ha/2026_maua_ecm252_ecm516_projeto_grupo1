import 'dart:convert';
import 'dart:io';

import 'package:dotenv/dotenv.dart';

class AppConfig {
  AppConfig({
    required this.mongoUri,
    required this.port,
    required this.dbName,
    required this.k8sBaseUrl,
    required this.catalogHost,
    required this.eventBusHost,
    required this.eventBusPort,
    required this.paths,
    required this.requests,
  });

  final String mongoUri;
  final int port;
  final String dbName;
  final String k8sBaseUrl;
  final String catalogHost;
  final String eventBusHost;
  final int eventBusPort;
  final Map<String, dynamic> paths;
  final Map<String, dynamic> requests;

  String get eventBusEventUrl =>
      '$k8sBaseUrl$eventBusHost:$eventBusPort${_path(['events', 'event'])}';

  String get eventBusSubscribeUrl =>
      '$k8sBaseUrl$eventBusHost:$eventBusPort${_path(['events', 'subscribe'])}';

  String get eventBusUnsubscribeUrl =>
      '$k8sBaseUrl$eventBusHost:$eventBusPort${_path(['events', 'unsubscribe'])}';

  String get callbackUrl =>
      '$k8sBaseUrl$catalogHost:$port${_path(['events', 'event'])}';

  String get catalogPath => _path(['catalog', 'catalog']);
  String get productPath => _path(['catalog', 'product']);
  String get eventsPath => _path(['events', 'event']);
  String get requestsPath => _path(['requests', 'request']);
  String get productExistRequest =>
      requests['catalog']?['product']?['exist'] as String? ??
      'catalog.product.exist';

  String _path(List<String> keys) {
    dynamic cur = paths;
    for (final key in keys) {
      cur = cur is Map ? cur[key] : null;
    }
    return cur is String ? cur : '/';
  }

  static Future<AppConfig> load() async {
    final env = DotEnv(includePlatformEnvironment: true)..load();
    final mongoUri = env['MONGO_URI'] ?? Platform.environment['MONGO_URI'];
    if (mongoUri == null || mongoUri.isEmpty) {
      throw StateError('MONGO_URI não definida no ambiente/.env');
    }

    final shared = await _loadSharedConfig();
    final ports = shared['ports']?['back'] as Map<String, dynamic>? ?? {};
    final k8s = shared['k8s'] as Map<String, dynamic>? ?? {};
    final clusterIp =
        (k8s['services'] as Map?)?['clusterIP'] as Map<String, dynamic>? ?? {};

    final port = int.tryParse(env['PORT'] ?? '') ??
        int.tryParse('${ports['catalog']}') ??
        3003;

    return AppConfig(
      mongoUri: mongoUri,
      port: port,
      dbName: env['MONGO_DB'] ?? 'test',
      k8sBaseUrl: (k8s['url'] as String?) ?? 'http://',
      catalogHost: (clusterIp['catalog'] as String?) ?? 'localhost',
      eventBusHost: (clusterIp['event-bus'] as String?) ?? 'localhost',
      eventBusPort: int.tryParse('${ports['eventBus']}') ?? 10001,
      paths: (shared['paths'] as Map<String, dynamic>?) ?? {},
      requests: (shared['requests'] as Map<String, dynamic>?) ?? {},
    );
  }

  static Future<Map<String, dynamic>> _loadSharedConfig() async {
    final candidates = [
      'api-shared-config.json',
      '../api-shared-config.json',
      '../../api-shared-config.json',
      '/app/api-shared-config.json',
    ];
    for (final path in candidates) {
      final file = File(path);
      if (await file.exists()) {
        return jsonDecode(await file.readAsString()) as Map<String, dynamic>;
      }
    }
    return {};
  }
}
