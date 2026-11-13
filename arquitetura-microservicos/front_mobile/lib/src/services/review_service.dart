import '../config/api_config.dart';
import '../models/review.dart';
import 'api_client.dart';

class ReviewService {
  ReviewService(this._api);

  final ApiClient _api;

  Future<ReviewsPayload> listByProduct(String produtoId) async {
    final data = await _api.get('$pathReviewsByProduct/$produtoId');
    if (data is! Map) {
      return const ReviewsPayload(mediaEstrelas: 0, total: 0, reviews: []);
    }
    return ReviewsPayload.fromJson(Map<String, dynamic>.from(data));
  }

  Future<String> create({
    required String produtoId,
    required String email,
    required String nome,
    required int estrelas,
    required String comentario,
  }) async {
    final data = await _api.post(pathReviews, {
      'produtoId': produtoId,
      'email': email,
      'nome': nome,
      'estrelas': estrelas,
      'comentario': comentario,
    });
    if (data is Map && data['message'] is String) {
      return data['message'] as String;
    }
    return 'Review salva';
  }
}
