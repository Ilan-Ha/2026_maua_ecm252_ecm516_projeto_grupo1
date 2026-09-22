# Infraestrutura

Estado atual (2026-09-22). Snapshot histórico jun/2026: `.cursor/docs/infra-baseline/`.

## Componentes

| Componente | Pasta | Porta | Stack | Papel |
|------------|-------|-------|-------|-------|
| Gateway | `back-end/infra/gateway/` | 10000 | NestJS | Única entrada HTTP do front |
| Event Bus | `back-end/infra/event-bus/` | 10001 | NestJS | Pub/sub assíncrono |
| Request Bus | `back-end/infra/request-bus/` | 10002 | NestJS | Request/reply síncrono |
| Logs MSS | `back-end/mss/logs/` | 3009 | NestJS | Query de `app_logs` |

Os três processos de infra seguem o mesmo padrão Nest dos MSS (`src/main.ts`, modules, middleware de correlation/logging). Código Express/JS anterior ficou em `_legacy/` de cada pasta (referência; não sobe no `npm start`).

Os MSS **não** embutem um bus “de infra” próprio: módulos Nest `event-bus/` / handlers só **se inscrevem** e publicam contra os processos em `infra/`.

## Subida

```bash
npm start   # scripts/start-all.js + concurrently
```

Ordem lógica: event → request → auth → user → catalog → review → history → logs → gateway → front → logui.

Cada pasta Nest sobe com `nest start --watch` (`npm start` local).

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

## Gateway (Nest)

Módulos em `back-end/infra/gateway/src/`:

| Módulo | Responsabilidade |
|--------|------------------|
| `AuthRoutesModule` | login, cadastro, refresh, logout |
| `CatalogGatewayModule` | `/catalogo`, `/produto` |
| `ReviewGatewayModule` | list + create (Bearer no create) |
| `HistoryGatewayModule` | CRUD histórico (Bearer) |
| `UserGatewayModule` | perfil (Bearer) |
| `LogsGatewayModule` | proxy `GET /logs` |
| `HealthModule` | `/health`, `/health/db` |
| `ProxyModule` | `ProxyService` (ex-`Gateway.ts`) |
| `BearerAuthGuard` | JWT access Bearer |

- CORS localhost / 127.0.0.1
- Correlation: middleware `x-correlation-id` + propagação aos MSS no proxy
- HTTP logging → Mongo `app_logs` (serviço `gateway`)
- Rotas públicas: login, cadastro, refresh, logout, catálogo, GET reviews, **GET /logs**
- Rotas com guard Bearer: perfil, POST reviews, histórico CRUD
- Identidade a partir do JWT (`req.auth.sub|email|nome`) — **não** confiar no body do cliente para `authId`
- Envelopes HTTP iguais ao gateway Express (front não precisa mudar)

## Event / Request bus (Nest)

- Event: `POST /eventos`, `POST /inscricao`, `POST /desinscricao`, `GET /dados`
- Request: `POST /requisicao` (registry tipado dos `requests.*` do config)
- Campo wire de callback no event-bus permanece `calbackUrl` (typo histórico — não renomear no contrato)
- Também emitem logs HTTP/event/request para `app_logs`
- Nomes de eventos/requests em `api-shared-config.json` (`events.*`, `requests.*`)

## Console de logs

- Escrita: cada processo (domínio + infra) grava direto no Mongo (`writeLog`)
- Leitura: UI → `GET /logs` no gateway → MSS `logs`
- Decorator Nest `@AuditLog` para eventos de negócio
- Interceptor HTTP global + exception filter enriquecido (MSS)

## Observações

- macOS case-insensitive: cuidado ao mover `Catalog` ↔ `catalog`
- Nest precisa restart após mudança de `.env` (watch não recarrega env)
- Notification **não** é chamado pelo gateway (só evento)
- Branch de modernização desta mudança: `modernizacao/infra-nest` → base `modernizacao/stack`
