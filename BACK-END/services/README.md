# Microserviços — AllForOne

## Portas (`api-shared-config.json`)

| Serviço   | Pasta              | Porta | Comando |
|-----------|--------------------|-------|---------|
| Gateway   | `services/gateway` | 3000  | `npm run start:gateway` (na pasta BACK-END) |
| Legacy    | `back.js`          | 3010  | `npm run start:legacy` — auth, user, health |
| Catalog   | `services/catalog` | 3003  | `npm run start:catalog` |
| Auth      | `services/auth`    | 3001  | (em breve) |
| User      | `services/user`    | 3002  | (em breve) |
| Search    | `services/search`  | 3004  | (em breve) |

O **front** fala só com o gateway (`http://localhost:3000`).

## Como rodar (catalog funcional)

Abra **3 terminais** na pasta `BACK-END` (com `.env` na raiz do repo com `MONGO_URI`):

```bash
npm run install:all   # primeira vez

# Terminal 1 — catálogo + produtos
npm run start:catalog

# Terminal 2 — login, cadastro, perfil
npm run start:legacy

# Terminal 3 — API Gateway (proxy)
npm run start:gateway
```

Front: `cd FRONT-END/project && npm run dev`

## Rotas do catalog-service (3003)

- `GET /catalogo` — lista categorias e itens
- `GET /produto/:id` — detalhe do produto
- `GET /health` — status do serviço

O gateway repassa `/catalogo` e `/produto/*` para o catalog; demais rotas vão para o legacy (3010).

## Migração

- `productDatabaseManager.js` → lógica em `services/catalog/src/`
- `back.js` → apenas auth/user (legacy) até auth/user virarem MSS
