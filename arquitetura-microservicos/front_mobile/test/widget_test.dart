import 'package:flutter_test/flutter_test.dart';
import 'package:front_mobile/src/models/usuario.dart';

void main() {
  test('Usuario serializa e desserializa', () {
    const user = Usuario(nome: 'Ana', email: 'ana@mail.com');
    final again = Usuario.fromJson(user.toJson());
    expect(again.nome, 'Ana');
    expect(again.email, 'ana@mail.com');
  });
}
