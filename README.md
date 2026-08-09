# 🛒 AllForOne — Plataforma de Comparação e Reviews de Produtos

![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Backend-3178C6?logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb)
![Microservices](https://img.shields.io/badge/Architecture-Microservices-blue)
![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-orange)

Aplicação web desenvolvida durante as disciplinas **ECM252** e **ECM516** do **Instituto Mauá de Tecnologia**, com foco em desenvolvimento web full stack, persistência de dados, integração entre front-end e back-end e arquitetura baseada em microsserviços.

---

# 📌 Objetivo

O **AllForOne** tem como objetivo auxiliar usuários na escolha de produtos por meio da consulta e comparação de informações relevantes, reunindo em um único ambiente:

- Categorias de produtos
- Especificações técnicas
- Preço médio
- Marca e categoria
- Imagens e links de compra
- Comparação de especificações entre produtos
- Histórico de navegação persistido por usuário
- Sistema de avaliações (reviews) por estrelas e comentários
- Cadastro e autenticação de usuários

---

# 🌐 Funcionalidades

## 👤 Usuários e Autenticação
- Cadastro de novos usuários
- Login com autenticação via email e senha
- Validação de formato de e-mail e força da senha com **Zod**
- Criptografia de senha utilizando **bcrypt**
- Perfil do usuário logado
- Persistência de sessão utilizando **MongoDB** no back-end e **localStorage** no front-end (`authId`, `email`, `nome`)

---

## 🛍️ Catálogo de Produtos
- Listagem de categorias
- Filtro de produtos por categoria
- Página de detalhes do produto com especificações completas
- Integração com os microsserviços de Reviews e Histórico

---

## ⚖️ Comparação de Produtos
- Seleção dinâmica de categoria
- Comparação lado a lado entre produtos
- Destaque visual do preço médio e especificações técnicas

---

## 🕘 Histórico de Navegação Persistido
- Persistência automática das visualizações de produtos no **MongoDB** para usuários logados
- Fallback automático para `localStorage` caso o usuário não esteja logado ou esteja offline
- Indicador visual **💾 Sincronizado** na tela de histórico
- Limite dos últimos 50 produtos visualizados por usuário
- Opção para limpar todo o histórico (com deleção em cascata no banco e local)

---

## ⭐ Avaliações e Reviews
- Sistema de avaliação por estrelas (1 a 5) e comentários por produto
- Cálculo automático da média de estrelas e quantidade total de avaliações
- Atualização em tempo real após envio de novas avaliações

---

## 🟢 Monitoramento e Health Check
- Indicador visual de status no cabeçalho (Front-end, Back-end e Banco de Dados)
- Rotas dedicadas `/health` e `/health/db` expostas pelo Gateway

---

# 🧱 Arquitetura do Sistema

O projeto é estruturado em uma **Arquitetura de Microsserviços**:

```text
2026_maua_ecm252_ecm516_projeto_grupo1/
│
├── FRONT-END/project/      ← Aplicação SPA em React + Vite
│
├── back-end/
│   ├── infra/
│   │   ├── gateway/        ← Ponto de entrada único (Porta 10000)
│   │   ├── event-bus/      ← Barramento de Eventos Assíncronos (Porta 10001)
│   │   └── request-bus/    ← Barramento de Requisições Síncronas (Porta 10002)
│   │
│   ├── mss/
│   │   ├── Identity/
│   │   │   ├── auth/       ← Serviço de Autenticação (Porta 3001)
│   │   │   └── user/       ← Serviço de Perfil de Usuário (Porta 3002)
│   │   ├── Catalog/
│   │   │   └── catalog/    ← Serviço de Catálogo de Produtos (Porta 3003)
│   │   └── Engagment/
│   │       ├── review/     ← Serviço de Avaliações e Notas (Porta 3004)
│   │       └── history/    ← Serviço de Histórico de Visualizações (Porta 3005)
│   └── shared/
│       └── utils/          ← Utilitários, configurações e schemas compartilhados
│
├── scripts/                ← Scripts automáticos Cross-Platform em Node.js
│   ├── install-all.js      ← Instala dependências de todos os microsserviços
│   └── start-all.js        ← Inicializa todos os microsserviços em paralelo
│
├── api-shared-config.json  ← Contrato centralizado de portas, rotas e eventos
└── package.json            ← Monorepo scripts
```

---

# 🔌 Portas e Microsserviços

### Infraestrutura
| Serviço | Porta | Descrição |
|---|---|---|
| **Gateway** | `10000` | Ponto de entrada único para todas as chamadas do front-end |
| **Event Bus** | `10001` | Comunicação assíncrona orientada a eventos (*pub/sub*) |
| **Request Bus** | `10002` | Comunicação síncrona tipo *request/reply* entre microsserviços |

### Domínio de Negócio (MSS)
| Serviço | Porta | Descrição | Banco MongoDB |
|---|---|---|---|
| **Auth** | `3001` | Cadastro, login e gestão de credenciais | `autentification` |
| **User** | `3002` | Dados de perfil e busca por `authId` | `userProfile` |
| **Catalog** | `3003` | Catálogo de categorias e produtos + Seed | `test` |
| **Review** | `3004` | Avaliações, notas e estatísticas por produto | `reviews` |
| **History** | `3005` | Registro e histórico de visualizações por usuário | `userProductHistory` |

---

# 🛠️ Tecnologias Utilizadas

### Front-end
- **React** (Componentes Funcionais e Hooks)
- **Vite** (Build Tool)
- **React Router DOM** (Roteamento SPA)
- **Bootstrap 5** (Estilização e Layout Responsivo)

### Back-end
- **Node.js** & **TypeScript**
- **Express.js** (Servidor HTTP)
- **MongoDB** & **Mongoose** (Persistência NoSQL)
- **Axios** (Comunicação HTTP interna entre microsserviços)
- **Zod** (Validação de Schemas e Payloads)
- **Bcrypt** (Criptografia de Senhas)
- **Concurrently** (Execução paralela de processos)

---

# 🚀 Como Executar o Projeto

### 1. Clonar o Repositório
```bash
git clone https://github.com/Ilan-Ha/2026_maua_ecm252_ecm516_projeto_grupo1
cd 2026_maua_ecm252_ecm516_projeto_grupo1
```

### 2. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto com a string de conexão do seu MongoDB Atlas/Local:

```env
MONGO_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/
```

### 3. Instalar Todas as Dependências
Execute o comando abaixo na raiz do projeto. Ele percorrerá automaticamente o Front-end, o Gateway, os Barramentos e todos os Microsserviços:

```bash
npm run install:all
```

### 4. Inicializar Todos os Serviços
Suba o ecossistema completo de microsserviços e o Front-end com um único comando:

```bash
npm start
```

Após inicializar:
- 💻 **Front-end:** [http://localhost:5173](http://localhost:5173)
- 🚪 **Gateway API:** [http://localhost:10000](http://localhost:10000)

---

# ✅ Status das Funcionalidades

- [x] Cadastro e Autenticação de Usuários com Bcrypt
- [x] Perfil de Usuário
- [x] Catálogo e Detalhes de Produtos
- [x] Comparador de Produtos Lado a Lado
- [x] Histórico de Visualizações Persistido no MongoDB por Usuário
- [x] Sistema de Avaliações (Reviews) e Média de Estrelas
- [x] Barramento de Eventos (Event Bus) e Barramento de Requisições (Request Bus)
- [x] Gateway como Ponto Único de Entrada
- [x] Scripts de Instalação e Execução Cross-Platform em Node.js (`npm run install:all` / `npm start`)
- [x] Documentação técnica completa por microsserviço (READMEs em cada módulo)

---

# 📄 Documentações Específicas

Para entender detalhes internos de rotas, schemas ou eventos de cada módulo:

- [📄 Back-end Overview](./back-end/README.md)
- [🔐 Auth Service](./back-end/mss/Identity/auth/README.md)
- [👤 User Service](./back-end/mss/Identity/user/README.md)
- [🛍️ Catalog Service](./back-end/mss/Catalog/catalog/README.md)
- [⭐ Review Service](./back-end/mss/Engagment/review/README.md)
- [🕘 History Service](./back-end/mss/Engagment/history/README.md)
- [🚪 Gateway](./back-end/infra/gateway/README.md)
- [📡 Event Bus](./back-end/infra/event-bus/README.md)
- [🔄 Request Bus](./back-end/infra/request-bus/README.md)

---

# 👥 Integrantes do Grupo

| Nome | RA |
|:---|:---:|
| **Arthur Silva Correia** | 23.00877-6 |
| **Bruno Ferreira Nishiya** | 23.01020-7 |
| **Diego Mourão Oliveira** | 23.01580-2 |
| **Felipe Kolanian Pasquini** | 23.00118-6 |
| **Ilan Hameiry** | 23.00981-0 |
| **Leonardo Luiz Seixas Iorio** | 23.00847-7 |
| **Luca Lopes Martinho** | 23.00064-3 |

---

Desenvolvido no **Instituto Mauá de Tecnologia** durante as disciplinas **ECM252** e **ECM516**.
