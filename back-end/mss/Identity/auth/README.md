# 🔐 Auth Service

**Porta:** `3001`

## O que faz

Este microsserviço é responsável por tudo relacionado à **autenticação** dos usuários:

- Cadastro (criação de credenciais no banco)
- Login (verificação de email + senha com bcrypt)
- Atualização de senha
- Emissão e recepção de eventos via Event Bus

## Estrutura

```
auth/
├── controller/
│   └── authController.ts   ← Servidor Express completo (rotas + boot)
├── db/
│   └── authDBManager.ts    ← Funções de acesso ao MongoDB
└── entities/
    └── auth.ts             ← Definição do schema e regras da entidade Auth
```

## Rotas HTTP

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/cadastro` | Cria as credenciais do usuário |
| POST | `/login` | Autentica o usuário e retorna nome + email + authId |
| POST | `/perfil/atualizar/senha` | Atualiza a senha do usuário |
| POST | `/eventos` | Recebe eventos do Event Bus (ex: `user.added`) |

## Eventos

### Emite
- `user.create` — após cadastro bem-sucedido (com `authId` e `nome`)

### Escuta
- `user.added` — quando o User service confirma criação do perfil → marca o auth como `usuarioCadastrado: true`

## Comunicação com outros serviços

```
Auth ──► Request Bus ──► User service
         (valida nome, verifica duplicidade)

Auth ──► Event Bus ──► User service
         (dispara user.create após cadastro)
```

## Banco de Dados

- **MongoDB:** banco `autentification`, coleção `auth`
- **Campos:** `email`, `senha_hash`, `usuarioCadastrado`
- **Senha:** armazenada com hash bcrypt (nunca em texto puro)

## Validação

Usa **Zod** para validar:
- Formato de email
- Senha: mínimo 8 caracteres, maiúscula, minúscula, número e caractere especial
- Confirmação de senha igual à senha

## Como iniciar

```bash
cd back-end/mss/Identity/auth
npm install
npm start
```

> ⚠️ Requer `MONGO_URI` definida no `.env` na raiz do projeto.
> ⚠️ Requer que o **Event Bus** e o **Request Bus** estejam rodando primeiro.
