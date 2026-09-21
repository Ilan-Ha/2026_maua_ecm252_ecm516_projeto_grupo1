# NestJS no Catalog + limpeza modular

- **Data:** 2026-09-21
- **Agente/sessão:** [Nest Catalog](0ba08ff8-8cea-4c67-a741-8a27a51972a8)
- **Branch:** `modernizacao/stack` (trabalho base)
- **Status:** done

## O que foi feito

Migração do MSS Catalog de Express para NestJS com pastas limpas (`src/`, domain module, database, common helpers), mantendo contrato HTTP esperado pelo gateway.

## Como foi feito

- Scaffold Nest em `back-end/mss/catalog`
- Controllers/services/schemas Mongoose alinhados às rotas `/catalogo` e `/produto`
- Remoção gradual do código Express legado da pasta do serviço
- Build (`nest build`) e subida via `npm start` / `start:prod`

## Instruções

```bash
npm --prefix back-end/mss/catalog run build
npm --prefix back-end/mss/catalog start
# ou stack completa: npm start
curl -s http://localhost:10000/catalogo | head
```

## Próximos passos

- Extrair preço/lojas para Price/Offer (`modernizacao/02-price-offer-catalog`)
- Manter Catalog slim conforme plano de domínio

## Arquivos tocados

- `back-end/mss/catalog/**`
