# Infraestrutura

Estado atual (2026-09-21). Snapshot histórico jun/2026: `.cursor/docs/infra-baseline/`.

## Componentes

| Componente | Pasta | Porta | Papel |
|------------|-------|-------|-------|
| Gateway | `back-end/infra/gateway/` | 10000 | Única entrada HTTP do front |
| Event Bus | `back-end/infra/event-bus/` | 10001 | Pub/sub assíncrono |
| Request Bus | `back-end/infra/request-bus/` | 10002 | Request/reply síncrono |

Os MSS **não** embutem um bus “de infra” próprio: módulos Nest `event-bus/` / handlers só **se inscrevem** e publicam contra os processos em `infra/`.

## Subida

```bash
npm start   # scripts/start-all.js + concurrently
```

Ordem lógica: event → request → auth → user → catalog → review → history → gateway → front.

Requer `.env` na raiz com ao menos:

```
MONGO_URI=...
JWT_SECRET=...
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=7d
```

O script copia `.env` → `back-end/mss/.env` se faltar.

## Gateway

- Express + `Gateway` class (proxy tipado por endpoint name)
- Rotas públicas: login, cadastro, refresh, logout, catálogo, GET reviews
- Rotas com `requireAuth` (Bearer access JWT): perfil, POST reviews, histórico CRUD
- Identidade injetada a partir do JWT (`req.auth.sub|email|nome`) — **não** confiar no body do cliente para `authId`

Arquivos-chave:

- `back-end/infra/gateway/index.ts`
- `back-end/infra/gateway/auth.ts`

## Event / Request bus

- Paths: `POST /eventos`, `POST /inscricao`, `POST /requisicao`
- Nomes de eventos/requests em `api-shared-config.json` (`events.*`, `requests.*`)
- Ex.: cadastro auth publica criação de user; user responde `user.added`

## Auth no gateway (Bearer)

1. Cliente envia `Authorization: Bearer <accessToken>`
2. `requireAuth` valida JWT (`typ === 'access'`) com `JWT_SECRET`
3. Rotas protegidas usam `req.auth` para propagar identidade ao MSS

Refresh/logout são públicos no gateway, mas o refresh token é validado no MSS auth (Mongo `refresh_tokens` + JWT `typ === 'refresh'`).

## Observações

- macOS case-insensitive: cuidado ao mover `Catalog` ↔ `catalog`
- Nodemon no gateway recarrega TS; Nest auth precisa restart após mudança de `.env`
- Notification **não** é chamado pelo gateway (só evento)
