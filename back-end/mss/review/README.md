# Review Service (NestJS)

**Porta:** `3004`

## O que faz

Gerencia **avaliações de produtos**:

- Listagem com média de estrelas
- Upsert por `(produtoId, email)`
- Publica `review.created` (sem subscribe)

## Estrutura

```
review/
├── nest-cli.json
├── package.json
├── tsconfig.json
├── README.md
└── src/
    ├── main.ts
    ├── app.module.ts
    ├── common/
    ├── database/
    └── review/          # HTTP + schema + repository
```

## Rotas HTTP

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/health` | Health check (backend + db) |
| GET | `/reviews/produto/:produtoId` | Lista reviews + média |
| POST | `/reviews` | Cria/atualiza review (201) |

Erros usam status HTTP real com body `{ message, errors? }` (estilo antigo).

## Eventos

### Emite
- `review.created` — após salvar (`produtoId`, `reviewId`, `estrelas`)

## Banco

- MongoDB, database `reviews`, coleção `reviews`
- Unique: `{ produtoId, email }`

## Como iniciar

```bash
cd back-end/mss/review
npm install
npm start
```

> Requer `MONGO_URI` no `.env`.
