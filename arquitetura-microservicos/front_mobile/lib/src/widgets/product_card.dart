import 'package:flutter/material.dart';
import 'package:front_mobile/src/config/routes.dart';
import 'package:front_mobile/src/models/produto.dart';
import 'package:front_mobile/src/theme/brand.dart';
import 'package:front_mobile/src/widgets/network_image_view.dart';

class ProductCard extends StatelessWidget {
  const ProductCard({super.key, required this.produto});

  final Produto produto;

  @override
  Widget build(BuildContext context) {
    return Card(
      clipBehavior: Clip.antiAlias,
      elevation: 1,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      child: InkWell(
        onTap: () => Navigator.pushNamed(
          context,
          '${AppRoutes.product}/${produto.id}',
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Expanded(
              child: ColoredBox(
                color: Brand.greenSoft,
                child: NetworkImageView(
                  url: produto.imagem,
                  fit: BoxFit.contain,
                  borderRadius: 0,
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(8),
              child: Text(
                produto.nome,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  fontWeight: FontWeight.w600,
                  color: Brand.greenDark,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
