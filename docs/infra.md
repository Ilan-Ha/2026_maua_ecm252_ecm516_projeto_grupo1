# Infraestrutura

Estado atual (2026-09-21). Snapshot histórico jun/2026: `.cursor/docs/infra-baseline/`.

## Componentes

| Componente | Pasta | Porta | Papel |
|------------|-------|-------|-------|
| Gateway | `back-end/infra/gateway/` | 10000 | Única entrada HTTP do front |
| Event Bus | `back-end/infra/event-bus/` | 10001 | Pub/sub assíncrono |
| Request Bus | `back-end/infra/request-bus/` | 10002 | Request/reply síncrono |
| Logs MSS | `back-end/mss/logs/` | 3009 | Query de `app_logs` |

Os MSS **não** embutem um bus “de infra” próprio: módulos Nest `event-bus/` / handlers só **se inscrevem** e publicam contra os processos em `infra/`.

## Subida

```bash
npm start   # scripts/start-all.js + concurrently
```

Ordem lógica: event → request → auth → user → catalog → review → history → logs → gateway → front → logui.

Requer `.env` na raiz com ao menos:

```
MONGO_URI=...
JWT_SECRET=...
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=7d
LOG_ENABLED=true
LOG_TTL_DAYS=7
LOG_MONGO_DB=allforone_logs
```

O script copia `.env` → `back-end/mss/.env` se faltar.

URLs:

- Gateway: `http://localhost:10000`
- Site: `http://localhost:5173`
- Logs console: `http://localhost:5174` (localhost only)

## Gateway

- Express + `Gateway` class (proxy tipado por endpoint name)
- Correlation: middleware `x-correlation-id` + propagação aos MSS
- HTTP logging → Mongo `app_logs` (serviço `gateway`)
- Rotas públicas: login, cadastro, refresh, logout, catálogo, GET reviews, **GET /logs**
- Rotas com `requireAuth` (Bearer access JWT): perfil, POST reviews, histórico CRUD
- Identidade injetada a partir do JWT (`req.auth.sub|email|nome`) — **não** confiar no body do cliente para `authId`

Arquivos-chave:

- `back-end/infra/gateway/index.ts`
- `back-end/infra/gateway/auth.ts`
- `back-end/shared/logging/`

## Event / Request bus

- Paths: `POST /eventos`, `POST /inscricao`, `POST /requisicao`
- Também emitem logs HTTP/event/request para `app_logs`
- Nomes de eventos/requests em `api-shared-config.json` (`events.*`, `requests.*`)

## Console de logs

- Escrita: cada processo (domínio + infra) grava direto no Mongo (`writeLog`)
- Leitura: UI → `GET /logs` no gateway → MSS `logs`
- Decorator Nest `@AuditLog` para eventos de negócio
- Interceptor HTTP global + exception filter enriquecido

## Observações

- macOS case-insensitive: cuidado ao mover `Catalog` ↔ `catalog`
- Nodemon no gateway recarrega TS; Nest precisa restart após mudança de `.env`
- Notification **não** é chamado pelo gateway (só evento)
