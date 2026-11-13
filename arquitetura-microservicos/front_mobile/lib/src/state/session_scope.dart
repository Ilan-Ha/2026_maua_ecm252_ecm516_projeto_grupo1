import 'package:flutter/widgets.dart';

import 'session_state.dart';

class SessionScope extends InheritedNotifier<SessionState> {
  const SessionScope({
    super.key,
    required SessionState notifier,
    required super.child,
  }) : super(notifier: notifier);

  static SessionState of(BuildContext context) {
    final scope = context.dependOnInheritedWidgetOfExactType<SessionScope>();
    assert(scope != null, 'SessionScope não encontrado');
    return scope!.notifier!;
  }
}
