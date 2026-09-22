# Pasta docs + regra Cursor de manutenção

- **Data:** 2026-09-21
- **Agente/sessão:** [Nest Catalog](0ba08ff8-8cea-4c67-a741-8a27a51972a8)
- **Branch:** `modernizacao/stack`
- **Status:** done

## O que foi feito

- Criada pasta raiz `docs/` com docs gerais (estrutura, infra, auth, nestjs, migração) e registro de tarefas do dia
- Regra always-on em `.cursor/rules/docs-maintenance.mdc` para todo agente atualizar docs gerais e `docs/tarefas/`

## Como foi feito

Arquivos markdown + rule `.mdc` com `alwaysApply: true`. Baseline antigo permanece em `.cursor/docs/infra-baseline/`.

## Instruções

Próximo agente: ler `docs/README.md` no início; ao fechar task, seguir o template em `docs/tarefas/README.md`.

## Próximos passos

- Manter docs sincronizados com mudanças reais
- Evitar duplicar secrets

## Arquivos tocados

- `docs/**`
- `.cursor/rules/docs-maintenance.mdc`
