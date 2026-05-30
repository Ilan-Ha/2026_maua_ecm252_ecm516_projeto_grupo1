# 🛒 AllForOne — Plataforma de Comparação e Reviews de Produtos

![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb)
![Microservices](https://img.shields.io/badge/Architecture-Microservices-blue)
![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-orange)

Aplicação web desenvolvida durante as disciplinas **ECM252** e **ECM516** do **Instituto Mauá de Tecnologia**, com foco em desenvolvimento web full stack, persistência de dados, integração entre front-end e back-end e evolução para uma arquitetura baseada em microsserviços.

---

# 📌 Objetivo

O **AllForOne** tem como objetivo auxiliar usuários na escolha de produtos por meio da consulta e comparação de informações relevantes, reunindo em um único ambiente:

- Categorias de produtos
- Especificações técnicas
- Preço médio
- Marca
- Ano de lançamento
- Imagens
- Sites de compra
- Comparação entre produtos
- Histórico de navegação
- Cadastro e autenticação de usuários

---

# 🌐 Funcionalidades

## 👤 Usuários e Autenticação

- Cadastro de usuários
- Login de usuários
- Validação de e-mail
- Validação de senha
- Criptografia de senha utilizando **bcrypt**
- Perfil de usuário
- Atualização de dados cadastrais
- Persistência de sessão utilizando **localStorage**

---

## 🛍️ Catálogo de Produtos

- Listagem de categorias
- Listagem de produtos por categoria
- Página de detalhes do produto

### Informações exibidas

- Nome
- Marca
- Descrição
- Preço médio
- Ano de lançamento
- Imagens
- Especificações técnicas
- Links de compra

---

## 🔍 Comparação de Produtos

- Seleção de categoria
- Comparação entre dois ou mais produtos
- Exibição lado a lado
- Destaque para o menor preço médio
- Comparação dinâmica baseada nos itens selecionados

---

## 🕘 Histórico de Navegação

- Registro de produtos acessados
- Armazenamento local no navegador
- Limite de até 50 produtos visualizados
- Limpeza do histórico
- Estrutura preparada para persistência em banco de dados

---

## 🟢 Monitoramento

- Indicador visual de status dos serviços:
  - Front-end
  - Back-end
  - Banco de dados
- Rotas de *health check*

---

# 🖥️ Telas Principais

- 🔐 Login
- 📝 Cadastro
- 👤 Perfil
- 🛒 Catálogo
- 📦 Detalhes do Produto
- ⚖️ Comparação de Produtos
- 🕘 Histórico de Visualizações

---

# 🧱 Arquitetura do Projeto

Atualmente o projeto possui duas arquiteturas disponíveis:

## 1️⃣ Estrutura Original

```text
.
├── BACK-END/
├── FRONT-END/
├── api-shared-config.json
├── .env.example
└── README.md
```

Nesta versão:

- Front-end React + Vite
- Back-end Node.js + Express
- MongoDB + Mongoose

---

## 2️⃣ Arquitetura de Microsserviços

```text
arquitetura-microservicos/
│
├── back-end/
│   ├── auth/
│   ├── catalog/
│   ├── event-bus/
│   ├── gateway/
│   ├── request-bus/
│   ├── user/
│   └── utils/
│
├── front-end/
│   ├── auth/
│   ├── catalog/
│   ├── shell/
│   ├── user/
│   └── config.js
│
├── api-shared-config.json
└── README.md
```

Essa estrutura promove:

- Separação de responsabilidades
- Escalabilidade
- Baixo acoplamento
- Comunicação síncrona e assíncrona entre serviços

---

# 🔙 Microsserviços de Back-end

## Gateway

Centraliza todas as requisições externas e as encaminha aos serviços responsáveis.

**Porta:** `10000`

---

## Event Bus

Responsável pela comunicação assíncrona baseada em eventos.

### Exemplos de eventos

- `user.create`
- `user.added`
- `user.re.register`

**Porta:** `10001`

---

## Request Bus

Responsável pela comunicação síncrona (*request/reply*).

**Porta:** `10002`

---

## Auth

Serviço responsável pela autenticação.

### Responsabilidades

- Cadastro
- Login
- Validação de e-mail
- Validação de senha
- Criptografia de senha
- Emissão de eventos

**Porta:** `3001`

---

## User

Serviço responsável pelos dados dos usuários.

### Responsabilidades

- Criação de perfil
- Validação de nome
- Verificação de duplicidade
- Consulta de dados do usuário

**Porta:** `3002`

---

## Catalog

Serviço responsável pelo catálogo.

### Responsabilidades

- Inicialização de categorias
- Listagem de categorias
- Consulta de produtos
- Gerenciamento do catálogo

**Porta:** `3003`

---

# 🧭 Front-end em Microsserviços

```text
front-end/
├── auth/
├── catalog/
├── shell/
└── user/
```

## Shell

Aplicação principal responsável por integrar todos os módulos.

**Porta:** `4000`

---

## Auth

Módulo responsável pelas telas de autenticação.

**Porta:** `4001`

---

## User

Módulo responsável pelo perfil do usuário.

**Porta:** `4002`

---

## Catalog

Módulo responsável pela visualização do catálogo.

**Porta:** `4003`

---

# 🛠️ Tecnologias Utilizadas

## Front-end

- React
- Vite
- React Router DOM
- Bootstrap
- Font Awesome
- JavaScript ES Modules
- CSS

---

## Back-end

- Node.js
- Express
- MongoDB
- Mongoose
- Axios
- Node Fetch
- CORS
- Dotenv
- Zod
- Bcrypt
- Nodemon

---

## Ferramentas

- Git
- GitHub
- npm
- MongoDB Atlas

---

# ⚙️ Configuração do Ambiente

O projeto utiliza variáveis de ambiente para conexão com o banco de dados.

Crie um arquivo `.env` utilizando como base o `.env.example`.

```env
MONGO_URI=sua_string_de_conexao_mongodb
```

Na arquitetura de microsserviços:

```text
arquitetura-microservicos/back-end/.env
```

---

# 🚀 Executando a Estrutura Original

## 1. Clonar o repositório

```bash
git clone https://github.com/Ilan-Ha/2026_maua_ecm252_ecm516_projeto_grupo1
```

## 2. Entrar no projeto

```bash
cd 2026_maua_ecm252_ecm516_projeto_grupo1
```

## 3. Configurar o .env

```env
MONGO_URI=sua_string_de_conexao_mongodb
```

## 4. Executar Front-end

```bash
cd FRONT-END/project

npm install
npm run dev
```

Disponível em:

```text
http://localhost:5173
```

## 5. Executar Back-end

```bash
cd BACK-END

npm install
node back.js
```

Disponível em:

```text
http://localhost:3000
```

---

# 🚀 Executando a Arquitetura de Microsserviços

## 1. Entrar na pasta

```bash
cd arquitetura-microservicos
```

## 2. Configurar o .env

```env
MONGO_URI=sua_string_de_conexao_mongodb
```

## 3. Instalar dependências

Executar em cada serviço:

```bash
npm install
```

---

## 4. Iniciar Back-end

Ordem recomendada:

```bash
event-bus
request-bus
gateway
user
auth
catalog
```

Executar em terminais separados:

```bash
npm start
```

---

## 5. Iniciar Front-end

Para cada módulo:

```bash
npm install
npm run dev
```

---

# 🔌 Portas Utilizadas

## Back-end

| Serviço | Porta |
|----------|--------|
| Gateway | 10000 |
| Event Bus | 10001 |
| Request Bus | 10002 |
| Auth | 3001 |
| User | 3002 |
| Catalog | 3003 |
| Images | 3000 |

---

## Front-end

| Módulo | Porta |
|---------|---------|
| Shell | 4000 |
| Auth | 4001 |
| User | 4002 |
| Catalog | 4003 |

---

# 📡 Principais Rotas

## Gateway

| Método | Rota |
|----------|----------|
| POST | `/requisicao` |
| GET | `/requisicao` |

---

## Auth

| Método | Rota |
|----------|----------|
| POST | `/cadastro` |
| POST | `/login` |
| POST | `/perfil/atualizar/senha` |

---

## User

| Método | Rota |
|----------|----------|
| POST | `/eventos` |
| POST | `/requisicao` |

---

## Catalog

| Método | Rota |
|----------|----------|
| GET | `/catalogo` |

---

## Event Bus

| Método | Rota |
|----------|----------|
| POST | `/eventos` |
| POST | `/inscricao` |
| POST | `/desinscricao` |
| GET | `/dados` |

---

## Request Bus

| Método | Rota |
|----------|----------|
| POST | `/requisicao` |

---

# 🗃️ Banco de Dados

O sistema utiliza **MongoDB** com **Mongoose**.

### Coleções principais

- `auth`
- `user`
- `categorias`
- `produtos`

### Domínios separados

- Autenticação
- Usuários
- Catálogo

---

# ✅ Status Atual

### Implementado

- Cadastro de usuários
- Login
- Validação de dados
- Criptografia de senha
- Perfil de usuário
- Catálogo de produtos
- Comparação de produtos
- Histórico de visualização
- Gateway
- Event Bus
- Request Bus
- Organização em microsserviços

---

# 💡 Melhorias Futuras

- [ ] Script único de instalação
- [ ] Script único de inicialização
- [ ] Docker
- [ ] Docker Compose
- [ ] Testes automatizados
- [ ] JWT
- [ ] Persistência do histórico
- [ ] Sistema de reviews
- [ ] Avaliações por nota
- [ ] Integração com APIs externas
- [ ] Ranking de produtos
- [ ] Likes e dislikes
- [ ] Sistema de recomendação
- [ ] Tratamento global de erros
- [ ] Diagramas de arquitetura

---

# 🎓 Desafios e Aprendizados

Durante o desenvolvimento foram aplicados conceitos de:

- Desenvolvimento Front-end com React
- Desenvolvimento Back-end com Node.js
- Integração cliente-servidor
- Persistência com MongoDB
- Validação com Zod
- Criptografia com bcrypt
- Microsserviços
- Event-driven architecture
- Request/Reply
- Configuração compartilhada
- Trabalho colaborativo
- Git e GitHub

---

# 📄 Licença

Este projeto atualmente **não possui licença definida**.

---

# 👥 Integrantes

| Nome | RA |
|--------|--------|
| Arthur Silva Correia | 23.00877-6 |
| Bruno Ferreira Nishiya | 23.01020-7 |
| Diego Mourão Oliveira | 23.01580-2 |
| Felipe Kolanian Pasquini | 23.00118-6 |
| Ilan Hameiry | 23.00981-0 |
| Leonardo Luiz Seixas Iorio | 23.00847-7 |
| Luca Lopes Martinho | 23.00064-3 |

---

Desenvolvido no **Instituto Mauá de Tecnologia** durante as disciplinas **ECM252** e **ECM516**.
