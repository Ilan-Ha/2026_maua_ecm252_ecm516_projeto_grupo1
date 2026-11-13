import 'env.dart';

class AppConfig {
  const AppConfig({required this.reviewServerPort});
  final int reviewServerPort;

  factory AppConfig.fromEnv() {
    final config = AppConfig(
      reviewServerPort: Env.inteiro('REVIEW_SERVER_POR', 3004),
    );
    if(config.reviewServerPort < 1 || config.reviewServerPort > 65535){
      throw StateError('REVIEW_SERVER_PORT fora da faixa válida: ${config.reviewServerPort}');
    }
    return config;
  }
}
