# Auth — Bearer access + refresh

## Antes (legado)

Sessão = `localStorage.usuario` com `{ nome, email, authId }`, **sem token**. Front “parecia” logado; APIs confiavam em IDs mandados no body.

## Agora

| Token | TTL default | Onde | Uso |
|-------|-------------|------|-----|
| Access | `JWT_ACCESS_TTL` (15m) | `localStorage` `allforone_access_token` | `Authorization: Bearer` |
| Refresh | `JWT_REFRESH_TTL` (7d) | `allforone_refresh_token` | `POST /auth/refresh` / logout |

Emitidos pelo Nest `back-end/mss/auth` (`TokenService` + `RefreshTokenRepository`).

### Fluxo login

1. `POST /login` → gateway → auth Nest
2. Resposta: `{ usuario, accessToken, refreshToken, expiresIn, tokenType }`
3. Front `AuthContext.loginSession` / `saveSession`

### Refresh automático

`apiFetch` (`front-end/project/src/auth/api.js`): em 401 tenta refresh uma vez e reenvia a request.

### Guards FE

- `RequireAuth` em `/historico` e `/perfil`
- Review: formulário só se autenticado; `POST /reviews` via `apiFetch`
- Detalhes produto: grava histórico só com sessão válida

### Logout

`POST /auth/logout` com `refreshToken` → revoga jti no Mongo → `clearSession`.

## Variáveis

```
JWT_SECRET=...
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=7d
```

Gateway e auth **devem** compartilhar o mesmo `JWT_SECRET`.
