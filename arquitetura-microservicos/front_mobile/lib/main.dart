import 'package:flutter/material.dart';
import 'package:front_mobile/src/app.dart';
import 'package:front_mobile/src/state/session_scope.dart';
import 'package:front_mobile/src/state/session_state.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final session = SessionState();
  await session.load();
  runApp(SessionScope(notifier: session, child: const App()));
}
