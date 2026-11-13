/// Base do API Gateway.
///
/// Override em runtime:
/// `flutter run --dart-define=GATEWAY_BASE=http://localhost:10000`
const gatewayBase = String.fromEnvironment(
  'GATEWAY_BASE',
  defaultValue: 'http://localhost:32371',
);

const pathCatalog = '/catalogo';
const pathProduct = '/produto';
const pathLogin = '/login';
const pathRegister = '/cadastro';
const pathProfile = '/perfil';
const pathReviews = '/reviews';
const pathReviewsByProduct = '/reviews/produto';
const pathHealth = '/health';
const pathHealthDb = '/health/db';
