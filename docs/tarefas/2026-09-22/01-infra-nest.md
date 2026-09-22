# Infra NestJS (gateway + buses)

- **Data:** 2026-09-22
- **Agente/sessão:** modernização infra Nest (opção B)
- **Branch:** `modernizacao/infra-nest` (base `modernizacao/stack`)
- **Status:** done

## O que foi feito

Migrados os três processos de infra para NestJS, mantendo os contratos HTTP atuais:

- `back-end/infra/event-bus` — `EventBusService` + `POST /inscricao|/desinscricao|/eventos`, `GET /dados`; campo wire `calbackUrl` preservado
- `back-end/infra/request-bus` — registry tipado dos `requests.*` + `POST /requisicao` (último JS → Nest)
- `back-end/infra/gateway` — módulos Auth/Catalog/Review/History/User/Logs/Health + `ProxyService` + `BearerAuthGuard` + correlation/`app_logs`

Código Express/JS anterior arquivado em `_legacy/` de cada pasta. `npm start` / `install-all` continuam apontando para as mesmas pastas (`nest start --watch`).

## Como foi feito

Padrão alinhado aos MSS Nest (`main.ts`, `app.module.ts`, config via `api-shared-config.json`, middleware de logging). Builds: `npm run build` verde nos três. Smoke local: health, catálogo, cadastro→login Bearer, `GET /historico`, event-bus `/dados`, request-bus `user.name.validate`.

## Instruções (como operar / validar)

```bash
npm start
# Gateway http://localhost:10000
curl -s http://localhost:10000/health
curl -s http://localhost:10000/catalogo
# login + Authorization: Bearer <accessToken> em /historico
```

## Próximos passos

- Remover `_legacy/` após estabilizar a branch no stack
- Broker Redis/NATS (fora de escopo desta task)
- Notification ainda só via eventos (sem rota no gateway)

## Arquivos tocados

- `back-end/infra/event-bus/**` (Nest + `_legacy/`)
- `back-end/infra/request-bus/**` (Nest + `_legacy/`)
- `back-end/infra/gateway/**` (Nest + `_legacy/`)
- `docs/infra.md`, `docs/estrutura-projeto.md`, `docs/README.md`, `docs/tarefas/**`
