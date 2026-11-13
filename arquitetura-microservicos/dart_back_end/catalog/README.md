# Catalog (Dart)

Microsserviço de catálogo do AllForOne — substitui o catalog Node no deploy Docker/Kubernetes.

## Endpoints

| Método | Path | Resposta |
|--------|------|----------|
| GET | `/catalogo` | `{ error, status, content: { Categorias, Itens } }` |
| GET | `/produto?id=` | `{ error, status, content: produto }` |
| GET | `/health` | status do serviço + DB |
| GET | `/health/db` | checagem Mongo |
| POST | `/requisicao` | `catalog.product.exist` |
| POST | `/eventos` | no-op (compatível com event-bus) |

## Ambiente

- `MONGO_URI` (obrigatório)
- `MONGO_DB` (default `test`)
- `PORT` (default `3003`)
- `api-shared-config.json` (copiado na imagem / resolve relativo)

## Local

```bash
export MONGO_URI='...'
dart pub get
dart run bin/server.dart
```
