# AllForOne — front_mobile (Flutter)

Aplicação mobile Flutter com acesso gráfico a todas as funcionalidades do back-end via API Gateway.

## Telas

- Catálogo (categorias + produtos)
- Detalhe do produto + reviews
- Comparação de produtos
- Histórico local
- Cadastro / Login / Perfil
- Indicador de health (API/DB)

## Executar

```bash
cd arquitetura-microservicos/front_mobile
flutter pub get

# Gateway Kubernetes (NodePort padrão)
flutter run -d chrome

# Gateway local sem k8s
flutter run -d chrome --dart-define=GATEWAY_BASE=http://localhost:10000
```
