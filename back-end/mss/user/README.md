# User Service (NestJS)

**Porta:** `3002`

## O que faz

Gerencia o **perfil de usuário** (separado das credenciais do Auth):

- Cria perfil ao receber `user.create`
- Recuperação via `user.re.register`
- Responde queries do Request Bus

Não expõe rotas de negócio públicas ao front — só buses.

## Estrutura

```
user/
├── nest-cli.json
├── package.json
├── tsconfig.json
├── README.md
└── src/
    ├── main.ts
    ├── app.module.ts
    ├── common/
    ├── database/
    ├── user/            # service, schema, repository
    ├── event-bus/       # POST /eventos + subscribe
    └── request-bus/     # POST /requisicao
```

## Rotas HTTP

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/eventos` | Callback do Event Bus |
| POST | `/requisicao` | Queries do Request Bus |

## Eventos

### Escuta
- `user.create` → cria usuário + publica `user.added`
- `user.re.register` → recuperação de cadastro incompleto

### Emite
- `user.added`

## Request Bus

| Request | Descrição |
|---------|-----------|
| `user.name.validate` | Valida formato do nome |
| `user.name.exists` | Verifica se o nome já existe |
| `user.name.tell` | Retorna nome + userId por authId |
| `user.exist` | Verifica existência por userId |
| `user.byAuthId` | Resolve userId por authId |

Respostas: `{ values: result }`.

## Banco

- MongoDB, database `userProfile`, coleção `user`
- Campos: `authId` (ObjectId unique), `nome` (unique)

## Como iniciar

```bash
cd back-end/mss/user
npm install
npm start
```

> Requer `MONGO_URI` no `.env`. Event Bus e Request Bus devem estar disponíveis.
