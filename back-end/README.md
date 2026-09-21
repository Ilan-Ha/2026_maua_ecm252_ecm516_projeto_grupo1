# Back-end — AllForOne

Arquitetura de **microsserviços** com Node.js + TypeScript + MongoDB + **NestJS**.

---

## Estrutura de pastas

```
back-end/
│
├── infra/                   ← Comunicação entre serviços
│   ├── gateway/             ← Entrada única (porta 10000)
│   ├── event-bus/           ← Eventos assíncronos (porta 10001)
│   └── request-bus/         ← Request/reply síncrono (porta 10002)
│
├── mss/                     ← Microsserviços (lado a lado)
│   ├── auth/                ← Login, cadastro, senha (3001)
│   ├── user/                ← Perfil de usuário (3002)
│   ├── catalog/             ← Catálogo e categorias (3003)
│   ├── review/              ← Avaliações (3004)
│   ├── history/             ← Histórico de visitas (3005)
│   └── shared/              ← Utilitários legados (em transição)
│
├── shared/                  ← Tipos/helpers do gateway
└── api-shared-config.json   ← Contrato: portas, rotas, eventos
```

---

## Portas

| Serviço | Porta | Descrição |
|---------|-------|-----------|
| Gateway | 10000 | Entrada única para o front-end |
| Event Bus | 10001 | Eventos assíncronos |
| Request Bus | 10002 | Queries síncronas |
| Auth | 3001 | Login e cadastro |
| User | 3002 | Perfil de usuário |
| Catalog | 3003 | Catálogo de produtos |
| Review | 3004 | Avaliações |
| History | 3005 | Histórico de visualizações |

---

## Comunicação

```
Front-end
    │
    ▼ HTTP (tudo pelo Gateway)
Gateway :10000
    ├─► Auth :3001
    ├─► Catalog :3003
    ├─► Review :3004
    └─► History :3005
          ├─► Request Bus :10002  → User / Catalog
          └─► Event Bus :10001    → User / Auth / ...
```

---

## Estrutura interna (NestJS)

Cada MSS em `mss/<servico>/` segue o mesmo padrão:

```
<servico>/
├── nest-cli.json
├── package.json
├── src/
│   ├── main.ts              ← bootstrap NestFactory
│   ├── app.module.ts        ← root module
│   ├── common/              ← config, filters, helpers
│   ├── database/            ← MongooseModule + seed
│   ├── <dominio>/           ← controller + service
│   ├── request-bus/         ← adapter POST /requisicao
│   └── event-bus/           ← adapter POST /eventos + subscribe
└── dist/                    ← build
```

`npm start` → `nest start --watch`

---

## Configuração

[`api-shared-config.json`](./api-shared-config.json) é o contrato único (portas, paths, nomes de eventos/requests).

---

## Banco de Dados

Mesma `MONGO_URI`, databases separados:

| Serviço | dbName |
|---------|--------|
| Auth | `autentification` |
| User | `userProfile` |
| Catalog | `test` |
| Review | `reviews` |
| History | `userProductHistory` |

---

## Ordem de boot

```
1. event-bus
2. request-bus
3. user
4. auth
5. catalog
6. review
7. history
8. gateway
```

Ou: `npm start` na raiz (usa `scripts/start-all.js`).

---

## READMEs

- [Auth](./mss/auth/README.md)
- [User](./mss/user/README.md)
- [Catalog](./mss/catalog/README.md)
- [Review](./mss/review/README.md)
- [History](./mss/history/README.md)
- [Gateway](./infra/gateway/README.md)
- [Event Bus](./infra/event-bus/README.md)
- [Request Bus](./infra/request-bus/README.md)
