# Integração FE com stack Nest (sem notification)

- **Data:** 2026-09-21
- **Agente/sessão:** [Nest Catalog](0ba08ff8-8cea-4c67-a741-8a27a51972a8)
- **Branch:** `modernizacao/stack`
- **Status:** done (catálogo/login/histórico/reviews via gateway)

## O que foi feito

Validação de que o front continua falando só com o gateway e que os MSS Nest respondem. Notification não existe no FE e não foi exigido.

## Como foi feito

- `npm start` (concurrently)
- Correção pontual de portas no config (auth 3001, user 3002, history 3005) quando apontavam errado
- Smoke manual das rotas usadas pelo front

## Instruções

Front: `http://localhost:5173` → API `http://localhost:10000`.

## Próximos passos

- Auth Bearer (task 06) substitui sessão só-localStorage
- Cold start: aguardar catalog antes do primeiro fetch se necessário

## Arquivos tocados

- config compartilhado / gateway (ajustes de porta)
- smoke operacional (sem feature FE nova de notification)
