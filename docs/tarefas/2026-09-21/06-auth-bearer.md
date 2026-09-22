# Auth Bearer (access + refresh + guards)

- **Data:** 2026-09-21
- **Agente/sessão:** [Nest Catalog](0ba08ff8-8cea-4c67-a741-8a27a51972a8)
- **Branch:** `modernizacao/stack`
- **Status:** done

## O que foi feito

Modernização da sessão: de `localStorage` só com `{nome,email,authId}` para **JWT Bearer** com access (TTL) + refresh (TTL, Mongo `refresh_tokens`), gateway `requireAuth`, e FE com `AuthProvider` / `apiFetch` / `RequireAuth`.

Telas dependentes de login: histórico, perfil/user, criar review.

## Como foi feito

**Backend auth Nest**

- `TokenService` (sign/verify access+refresh)
- `RefreshTokenRepository` + schema
- Login/refresh emitem sessão; logout revoga jti
- Rotas: `POST /auth/refresh`, `POST /auth/logout`

**Gateway**

- `auth.ts` → `requireAuth` valida Bearer access
- Login/refresh devolvem `sessionFromContent`
- Protegidos: PUT perfil, POST reviews, GET/POST/DELETE histórico

**Front**

- `src/auth/session.js`, `api.js`, `AuthContext.jsx`, `RequireAuth.jsx`
- Login salva tokens; `apiFetch` faz refresh em 401
- App: `/historico` e `/perfil` com `RequireAuth`
- `ReviewSection` / `DetalhesProduto` / `Historico` / `Perfil` usam `apiFetch`

**Ops**

- `.env`: `JWT_SECRET`, `JWT_ACCESS_TTL`, `JWT_REFRESH_TTL` (corrigido merge acidental URI+secret na mesma linha)

## Instruções

```bash
# .env na raiz com JWT_SECRET
npm start

# cadastro → aguardar user.added (~1–2s) → login
curl -s -X POST http://localhost:10000/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"...","senha":"..."}'
# deve retornar accessToken + refreshToken + expiresIn

curl -s http://localhost:10000/historico   # 401
curl -s http://localhost:10000/historico -H "Authorization: Bearer <access>"
```

Smoke validado (2026-09-21): login via gateway OK; histórico 401 sem token / 200 com token; refresh OK; logout revoga refresh (refresh seguinte 401).

## Próximos passos

- Opcional: retry de login no FE se `usuarioCadastrado` ainda false (race do event bus)
- Unificar User/Account (plano) sem quebrar Bearer
- Não logar tokens em docs/CI

## Arquivos tocados

- `back-end/mss/auth/src/auth/token.service.ts`, `auth.service.ts`, schemas refresh
- `back-end/infra/gateway/auth.ts`, `index.ts`
- `back-end/api-shared-config.json` (paths refresh/logout)
- `front-end/project/src/auth/*`
- `front-end/project/src/App.jsx`, `Login.jsx`, `Header.jsx`, `Historico.jsx`, `Perfil.jsx`, `ReviewSection.jsx`, `DetalhesProduto.jsx`
- `.env` / `.env.example`
- `docs/auth.md`
