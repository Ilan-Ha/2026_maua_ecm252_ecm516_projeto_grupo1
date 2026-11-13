import 'dart:async';
import 'dart:io';

import 'package:catalog/src/config/app_config.dart';
import 'package:catalog/src/http/catalog_server.dart';
import 'package:catalog/src/repositories/catalog_repository.dart';
import 'package:mongo_dart/mongo_dart.dart';

Future<void> main(List<String> args) async {
  final config = await AppConfig.load();
  final db = Db(config.mongoUri);
  db.databaseName = config.dbName;
  await db.open();

  final repository = CatalogRepository(db);
  final server = CatalogServer(config: config, repository: repository);

  Future<void> shutdown(String signal) async {
    stdout.writeln('Encerrando catalog ($signal)...');
    await server.stop();
    await db.close();
    exit(0);
  }

  ProcessSignal.sigint.watch().listen((_) => shutdown('SIGINT'));
  ProcessSignal.sigterm.watch().listen((_) => shutdown('SIGTERM'));

  await server.start();
}
