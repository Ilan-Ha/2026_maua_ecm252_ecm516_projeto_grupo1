class Usuario {
  const Usuario({required this.nome, required this.email});

  final String nome;
  final String email;

  factory Usuario.fromJson(Map<String, dynamic> json) {
    return Usuario(
      nome: '${json['nome'] ?? ''}',
      email: '${json['email'] ?? ''}',
    );
  }

  Map<String, dynamic> toJson() => {'nome': nome, 'email': email};
}
