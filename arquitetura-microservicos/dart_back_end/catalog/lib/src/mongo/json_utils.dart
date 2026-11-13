import 'package:mongo_dart/mongo_dart.dart';

dynamic jsonSafe(dynamic value) {
  if (value == null) return null;
  if (value is ObjectId) return value.oid;
  if (value is DateTime) return value.toIso8601String();
  if (value is Map) {
    return value.map((k, v) => MapEntry(k.toString(), jsonSafe(v)));
  }
  if (value is Iterable) {
    return value.map(jsonSafe).toList();
  }
  return value;
}

Map<String, dynamic> docToJson(Map<String, dynamic> doc) {
  final out = <String, dynamic>{};
  for (final entry in doc.entries) {
    out[entry.key] = jsonSafe(entry.value);
  }
  return out;
}
