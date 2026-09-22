# Documentação AllForOne

Índice para humanos e agentes Cursor. Leia isto antes de alterar o projeto.

## Docs gerais (comece aqui)

| Doc | Quando ler |
|-----|------------|
| [estrutura-projeto.md](./estrutura-projeto.md) | Visão de pastas, MSS, front e contratos |
| [infra.md](./infra.md) | Gateway, buses, portas, start, console de logs |
| [auth.md](./auth.md) | Sessão Bearer (access + refresh), guards FE |
| [nestjs.md](./nestjs.md) | Como os MSS Nest estão organizados |
| [migracao-dominio.md](./migracao-dominio.md) | Plano de domínio (price/comparison/notification) e branches |

Baseline antigo de infra (jun/2026) ainda em [`.cursor/docs/infra-baseline/`](../.cursor/docs/infra-baseline/) — útil como histórico; o estado atual é `docs/infra.md`.

## Tarefas por data / agente

Registro do que foi feito em cada sessão:

- [tarefas/README.md](./tarefas/README.md) — convenção e template
- [tarefas/2026-09-21/](./tarefas/2026-09-21/) — Nest, auth Bearer, logs console
- [tarefas/2026-09-22/](./tarefas/2026-09-22/) — Pacote `@allforone/contracts`

## Como agentes devem atualizar

Regra obrigatória: [`.cursor/rules/docs-maintenance.mdc`](../.cursor/rules/docs-maintenance.mdc).

Resumo:

1. Ao **terminar uma task**, criar/atualizar arquivo em `docs/tarefas/YYYY-MM-DD/`.
2. Se a mudança alterar arquitetura, portas, auth ou layout de pastas → atualizar o doc geral correspondente em `docs/`.
3. Não documentar segredos (`.env`, tokens, URI com senha).

## Comandos rápidos

```bash
# sobe buses + MSS (incl. logs) + gateway + site + console de logs
npm start

# build de um MSS Nest
npm --prefix back-end/mss/catalog run build
```

- Gateway: `http://localhost:10000`
- Front (Vite): `http://localhost:5173`
- Logs console: `http://localhost:5174`
- Contrato compartilhado: `@allforone/contracts` (`back-end/packages/contracts`)
