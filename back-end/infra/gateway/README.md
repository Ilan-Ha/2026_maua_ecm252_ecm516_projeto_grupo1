# 🚪 Gateway

**Porta:** `10000`

## O que faz

O Gateway é o **único ponto de entrada** do back-end. O front-end **nunca fala diretamente** com os microsserviços — tudo passa por aqui.

Responsabilidades:
- Receber requisições do front-end
- Rotear para o microsserviço correto
- Formatar e repassar a resposta

## Estrutura

```
gateway/
├── index.ts     ← Servidor Express com todas as rotas e lógica de proxy
└── Gateway.ts   ← Classe auxiliar para registrar e chamar endpoints
```

## Rotas Expostas

### Autenticação
| Método | Rota | Encaminha para |
|--------|------|----------------|
| POST | `/cadastro` | Auth :3001 |
| POST | `/login` | Auth :3001 |
| PUT | `/perfil` | Auth :3001 (atualizar senha) |

### Catálogo
| Método | Rota | Encaminha para |
|--------|------|----------------|
| GET | `/catalogo` | Catalog :3003 |
| GET | `/produto/:id` | Catalog :3003 |

### Reviews
| Método | Rota | Encaminha para |
|--------|------|----------------|
| GET | `/reviews/produto/:produtoId` | Review :3004 |
| POST | `/reviews` | Review :3004 |

### Histórico
| Método | Rota | Encaminha para |
|--------|------|----------------|
| GET | `/historico?authId=...` | History :3005 |
| POST | `/historico` | History :3005 |
| DELETE | `/historico?authId=...` | History :3005 |

### Monitoramento
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/health` | Status geral (back, catalog, db) |
| GET | `/health/db` | Status do banco de dados |

### Rota genérica (legado)
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/requisicao` | Rota genérica para chamadas POST |
| GET | `/requisicao` | Rota genérica para chamadas GET |

## Formato padrão de resposta de erro

```json
{ "message": "Descrição do erro" }
```

## Como iniciar

```bash
cd back-end/infra/gateway
npm install
npm start
```

> ⚠️ Deve ser iniciado **depois** de todos os microsserviços.
