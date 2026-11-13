class Categoria {
  const Categoria({
    required this.id,
    required this.nome,
    required this.tag,
    required this.imagem,
  });

  final String id;
  final String nome;
  final String tag;
  final String imagem;

  factory Categoria.fromJson(Map<String, dynamic> json) {
    return Categoria(
      id: '${json['_id'] ?? ''}',
      nome: '${json['nome'] ?? ''}',
      tag: '${json['tag'] ?? ''}',
      imagem: '${json['imagem'] ?? ''}',
    );
  }
}
