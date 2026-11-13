import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

const historyKey = 'allforone_history_produtos';

class HistoryService {
  Future<List<Map<String, dynamic>>> load() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(historyKey);
    if (raw == null || raw.isEmpty) return [];
    try {
      final list = jsonDecode(raw) as List;
      return list
          .whereType<Map>()
          .map((e) => Map<String, dynamic>.from(e))
          .toList();
    } catch (_) {
      return [];
    }
  }

  Future<void> registerAccess(Map<String, dynamic> produto) async {
    final prefs = await SharedPreferences.getInstance();
    final current = await load();
    final id = '${produto['_id']}';
    final filtered = current.where((e) => '${e['_id']}' != id).toList();
    filtered.insert(0, produto);
    await prefs.setString(
      historyKey,
      jsonEncode(filtered.take(50).toList()),
    );
  }

  Future<void> clear() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(historyKey);
  }
}
