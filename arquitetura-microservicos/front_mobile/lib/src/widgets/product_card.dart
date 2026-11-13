import 'package:flutter/material.dart';
import 'package:front_mobile/src/config/routes.dart';
import 'package:front_mobile/src/models/produto.dart';

class ProductCard extends StatelessWidget {
  const ProductCard({super.key, required this.produto});

  final Produto produto;

  @override
  Widget build(BuildContext context) {
    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: () => Navigator.pushNamed(
          context,
          '${AppRoutes.product}/${produto.id}',
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Expanded(
              child: produto.imagem.isEmpty
                  ? const ColoredBox(
                      color: Color(0xFFE8E8E8),
                      child: Icon(Icons.image_not_supported),
                    )
                  : Image.network(
                      produto.imagem,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) =>
                          const Icon(Icons.broken_image),
                    ),
            ),
            Padding(
              padding: const EdgeInsets.all(8),
              child: Text(
                produto.nome,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(fontWeight: FontWeight.w600),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
