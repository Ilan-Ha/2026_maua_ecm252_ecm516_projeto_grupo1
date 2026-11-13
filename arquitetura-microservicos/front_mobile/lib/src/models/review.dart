class Review {
  const Review({
    required this.id,
    required this.produtoId,
    required this.email,
    required this.nome,
    required this.estrelas,
    required this.comentario,
    this.createdAt,
  });

  final String id;
  final String produtoId;
  final String email;
  final String nome;
  final int estrelas;
  final String comentario;
  final String? createdAt;

  factory Review.fromJson(Map<String, dynamic> json) {
    return Review(
      id: '${json['_id'] ?? ''}',
      produtoId: '${json['produtoId'] ?? ''}',
      email: '${json['email'] ?? ''}',
      nome: '${json['nome'] ?? ''}',
      estrelas: (json['estrelas'] as num?)?.toInt() ?? 0,
      comentario: '${json['comentario'] ?? ''}',
      createdAt: json['createdAt']?.toString(),
    );
  }
}

class ReviewsPayload {
  const ReviewsPayload({
    required this.mediaEstrelas,
    required this.total,
    required this.reviews,
  });

  final double mediaEstrelas;
  final int total;
  final List<Review> reviews;

  factory ReviewsPayload.fromJson(Map<String, dynamic> json) {
    final list = (json['reviews'] as List? ?? [])
        .whereType<Map>()
        .map((e) => Review.fromJson(Map<String, dynamic>.from(e)))
        .toList();
    return ReviewsPayload(
      mediaEstrelas: (json['mediaEstrelas'] as num?)?.toDouble() ?? 0,
      total: (json['total'] as num?)?.toInt() ?? 0,
      reviews: list,
    );
  }
}
