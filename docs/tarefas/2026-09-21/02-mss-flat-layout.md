# Layout flat dos MSS (sem pastas de contexto)

- **Data:** 2026-09-21
- **Agente/sessão:** [Nest Catalog](0ba08ff8-8cea-4c67-a741-8a27a51972a8)
- **Branch:** `modernizacao/nestjs-mss-flat` / `modernizacao/stack`
- **Status:** done

## O que foi feito

Reorganização: MSS lado a lado em `back-end/mss/{auth,user,catalog,review,history}` — removidas divisões `Identity/`, `Catalog/`, `Engagment/`.

## Como foi feito

- Moves de pastas (atenção a FS case-insensitive no macOS)
- Ajuste de `scripts/start-all.js` e imports de config
- Documentação de que event/request bus **permanecem em** `back-end/infra/`; módulos Nest só adaptam inscrição/publicação

## Instruções

Não recriar pastas de contexto. Novos serviços: `back-end/mss/<nome>/`.

## Próximos passos

- Ao criar price/comparison/notification, manter o mesmo layout flat

## Arquivos tocados

- `back-end/mss/*`
- `scripts/start-all.js`
