# Migração de domínio

Plano detalhado: [`docs/planos/migracao-mss-nestjs.md`](./planos/migracao-mss-nestjs.md).

## Alvo (fase 1)

Catalog (slim) · Price/Offer · Comparison · User/Account · Notification (só eventos)

## Já feito (parcial)

- Contrato `api-shared-config.json` com portas/paths/ownership reservados
- MSS atuais em Nest + layout flat
- Auth Bearer (access/refresh)
- Branches `modernizacao/*` a partir de `modernizacao/stack`

## Ainda não implementado como serviço

- Price/Offer (extrair preço do catalog)
- Comparison API (hoje lógica em `Busca.jsx`)
- Merge User/Account (favoritos, listas)
- Notification consumer
- Front de notification (explicitamente fora de escopo por agora)

## Branches

Ver tabela em [estrutura-projeto.md](./estrutura-projeto.md).
