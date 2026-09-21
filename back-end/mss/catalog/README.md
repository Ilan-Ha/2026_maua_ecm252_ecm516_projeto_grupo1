# Catalog Service (NestJS)

**Porta:** `3003`

## O que faz

Responsável pelo **catálogo de produtos**:

- Seed de categorias ao subir
- Listagem de categorias e produtos
- Busca de produto por ID
- Verificação de existência de produto (Request Bus)

## Estrutura

```
catalog/
├── nest-cli.json
├── package.json
├── tsconfig.json
├── README.md
└── src/
    ├── main.ts
    ├── app.module.ts
    ├── common/          # config, filters, helpers
    ├── database/        # Mongo + seed
    ├── catalog/         # GET /catalogo, GET /produto
    ├── product/         # schema, repository, domain
    ├── category/        # schema, repository, domain
    ├── request-bus/     # POST /requisicao
    └── event-bus/       # POST /eventos + subscribe
```

## Rotas HTTP

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/catalogo` | Lista categorias e produtos |
| GET | `/produto?id=...` | Produto pelo `_id` |
| POST | `/eventos` | Callback do Event Bus |
| POST | `/requisicao` | Queries do Request Bus |

## Request Bus

| Request | Descrição |
|---------|-----------|
| `catalog.product.exist` | Verifica se o produto existe (`productId`) |

## Banco

- MongoDB, database `test`, coleções `categorias` e `produtos`
- Seed de categorias no boot (`SeedService`)

## Formato de resposta

```json
{
  "error": false,
  "status": 200,
  "content": { }
}
```

## Como iniciar

```bash
cd back-end/mss/catalog
npm install
npm start
```

> Requer `MONGO_URI` no `.env` (raiz ou `back-end/mss/.env`).
> Event Bus na `:10001` é usado no boot para inscrição (falha de inscrição não derruba o serviço).
