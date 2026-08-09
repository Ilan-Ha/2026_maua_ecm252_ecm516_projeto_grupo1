# 🕘 History Service

**Porta:** `3005`

## O que faz

Registra e consulta o **histórico de produtos visitados** por cada usuário:

- Registra quando um usuário acessa a página de detalhes de um produto
- Evita duplicatas (upsert — atualiza a data se o produto já foi visto)
- Retorna o histórico completo do usuário com dados dos produtos populados
- Permite limpar o histórico

## Estrutura

```
history/
├── controller/
│   └── historyController.ts  ← Servidor Express completo (rotas + boot)
├── db/
│   └── historyDBManager.ts   ← Funções de acesso ao MongoDB
└── entities/
    └── history.ts            ← Schema: { userId, productId, createdAt }
```

## Rotas HTTP

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/historico` | Registra acesso a um produto |
| GET | `/historico?authId=...` | Retorna histórico populado do usuário |
| DELETE | `/historico?authId=...` | Limpa o histórico do usuário |
| POST | `/eventos` | Recebe eventos do Event Bus |
| POST | `/requisicao` | Responde a queries do Request Bus |

## Como o POST /historico funciona

O front-end envia `{ authId, productId }`.

O History service então:
1. Usa o **Request Bus** para perguntar ao User service: _"qual é o `userId` desse `authId`?"_
2. Usa o **Request Bus** para perguntar ao Catalog service: _"esse `productId` existe?"_
3. Grava `{ userId, productId, updatedAt }` no MongoDB (upsert)

## Como o GET /historico funciona

1. Resolve `authId` → `userId` via Request Bus
2. Busca os últimos 50 registros do usuário no MongoDB
3. Para cada registro, busca os dados do produto no Catalog service
4. Retorna a lista populada: `[{ _id, nome, imagem, preço, categoriaTag, acessadoEm }]`

## Banco de Dados

- **MongoDB:** banco `userProductHistory`, coleção `history`
- **Campos:** `userId` (ObjectId), `productId` (ObjectId), `createdAt`
- **Índice único:** `{ userId, productId }` — evita duplicatas

## Como iniciar

```bash
cd back-end/mss/Engagment/history
npm install
npm start
```

> ⚠️ Requer `MONGO_URI` definida no `.env`.
> ⚠️ Requer **Event Bus**, **Request Bus**, **User service** e **Catalog service** rodando.
