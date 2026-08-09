# ⚙️ Back-end — AllForOne

Arquitetura de **microsserviços** com Node.js + TypeScript + MongoDB.

---

## 📁 Estrutura de Pastas

```
back-end/
│
├── infra/                   ← Infraestrutura de comunicação entre serviços
│   ├── gateway/             ← Ponto de entrada único (porta 10000)
│   ├── event-bus/           ← Comunicação assíncrona por eventos (porta 10001)
│   └── request-bus/         ← Comunicação síncrona request/reply (porta 10002)
│
├── mss/                     ← Microsserviços de domínio (negócio)
│   ├── Identity/
│   │   ├── auth/            ← Autenticação: login, cadastro, senha (porta 3001)
│   │   └── user/            ← Perfil de usuário (porta 3002)
│   ├── Catalog/
│   │   └── catalog/         ← Catálogo de produtos e categorias (porta 3003)
│   └── Engagment/
│       ├── review/          ← Avaliações de produtos (porta 3004)
│       └── history/         ← Histórico de produtos visitados (porta 3005)
│
├── shared/                  ← Código TypeScript compartilhado entre serviços
│   ├── interfaces/          ← Interfaces e tipos compartilhados
│   ├── types/               ← Enums e tipos auxiliares
│   └── utils/               ← Funções utilitárias (gateway, etc.)
│
└── api-shared-config.json   ← Contrato central: portas, rotas e nomes de eventos
```

---

## 🌐 Portas

| Serviço | Porta | Descrição |
|---------|-------|-----------|
| Gateway | 10000 | Entrada única para o front-end |
| Event Bus | 10001 | Eventos assíncronos entre serviços |
| Request Bus | 10002 | Queries síncronas entre serviços |
| Auth | 3001 | Login e cadastro |
| User | 3002 | Perfil de usuário |
| Catalog | 3003 | Catálogo de produtos |
| Review | 3004 | Avaliações |
| History | 3005 | Histórico de visualizações |

---

## 🔄 Como os serviços se comunicam

```
Front-end
    │
    ▼ HTTP (tudo vai pelo Gateway)
Gateway :10000
    │
    ├─► Auth :3001      (login, cadastro, senha)
    ├─► Catalog :3003   (categorias, produtos)
    ├─► Review :3004    (avaliações)
    └─► History :3005   (histórico)
          │
          ├─► Request Bus :10002  (perguntas síncronas)
          │         └─► User :3002 / Catalog :3003
          │
          └─► Event Bus :10001   (eventos assíncronos)
                    └─► User :3002 / Auth :3001
```

---

## 📋 Cada serviço tem a mesma estrutura interna

```
<servico>/
├── controller/   → Servidor Express completo (rotas + boot + shutdown)
├── db/           → Conexão com MongoDB e funções de acesso ao banco
└── entities/     → Schemas, regras de validação da entidade
```

---

## ⚙️ Configuração Centralizada

O arquivo [`api-shared-config.json`](./api-shared-config.json) é o **contrato único** do projeto.  
Contém todas as portas, rotas e nomes de eventos — nunca use strings hardcoded no código.

```js
// Exemplo de uso nos serviços:
import config from "../../../shared/utils/config.js"

const PORT = config.ports.back.auth           // → 3001
const EVENT_BUS = `${config.url}:${config.ports.back.eventBus}${config.paths.events.event}`
```

---

## 🗄️ Banco de Dados

Todos os serviços usam **MongoDB** (via Mongoose) com a mesma `MONGO_URI`, mas em bancos separados:

| Serviço | dbName |
|---------|--------|
| Auth | `autentification` |
| User | `userProfile` |
| Catalog | `test` |
| Review | `reviews` |
| History | `userProductHistory` |

---

## 🚀 Ordem de Inicialização

Sempre iniciar nesta ordem para evitar erros de conexão:

```
1. event-bus      ← todos os outros dependem dele no boot
2. request-bus    ← auth e history dependem dele
3. user           ← precisa do event-bus e request-bus
4. auth           ← precisa do event-bus, request-bus e user
5. catalog        ← precisa do event-bus
6. review         ← independente (só usa event-bus)
7. history        ← precisa de user, catalog, request-bus
8. gateway        ← iniciar por último (ponto de entrada do front)
```

---

## 📄 READMEs individuais

Cada serviço tem seu próprio README com detalhes de rotas, eventos e banco:

- [Auth README](./mss/Identity/auth/README.md)
- [User README](./mss/Identity/user/README.md)
- [Catalog README](./mss/Catalog/catalog/README.md)
- [Review README](./mss/Engagment/review/README.md)
- [History README](./mss/Engagment/history/README.md)
- [Gateway README](./infra/gateway/README.md)
- [Event Bus README](./infra/event-bus/README.md)
- [Request Bus README](./infra/request-bus/README.md)
