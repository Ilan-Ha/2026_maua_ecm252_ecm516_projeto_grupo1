# NestJS nos MSS

## Padrão de pasta (por serviço)

```
back-end/mss/<servico>/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── <dominio>/          # module, controller, service, schemas, repos
│   ├── database/
│   ├── event-bus/          # adapter Nest → infra event-bus (não é o bus em si)
│   └── common/             # config, filters, helpers
├── package.json
└── dist/                   # build
```

## Conceitos usados aqui

- **Module** — agrupa providers/controllers
- **Controller** — HTTP do MSS (chamado pelo gateway, não pelo browser)
- **Service** — regra de negócio
- **Schema/Repository** — Mongo via Mongoose
- Envelope de resposta legado (`erro` / `sucesso`) mantido para o gateway parsear

## Serviços Nest ativos

`auth`, `user`, `catalog`, `review`, `history` — todos sobem via `npm start` na raiz.

## Canvas / ilustração

Se existir artefato Canvas Nest no Agent Store da sessão, use como apoio visual; a fonte operacional é este doc + código em `src/`.
