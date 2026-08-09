# 👤 User Service

**Porta:** `3002`

## O que faz

Este microsserviço gerencia os **dados de perfil** dos usuários (separado das credenciais de login, que ficam no Auth service):

- Criação do perfil após cadastro (disparada por evento)
- Consulta de dados do usuário
- Verificação de duplicidade de nome
- Validação de nome
- Resolução de `userId` a partir de `authId`

## Estrutura

```
user/
├── controller/
│   └── userController.ts   ← Servidor Express completo (rotas + boot)
├── db/
│   └── userDBManager.ts    ← Funções de acesso ao MongoDB
└── entities/
    └── user.ts             ← Definição do schema e regras da entidade User
```

## Rotas HTTP

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/eventos` | Recebe eventos do Event Bus |
| POST | `/requisicao` | Responde a queries do Request Bus |

> **Atenção:** este serviço não tem rotas públicas acessíveis pelo front-end. Ele só conversa com a infra (Event Bus e Request Bus).

## Eventos

### Escuta
- `user.create` → cria o perfil do usuário no MongoDB e emite `user.added`
- `user.re.register` → recuperação quando o cadastro falhou parcialmente

### Emite
- `user.added` → confirma que o perfil foi criado (Auth escuta isso para marcar `usuarioCadastrado: true`)

## Requisições (Request Bus)

Responde a estas queries via Request Bus:

| Request | Descrição |
|---------|-----------|
| `user.name.validate` | Valida se o nome é aceitável (formato) |
| `user.name.exists` | Verifica se o nome já está em uso |
| `user.name.tell` | Retorna o nome do usuário dado um `authId` |
| `user.exist` | Verifica se um usuário existe dado um `userId` |
| `user.byAuthId` | Retorna o `userId` dado um `authId` |

## Banco de Dados

- **MongoDB:** banco `userProfile`, coleção `user`
- **Campos:** `authId` (referência ao Auth), `nome`

## Como iniciar

```bash
cd back-end/mss/Identity/user
npm install
npm start
```

> ⚠️ Requer `MONGO_URI` definida no `.env`.
> ⚠️ Requer **Event Bus** e **Request Bus** rodando primeiro.
