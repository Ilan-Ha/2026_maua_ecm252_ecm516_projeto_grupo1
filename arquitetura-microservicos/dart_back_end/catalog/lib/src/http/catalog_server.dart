import 'dart:convert';
import 'dart:io';

import 'package:http/http.dart' as http;
import 'package:shelf/shelf.dart';
import 'package:shelf/shelf_io.dart' as shelf_io;
import 'package:shelf_router/shelf_router.dart';

import '../config/app_config.dart';
import '../repositories/catalog_repository.dart';

class CatalogServer {
  CatalogServer({
    required this.config,
    required this.repository,
  });

  final AppConfig config;
  final CatalogRepository repository;
  HttpServer? _server;

  Handler get handler {
    final router = Router();

    router.get('/health', (_) async {
      final dbOk = await repository.isConnected();
      return _json({
        'service': 'catalog',
        'backend': true,
        'db': dbOk,
        'status': dbOk ? 'ok' : 'degraded',
      });
    });

    router.get('/health/db', (_) async {
      final dbOk = await repository.isConnected();
      return _json({
        'service': 'catalog',
        'db': dbOk,
        'status': dbOk ? 'ok' : 'error',
      }, status: dbOk ? 200 : 503);
    });

    router.get(config.catalogPath, (_) async {
      try {
        final data = await repository.getCatalogo();
        return _json({
          'error': false,
          'status': 200,
          'content': data,
        });
      } catch (e) {
        return _json({
          'error': true,
          'status': 500,
          'message': 'Erro ao carregar catálogo',
        }, status: 500);
      }
    });

    router.get(config.productPath, (Request request) async {
      final id = request.url.queryParameters['id'];
      if (id == null || id.isEmpty) {
        return _json({
          'error': true,
          'status': 400,
          'message': 'ID inválido',
        }, status: 400);
      }
      try {
        final produto = await repository.getProdutoById(id);
        if (produto == null) {
          return _json({
            'error': true,
            'status': 404,
            'message': 'Produto não encontrado',
          }, status: 404);
        }
        return _json({
          'error': false,
          'status': 200,
          'content': produto,
        });
      } catch (_) {
        return _json({
          'error': true,
          'status': 400,
          'message': 'ID inválido',
        }, status: 400);
      }
    });

    router.post(config.eventsPath, (Request request) async {
      return Response.ok('');
    });

    router.post(config.requestsPath, (Request request) async {
      try {
        final body = jsonDecode(await request.readAsString())
            as Map<String, dynamic>;
        final reqName = body['request'] as String?;
        final payload = body['payload'] as Map<String, dynamic>? ?? {};

        if (reqName == config.productExistRequest) {
          final productId = '${payload['productId'] ?? ''}';
          try {
            await repository.getProdutoById(productId);
          } catch (_) {}
          return _json({
            'values': {'error': false},
          });
        }

        return _json({
          'content': {
            'error': true,
            'status': 404,
            'message': 'Requisição desconhecida',
          },
        });
      } catch (_) {
        return _json({
          'content': {
            'error': true,
            'status': 400,
            'message': 'Payload inválido',
          },
        }, status: 400);
      }
    });

    return Pipeline()
        .addMiddleware(logRequests())
        .addMiddleware(_cors())
        .addHandler(router.call);
  }

  Middleware _cors() {
    return (inner) {
      return (request) async {
        if (request.method == 'OPTIONS') {
          return Response.ok('', headers: _corsHeaders);
        }
        final response = await inner(request);
        return response.change(headers: {
          ...response.headers,
          ..._corsHeaders,
        });
      };
    };
  }

  static const _corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  Response _json(Object body, {int status = 200}) {
    return Response(
      status,
      body: jsonEncode(body),
      headers: const {'Content-Type': 'application/json; charset=utf-8'},
    );
  }

  Future<void> start() async {
    await repository.ensureSeed();
    _server = await shelf_io.serve(
      handler,
      InternetAddress.anyIPv4,
      config.port,
    );
    stdout.writeln(
      'Catalog (Dart) ouvindo em http://0.0.0.0:${config.port}',
    );
    await _subscribeEventBus();
  }

  Future<void> _subscribeEventBus() async {
    try {
      final response = await http.post(
        Uri.parse(config.eventBusSubscribeUrl),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'calbackUrl': config.callbackUrl,
          'serviceName': 'catalog',
          'events': <String>[],
        }),
      );
      stdout.writeln(
        'Inscrição no event-bus: ${response.statusCode}',
      );
    } catch (e) {
      stderr.writeln('Falha ao inscrever no event-bus (seguindo): $e');
    }
  }

  Future<void> stop() async {
    try {
      await http.post(
        Uri.parse(config.eventBusUnsubscribeUrl),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'calbackUrl': config.callbackUrl,
          'serviceName': 'catalog',
          'events': <String>[],
        }),
      );
    } catch (_) {}
    await _server?.close(force: true);
  }
}
