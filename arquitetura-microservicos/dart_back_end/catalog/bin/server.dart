import 'dart:async';
import 'dart:io';

import 'package:catalog/src/config/app_config.dart';
import 'package:catalog/src/http/catalog_server.dart';
import 'package:catalog/src/repositories/catalog_repository.dart';

Future<void> main(List<String> args) async {
  final config = await AppConfig.load();
  final repository = CatalogRepository(
    mongoUri: config.mongoUri,
    dbName: config.dbName,
  );
  final server = CatalogServer(config: config, repository: repository);

  Future<void> shutdown(String signal) async {
    stdout.writeln('Encerrando catalog ($signal)...');
    await server.stop();
    await repository.close();
    exit(0);
  }

  ProcessSignal.sigint.watch().listen((_) => shutdown('SIGINT'));
  ProcessSignal.sigterm.watch().listen((_) => shutdown('SIGTERM'));

  await server.start();
}
