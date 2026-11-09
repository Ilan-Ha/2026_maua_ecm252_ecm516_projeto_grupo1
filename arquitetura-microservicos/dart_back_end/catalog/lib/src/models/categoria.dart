class Categoria {
  final String? id;// _id
  final String nome;
  final String tag;
  final String imagem;
  final int? v; //__v 

  const Categoria({
    this.id,
    required this.nome,
    required this.tag,
    required this.imagem,
    this.v
  });

  Categoria copyWith({
    String? id,
    String? nome,
    String? tag,
    String? imagem,
    int? v
  }){
    return Categoria(
      id: id ?? this.id,
      nome: nome ?? this.nome, 
      tag: tag ?? this.tag, 
      imagem: imagem ?? this.imagem,
      v: v ?? this.v);
  }

  Map<String, dynamic> toJson() =>{
    '_id':id,
    'nome':nome,
    'tag':tag,
    'imagem':imagem,
    '__v':v
  };

}
