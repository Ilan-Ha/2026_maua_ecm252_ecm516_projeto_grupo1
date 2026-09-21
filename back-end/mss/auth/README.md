# Auth Service (NestJS)

**Porta:** `3001`

## O que faz

Responsável pela **autenticação**:

- Cadastro de credenciais (bcrypt + Zod)
- Login
- Atualização de senha
- Event Bus: escuta `user.added` e marca `usuarioCadastrado`

## Estrutura

```
auth/
├── nest-cli.json
├── package.json
├── tsconfig.json
├── README.md
└── src/
    ├── main.ts
    ├── app.module.ts
    ├── common/
    ├── database/
    ├── auth/           # HTTP + schema + repository
    └── event-bus/      # POST /eventos + subscribe
```

## Rotas HTTP

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/cadastro` | Cria credenciais e publica `user.create` |
| POST | `/login` | Autentica e retorna `{ nome, email, authId }` |
| POST | `/perfil/atualizar/senha` | Atualiza senha |
| POST | `/eventos` | Callback do Event Bus |

Body das rotas de negócio usa wrapper `{ payload: { ... } }`.

## Eventos

### Emite
- `user.create` — após cadastro
- `user.re.register` — login com cadastro incompleto

### Escuta
- `user.added` — marca `usuarioCadastrado: true`

## Request Bus (cliente)

| Request | Uso |
|---------|-----|
| `user.name.validate` | Valida formato do nome |
| `user.name.exists` | Verifica duplicidade |
| `user.name.tell` | Obtém nome no login |

## Banco

- MongoDB, database `autentification`, coleção `auth`
- Campos: `email`, `senha_hash`, `senha` (legado), `usuarioCadastrado`
- Pre-save: hash bcrypt em `senha_hash`

## Como iniciar

```bash
cd back-end/mss/auth
npm install
npm start
```

> Requer `MONGO_URI` no `.env`. Event Bus e Request Bus devem estar disponíveis.
