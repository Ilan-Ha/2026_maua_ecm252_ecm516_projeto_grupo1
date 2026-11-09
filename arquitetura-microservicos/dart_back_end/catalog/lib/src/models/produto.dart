// const produtoSchema = new mongoose.Schema({
//   nome: String,
//   imagem: String,
//   categoriaTag: { type: String, index: true },
//   descricao: String,
//   precoMedio: Number,
//   lancamento: Number,
//   marca: String,
//   imagens: [String],
//   especificacoes: Object,
//   sitesCompra: [
//     {
//       loja: String,
//       preco: Number,
//       link: String
//     }
//   ]
// }, {collection: 'produtos'});
class Produto {
  final String? id; // _id
  final String nome;
  final int? v; //__v
  final String categoriaTag;
  final String? descricao;
  final Map<String,dynamic>? especificacoes ;
  final String imagem;
  final List<String>? imagens;
  final int lancamento;
  final String marca;
  final double precoMedio;
  final List<Map<String,dynamic>>? sitesCompra;
  final double? avaliacao;
  final bool estoque;
  final String slug;

  const Produto({
  this.id, // _id
  required this.nome,
  this.v, //__v
  required this.categoriaTag,
  this.descricao,
  this.especificacoes,
  required this.imagem,
  this.imagens,
  required this.lancamento,
  required this.marca,
  required this.precoMedio,
  this.sitesCompra,
  this.avaliacao,
  required this.estoque,
  required this.slug
  });

    Produto copyWith({
      String? id, // _id
      String? nome,
      int? v, //__v
      String? categoriaTag,
      String? descricao,
      Map<String,dynamic>? especificacoes ,
      String? imagem,
      List<String>? imagens,
      int? lancamento,
      String? marca,
      double? precoMedio,
      List<Map<String,dynamic>>? sitesCompra,
      double? avaliacao,
      bool? estoque,
      String? slug
  }){
    return Produto(
      id: id ?? this.id,
      nome: nome ?? this.nome, 
      v: v ?? this.v,
      categoriaTag: categoriaTag ?? this.categoriaTag,
      descricao: descricao ?? this.descricao,
      especificacoes: especificacoes ?? this.especificacoes,
      imagem: imagem ?? this.imagem,
      imagens: imagens ?? this.imagens,
      lancamento: lancamento ?? this.lancamento,
      marca: marca ?? this.marca,
      precoMedio: precoMedio ?? this.precoMedio,
      sitesCompra: sitesCompra ?? this.sitesCompra,
      avaliacao: avaliacao ?? this.avaliacao,
      estoque: estoque ?? this.estoque,
      slug: slug ?? this.slug
      );
  }

    Map<String, dynamic> toJson() =>{
    '_id':id,
    'nome':nome,
    '__v':v,
    'categoriaTag': categoriaTag,
    'descricao': descricao,
    'especificacoes': especificacoes,
    'imagem':imagem,
    'imagens': imagens,
    'lancamento': lancamento,
    'marca': marca,
    'precoMedio': precoMedio,
    'sitesCompra': sitesCompra,
    'avaliacao': avaliacao,
    'estoque': estoque,
    'slug': slug
  };
}