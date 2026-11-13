# AllForOne — arquitetura de microsserviços

Camada ativa da solução (parte 2 do projeto). O monólito legado permanece em `/BACK-END` e `/FRONT-END`.

## Estrutura

```text
arquitetura-microservicos/
├── api-shared-config.json   # contrato compartilhado (ports, paths, k8s)
├── back-end/                # MSS Node: gateway, buses, auth, user, review, history
│                            # catalog Node é legado de referência (deploy usa Dart)
├── dart_back_end/
│   └── catalog/             # MSS Dart de catálogo (produção / Docker / K8s)
├── front_mobile/            # App Flutter (acesso a todas as APIs via gateway)
└── front-end/               # Micro-frontends React (opcional / legado MSS)
```

## Fluxo

```text
React (FRONT-END) ─┐
                   ├─► API Gateway ─► auth | user | catalog(Dart) | review | history
Flutter (front_mobile) ─┘              ↕ event-bus / request-bus
```

## Subir localmente

- Sem cluster: `scripts/start-all.sh` (Node) + Flutter apontando para `http://localhost:10000`
- Com Docker/K8s: ver seção no README da raiz (`create-all-images.sh`, `k8s-apply.sh`)

Gateway é a **única** porta pública para os fronts.
