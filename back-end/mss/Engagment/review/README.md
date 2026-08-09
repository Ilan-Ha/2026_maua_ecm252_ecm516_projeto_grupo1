# ⭐ Review Service

**Porta:** `3004`

## O que faz

Gerencia as **avaliações (reviews)** dos produtos:

- Criação e atualização de reviews (um review por usuário por produto — upsert)
- Listagem de reviews de um produto
- Cálculo da média de estrelas
- Emissão de evento quando uma review é criada

## Estrutura

```
review/
├── controller/
│   └── reviewController.ts  ← Servidor Express completo (rotas + boot)
├── db/
│   └── reviewDBManager.ts   ← Funções de acesso ao MongoDB
└── entities/
    └── review.ts            ← Schema: { produtoId, email, nome, estrelas, comentario }
```

## Rotas HTTP

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/health` | Health check (verifica se o banco está conectado) |
| GET | `/reviews/produto/:produtoId` | Lista reviews e média de um produto |
| POST | `/reviews` | Cria ou atualiza a review do usuário para um produto |

## Formato de resposta — GET /reviews/produto/:produtoId

```json
{
  "mediaEstrelas": 4.3,
  "total": 12,
  "reviews": [
    {
      "_id": "...",
      "nome": "Arthur",
      "estrelas": 5,
      "comentario": "Ótimo produto!",
      "createdAt": "2026-08-01T..."
    }
  ]
}
```

## Eventos

### Emite
- `review.created` — após salvar uma review (com `produtoId`, `reviewId`, `estrelas`)

## Banco de Dados

- **MongoDB:** banco `reviews`, coleção `reviews`
- **Campos:** `produtoId`, `email`, `nome`, `estrelas` (1-5), `comentario`
- **Unique:** um review por `(produtoId, email)` — usuário pode atualizar sua própria review

## Como iniciar

```bash
cd back-end/mss/Engagment/review
npm install
npm start
```

> ⚠️ Requer `MONGO_URI` definida no `.env`.
