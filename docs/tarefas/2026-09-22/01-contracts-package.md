# Pacote `@allforone/contracts`

- **Data:** 2026-09-22
- **Agente/sessão:** modernização contrato compartilhado
- **Branch:** `modernizacao/contracts-package` (base `modernizacao/stack`)
- **Status:** done

## O que foi feito

- Extraído `back-end/api-shared-config.json` para `back-end/packages/contracts` (`@allforone/contracts`)
- Exports CJS/ESM + `index.d.ts`
- 6 MSS Nest: `getAppConfig()` importa o pacote (sem `readFileSync`)
- Infra Nest (gateway, event-bus, request-bus): `getAppConfig()` via pacote
- Front: `config.jsx` importa `@allforone/contracts`
- `scripts/install-all.js` instala o pacote antes dos consumidores
- Removido `back-end/mss/shared/utils/config.js` (morto)
- Rebase/merge com `modernizacao/infra-nest` (Nest + contracts juntos)

## Como foi feito

Dependência `file:../../packages/contracts` (Nest/infra) e `file:../../back-end/packages/contracts` (front).

## Instruções (como operar / validar)

```bash
npm run install:all
npm start
# contrato: import { config } from '@allforone/contracts'
```

## Próximos passos

- Nest `ConfigModule` em cima do pacote (opcional)
- npm workspaces na raiz (opcional)

## Arquivos tocados

- `back-end/packages/contracts/**`
- `back-end/mss/*/src/common/config/app-config.ts` + `package.json`
- `back-end/infra/{gateway,event-bus,request-bus}/**`
- `front-end/project/src/config.jsx` + `package.json`
- `scripts/install-all.js`
- `docs/**`
