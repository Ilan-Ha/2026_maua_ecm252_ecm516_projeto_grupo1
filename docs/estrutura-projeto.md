# Estrutura do projeto

## Raiz

```
/
├── back-end/
│   ├── api-shared-config.json   # contrato único (portas, paths, events, requests)
│   ├── infra/                   # gateway, event-bus, request-bus
│   ├── mss/                     # microsserviços (layout flat)
│   └── shared/                  # utilitários compartilhados do gateway
├── front-end/project/           # React + Vite (macOS: FRONT-END ≡ front-end)
├── docs/                        # documentação (agentes + time)
├── scripts/                     # install-all.js, start-all.js
├── .cursor/rules/               # regras Cursor (sempre ler docs-maintenance)
└── migracao_mss_nestjs_*.plan.md
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
| `shared/` | — | TS | Config helpers usados pelos MSS |

Reservadas no contrato (ainda sem pasta implementada como Nest standalone):

| Serviço | Porta | Status |
|---------|-------|--------|
| `priceOffer` | 3006 | Planejado (branches `modernizacao/02-*`) |
| `comparison` | 3007 | Planejado (`modernizacao/03-*`) |
| `notification` | 3008 | Planejado (`modernizacao/05-*`) — só consumidor de eventos |

## Front-end

- App React em `front-end/project/src/`
- Consome **somente o gateway** (`apiBase` → porta 10000)
- Auth: `src/auth/` (`AuthContext`, `apiFetch`, `RequireAuth`, `session`)
- Rotas protegidas: `/historico`, `/perfil` (+ POST review exige Bearer)

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

## O que NÃO fazer

- Não recriar pastas `Identity/`, `Catalog/`, `Engagment/`
- Não apontar o front diretamente às portas 300x
- Não commitar `.env` com secrets
