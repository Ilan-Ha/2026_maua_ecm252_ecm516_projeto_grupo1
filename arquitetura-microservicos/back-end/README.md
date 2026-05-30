# Back-end — Microserviços AllForOne

## Portas

| Serviço | Porta |
|---------|-------|
| Gateway (entrada do front) | 10000 |
| Event-bus | 10001 |
| Request-bus | 10002 |
| Auth | 3001 |
| User | 3002 |
| Catalog | 3003 |

O front (`FRONT-END/project`) fala **somente** com o gateway: `http://localhost:10000`

## Setup

1. Copie o `.env` da raiz do repositório para esta pasta:
   ```bash
   cp ../../.env .env
   ```
   Ou crie `.env` com `MONGO_URI=...`

2. Instale dependências:
   ```bash
   npm run install:all
   ```

3. Suba todos os serviços:
   ```bash
   npm start
   ```

4. Em outro terminal, suba o front:
   ```bash
   cd ../../FRONT-END/project
   npm run dev
   ```

## Ordem de startup (automática no `npm start`)

1. event-bus → request-bus → user → auth → catalog → gateway

## Rotas expostas pelo gateway

- `GET /catalogo`, `GET /produto/:id` → catalog
- `POST /cadastro`, `POST /login` → auth (adaptado para o front)
- `PUT /perfil` → auth (senha)
- `POST /requisicao` → fluxo MSS nativo
- `GET /health`, `GET /health/db`

## Monólito legado

`BACK-END/back.js` na raiz do repo está **depreciado**. Use esta pasta.
