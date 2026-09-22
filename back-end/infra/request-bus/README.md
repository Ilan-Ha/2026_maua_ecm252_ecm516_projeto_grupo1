# 🔄 Request Bus

**Porta:** `10002`

## O que faz

O Request Bus é o **barramento de queries síncronas** entre microsserviços.

Quando um serviço precisa de uma **resposta imediata** de outro serviço (ex: "esse usuário existe?"), ele usa o Request Bus como intermediário.

**Analogia:** funciona como uma ligação telefônica. Você liga (faz a pergunta), espera, e recebe a resposta antes de continuar.

**Diferença do Event Bus:** no Event Bus você dispara e não espera. No Request Bus você espera a resposta para continuar.

## Como funciona

```
Auth pergunta: request="user.name.validate", payload={ nome: "Arthur" }
    │
    ▼
Request Bus verifica qual serviço responde "user.name.validate"
    │
    └──► POST http://localhost:3002/requisicao  ← User service processa
              ↑ espera resposta
Auth recebe: { error: false }
```

## Rota HTTP

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/requisicao` | Encaminha a query para o serviço responsável e retorna a resposta |

## Body da requisição

```json
{
  "request": "user.name.validate",
  "payload": { "nome": "Arthur" }
}
```

## Queries mapeadas

| Request | Encaminha para |
|---------|----------------|
| `user.name.exists` | User :3002 |
| `user.name.validate` | User :3002 |
| `user.name.tell` | User :3002 |
| `user.exist` | User :3002 |
| `user.byAuthId` | User :3002 |
| `catalog.product.exist` | Catalog :3003 |

> Os nomes das queries ficam centralizados em `api-shared-config.json` — nunca use strings hardcoded.

## Como iniciar

```bash
cd back-end/infra/request-bus
npm install
npm start
```

> ⚠️ Deve iniciar **antes** dos microsserviços que o usam (Auth, History).
