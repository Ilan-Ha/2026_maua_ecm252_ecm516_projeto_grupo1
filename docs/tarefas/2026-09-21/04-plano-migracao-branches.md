# Plano migração domínio + branches modernizacao/*

- **Data:** 2026-09-21
- **Agente/sessão:** [Nest Catalog](0ba08ff8-8cea-4c67-a741-8a27a51972a8)
- **Branch base:** `modernizacao/stack`
- **Status:** partial

## O que foi feito

- Leitura/avanço do plano `migracao_mss_nestjs_18a42fc8.plan.md` **sem** voltar a pastas de contexto
- Atualização do contrato (`api-shared-config.json`: paths, events, ownership, portas reservadas)
- Criação das branches:
  - `modernizacao/01-contrato-config`
  - `modernizacao/02-price-offer-catalog`
  - `modernizacao/03-comparison-api`
  - `modernizacao/04-user-account`
  - `modernizacao/05-notification`
  - `modernizacao/nestjs-mss-flat`

## Como foi feito

Branches a partir de `modernizacao/stack`. Implementação completa dos 5 núcleos **não** foi feita nesta sessão — só preparação de contrato + branches.

## Instruções

```bash
git checkout modernizacao/stack
git checkout modernizacao/02-price-offer-catalog   # etc.
```

## Próximos passos

- Implementar Price/Offer e slim Catalog
- Comparison API + mover lógica de `Busca.jsx`
- User/Account unificado
- Notification só-consumidor
- **Não** implementar UI de notification no front por agora

## Arquivos tocados

- `back-end/api-shared-config.json`
- `docs/migracao-dominio.md`
- branches git locais
