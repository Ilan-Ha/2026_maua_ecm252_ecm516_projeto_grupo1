// ref: https://pub.dev/packages/mongo_dart
import 'package:mongo_dart/mongo_dart.dart';

//#region schemas
// const categoriaSchema = new mongoose.Schema({
//   nome: String,
//   tag: { type: String, unique: true },
//   imagem: String
// }, {collection: 'categorias'});
// // Produto
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
//#endregion
var db = Db(
  'mongodb://arthursilvacorreia199_db_user:diegoamaenxadas2@ac-7wuyakn-shard-00-00.7ybc0ug.mongodb.net:27017,ac-7wuyakn-shard-00-01.7ybc0ug.mongodb.net:27017,ac-7wuyakn-shard-00-02.7ybc0ug.mongodb.net:27017/?ssl=true&replicaSet=atlas-pfy2is-shard-0&authSource=admin&appName=ALLFORONE',
);

void main() async {
  await db.open();
  // var coll = db.collection('categorias');
  // await coll.find().forEach((v)=>print(v));
  var prod = db.collection('produtos');
  await prod.find(where.limit(1)).forEach((v)=>print(v));
}
