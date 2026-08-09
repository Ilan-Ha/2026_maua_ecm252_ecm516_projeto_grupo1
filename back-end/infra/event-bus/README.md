# 📡 Event Bus

**Porta:** `10001`

## O que faz

O Event Bus é o **barramento de eventos assíncronos** do sistema.

Permite que microsserviços se comuniquem **sem precisar saber o endereço um do outro** — eles publicam um evento e o Event Bus entrega para todos que estiverem inscritos.

**Analogia:** funciona como um grupo de WhatsApp. Quem quer receber um tipo de mensagem entra no grupo (inscrição). Quem quer enviar posta no grupo (publicação). O Event Bus faz a entrega para todos os membros.

## Como funciona

```
Auth publica: event="user.create", payload={ authId, nome }
    │
    ▼
Event Bus verifica quem está inscrito em "user.create"
    │
    └──► POST http://localhost:3002/eventos  ← User service recebe
```

## Rotas HTTP

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/inscricao` | Serviço se inscreve para receber um ou mais eventos |
| POST | `/desinscricao` | Serviço cancela inscrição |
| POST | `/eventos` | Publica um evento para todos os inscritos |
| GET | `/dados` | Debug — mostra todos os eventos e inscritos |

## Como um serviço se inscreve (boot)

Ao iniciar, cada microsserviço envia:
```json
POST /inscricao
{
  "serviceName": "user",
  "calbackUrl": "http://localhost:3002/eventos",
  "events": ["user.create", "user.re.register"]
}
```

## Eventos existentes no projeto

| Evento | Quem publica | Quem escuta |
|--------|-------------|-------------|
| `user.create` | Auth | User |
| `user.added` | User | Auth |
| `user.re.register` | Auth | User |
| `review.created` | Review | *(ninguém ainda)* |

## Como iniciar

```bash
cd back-end/infra/event-bus
npm install
npm start
```

> ⚠️ Deve ser o **primeiro** serviço a iniciar — todos os outros dependem dele para se inscrever no boot.
