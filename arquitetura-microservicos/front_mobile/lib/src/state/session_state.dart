import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../models/usuario.dart';

class SessionState extends ChangeNotifier {
  Usuario? usuario;

  bool get isLoggedIn => usuario != null;

  Future<void> load() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString('usuario');
    if (raw == null) return;
    try {
      usuario = Usuario.fromJson(jsonDecode(raw) as Map<String, dynamic>);
      notifyListeners();
    } catch (_) {
      usuario = null;
    }
  }

  Future<void> setUsuario(Usuario value) async {
    usuario = value;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('usuario', jsonEncode(value.toJson()));
    notifyListeners();
  }

  Future<void> logout() async {
    usuario = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('usuario');
    notifyListeners();
  }
}
