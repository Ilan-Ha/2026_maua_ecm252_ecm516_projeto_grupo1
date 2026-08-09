# 🛍️ Catalog Service

**Porta:** `3003`

## O que faz

Responsável por todo o **catálogo de produtos**:

- Inicialização dos dados (seed) ao subir
- Listagem de categorias e produtos
- Busca de produto por ID
- Verificação de existência de produto (para outros serviços)

## Estrutura

```
catalog/
├── controller/
│   └── catalogController.ts  ← Servidor Express completo (rotas + boot)
├── db/
│   └── catalogDBManager.ts   ← Funções de acesso ao MongoDB + seed
└── entities/
    └── (modelos de produto/categoria)
```

## Rotas HTTP

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/catalogo` | Lista todas as categorias e produtos |
| GET | `/produto?id=...` | Retorna um produto pelo seu `_id` |
| POST | `/eventos` | Recebe eventos do Event Bus (não usados atualmente) |
| POST | `/requisicao` | Responde a queries do Request Bus |

## Requisições (Request Bus)

| Request | Descrição |
|---------|-----------|
| `catalog.product.exist` | Verifica se um produto existe dado um `productId` |

## Banco de Dados

- **MongoDB:** banco `test`, coleções `categorias` e `produtos`
- **Seed:** ao iniciar, popula automaticamente o banco se estiver vazio

## Formato de Resposta

Todas as rotas retornam no padrão:
```json
{
  "error": false,
  "status": 200,
  "content": { ... }
}
```

## Como iniciar

```bash
cd back-end/mss/Catalog/catalog
npm install
npm start
```

> ⚠️ Requer `MONGO_URI` definida no `.env`.
> ⚠️ Requer **Event Bus** rodando (para se inscrever no boot, mesmo sem eventos ativos).
