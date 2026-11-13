import 'package:flutter/material.dart';
import 'package:front_mobile/src/theme/brand.dart';

/// Imagem de rede com placeholder amigável (sem o X vermelho padrão do Flutter).
class NetworkImageView extends StatelessWidget {
  const NetworkImageView({
    super.key,
    required this.url,
    this.width,
    this.height,
    this.fit = BoxFit.cover,
    this.borderRadius = 8,
  });

  final String? url;
  final double? width;
  final double? height;
  final BoxFit fit;
  final double borderRadius;

  @override
  Widget build(BuildContext context) {
    final src = (url ?? '').trim();
    if (src.isEmpty) {
      return _placeholder(width, height);
    }

    return ClipRRect(
      borderRadius: BorderRadius.circular(borderRadius),
      child: Image.network(
        src,
        width: width,
        height: height,
        fit: fit,
        filterQuality: FilterQuality.medium,
        loadingBuilder: (context, child, progress) {
          if (progress == null) return child;
          return _box(
            width,
            height,
            child: const SizedBox(
              width: 22,
              height: 22,
              child: CircularProgressIndicator(strokeWidth: 2),
            ),
          );
        },
        errorBuilder: (_, __, ___) => _placeholder(width, height),
      ),
    );
  }

  static Widget _placeholder(double? width, double? height) {
    return _box(
      width,
      height,
      child: const Icon(Icons.image_outlined, color: Brand.green, size: 28),
    );
  }

  static Widget _box(double? width, double? height, {required Widget child}) {
    return Container(
      width: width,
      height: height,
      alignment: Alignment.center,
      color: Brand.greenMuted,
      child: child,
    );
  }
}
