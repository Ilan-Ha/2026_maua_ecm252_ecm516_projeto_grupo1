# History Service (NestJS)

**Porta:** `3005`

## O que faz

Registra e consulta o **histórico de produtos visitados**:

- POST registra acesso (resolve userId + valida produto)
- GET lista histórico populado via Catalog
- DELETE limpa histórico do usuário
- Event/Request Bus stubs (subscribe vazio, best-effort)

## Estrutura

```
history/
├── nest-cli.json
├── package.json
├── tsconfig.json
├── README.md
└── src/
    ├── main.ts
    ├── app.module.ts
    ├── common/
    ├── database/
    ├── history/         # HTTP + schema + repository
    ├── event-bus/       # POST /eventos + subscribe
    └── request-bus/     # POST /requisicao (stub)
```

## Rotas HTTP

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/historico` | Registra acesso a produto |
| GET | `/historico?authId=` | Histórico populado |
| DELETE | `/historico?authId=` | Limpa histórico |
| POST | `/eventos` | Callback do Event Bus |
| POST | `/requisicao` | Stub do Request Bus |

## Integrações

- Request Bus → `user.byAuthId`, `catalog.product.exist`
- HTTP Catalog → `GET /produto?id=`

`serviceName` no Event Bus: `product user search history` (compatibilidade).

## Banco

- MongoDB, database `userProductHistory`, coleção `history`
- Unique: `{ userId, productId }`

## Como iniciar

```bash
cd back-end/mss/history
npm install
npm start
```

> Requer `MONGO_URI` no `.env`. Event Bus, Request Bus, User e Catalog devem estar disponíveis.
