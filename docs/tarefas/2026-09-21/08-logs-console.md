# Console de logs (MSS + UI)

- **Data:** 2026-09-21
- **Agente/sessão:** [Nest Catalog](0ba08ff8-8cea-4c67-a741-8a27a51972a8)
- **Branch:** `modernizacao/logs-console`
- **Status:** done

## O que foi feito

Console estilo CloudWatch em app Vite separado (`front-end/logs` :5174), MSS Nest `logs` (:3009) para query, collection Mongo `allforone_logs.app_logs` com TTL, instrumentação em MSS de domínio e infra (gateway, event-bus, request-bus).

## Como foi feito

- Writer compartilhado + middleware Express em `back-end/shared/logging/`
- Kit Nest (`AppLoggingModule`, interceptor HTTP, `@AuditLog`, filter) em cada `src/common/logging/`
- Gateway proxy `GET /logs` e `GET /logs/:id` + correlation id
- `npm start` sobe `logs` + `logui`

## Instruções

```bash
npm start
# abrir http://localhost:5174
# gerar tráfego no site (:5173) e ver abas gateway/auth/...
```

Env: `LOG_ENABLED`, `LOG_TTL_DAYS`, `LOG_MONGO_DB`.

## Próximos passos

- Auth na UI de logs
- SSE em vez de poll
- Unificar kit Nest via package sem cópia por serviço

## Arquivos tocados

- `back-end/mss/logs/**`, `back-end/shared/logging/**`
- `back-end/mss/*/src/common/logging/**`, filters, app.module
- `back-end/infra/gateway/**`, event-bus, request-bus
- `front-end/logs/**`
- `scripts/start-all.js`, `install-all.js`
- `back-end/api-shared-config.json`, `.env.example`
- `docs/**`
