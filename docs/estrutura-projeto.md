# Estrutura do projeto

## Raiz

```
/
├── back-end/
│   ├── api-shared-config.json   # contrato único (portas, paths, events, requests)
│   ├── infra/                   # gateway, event-bus, request-bus (NestJS)
│   ├── mss/                     # microsserviços (layout flat, NestJS)
│   └── shared/                  # logging Express legado + helpers
├── front-end/project/           # React + Vite (site AllForOne)
├── front-end/logs/              # Console de logs (Vite :5174, localhost)
├── docs/                        # documentação (agentes + time)
├── scripts/                     # install-all.js, start-all.js
├── .cursor/rules/               # regras Cursor (sempre ler docs-maintenance)
└── docs/planos/                 # planos de migração (Nest/domínio)
```

## Back-end MSS (layout flat)

Cada serviço fica **lado a lado** em `back-end/mss/` — sem pastas de contexto (`Identity/`, `Catalog/`, `Engagment/`):

| Pasta | Porta | Stack | Papel |
|-------|-------|-------|-------|
| `auth` | 3001 | NestJS | Login, cadastro, refresh, logout, senha |
| `user` | 3002 | NestJS | Perfil / dados de usuário (request bus) |
| `catalog` | 3003 | NestJS | Produtos (catálogo) |
| `review` | 3004 | NestJS | Avaliações |
| `history` | 3005 | NestJS | Histórico de visualização |
| `logs` | 3009 | NestJS | Query read-only de `app_logs` (console) |
| `shared/` | — | TS | Config helpers + kit de logging Nest |

Reservadas no contrato (ainda sem pasta implementada como Nest standalone):

| Serviço | Porta | Status |
|---------|-------|--------|
| `priceOffer` | 3006 | Planejado (branches `modernizacao/02-*`) |
| `comparison` | 3007 | Planejado (`modernizacao/03-*`) |
| `notification` | 3008 | Planejado (`modernizacao/05-*`) — só consumidor de eventos |

Logging compartilhado: `back-end/shared/logging/` (writer Mongo + middleware Express) e cópia Nest em cada `src/common/logging/`. DB Mongo dedicada: `allforone_logs.app_logs` (TTL).

## Front-end

- App React em `front-end/project/src/` (produto)
- Console de logs em `front-end/logs/` (debug CloudWatch-like, porta 5174)
- Ambos consomem o gateway (`:10000`)
- Auth (site): `src/auth/` (`AuthContext`, `apiFetch`, `RequireAuth`, `session`)
- Rotas protegidas (site): `/historico`, `/perfil` (+ POST review exige Bearer)

## Contrato compartilhado

Fonte da verdade: `back-end/api-shared-config.json`.

- Front importa via `config.jsx` (cópia/bridge do contrato)
- Gateway e MSS leem via `back-end/mss/shared/.../config`
- `services.*.port` no JSON aponta para **10000** (gateway) — portas reais ficam em `ports.back.*`

## Branches de modernização

Branch base: `modernizacao/stack`

| Branch | Foco |
|--------|------|
| `modernizacao/01-contrato-config` | Contrato / ownership |
| `modernizacao/02-price-offer-catalog` | Split preço do catalog |
| `modernizacao/03-comparison-api` | Comparison Nest |
| `modernizacao/04-user-account` | Unificar auth+user+history |
| `modernizacao/05-notification` | Notification consumidor |
| `modernizacao/nestjs-mss-flat` | Layout flat Nest |
| `modernizacao/infra-nest` | Gateway + event/request bus Nest |

## O que NÃO fazer

- Não recriar pastas `Identity/`, `Catalog/`, `Engagment/`
- Não apontar o front diretamente às portas 300x
- Não commitar `.env` com secrets
