# 🛒 Plataforma de Reviews de Produtos

![Web](https://img.shields.io/badge/Web-Platform-blue?style=for-the-badge) ![Build](https://img.shields.io/badge/Build-Passing-brightgreen)

Aplicação web em desenvolvimento para **busca e análise de avaliações de produtos**, permitindo que usuários encontrem opiniões confiáveis antes de realizar compras.  
O sistema reúne reviews, notas e comentários de diferentes usuários em uma interface simples e eficiente.

Projeto desenvolvido pelos integrantes da equipe durante o curso, com foco em aplicar conceitos de desenvolvimento web e experiência do usuário.

---

## 🌐 Funcionalidade Principal

Permitir que usuários:
 
- Façam cadastro
- Façam login
- Façam alterações de dados cadastrados

--- 

## 🖥️ Telas principais

- Página de login
- Página de cadastro 
- Página de perfil

---

## ⚙️ Como usar

1. Acesse o site.  
2. Faça cadastro.  
3. Faça login.  

---

## ⚙️ Funcionalidades

- 🔍 Criação de cadatro  
- ⭐ Login do usuário

---

## 🛠 Tecnologias

- **Front-end:** React
- **Back-end:** Node.js (JavaScript)
- **Gerenciador de pacotes:** npm
- **Versionamento:** Git / GitHub  

---

## 🚀 Como Executar

### Back-end (microserviços — recomendado)

1. Clone o repositório e configure `.env` na **raiz** com `MONGO_URI`.

2. Back-end MSS:
```bash
cd arquitetura-microservicos/back-end
cp ../../.env .env          # ou crie .env com MONGO_URI
npm run install:all
npm start
```

3. Front-end (outro terminal):
```bash
cd FRONT-END/project
npm install
npm run dev
```

4. Acesse: http://localhost:5173

O front fala com o **gateway** em `http://localhost:10000`.

Documentação detalhada: [arquitetura-microservicos/back-end/README.md](arquitetura-microservicos/back-end/README.md)

### Back-end legado (monólito — depreciado)

```bash
cd BACK-END
node back.js
```

Use apenas para referência. Prefira a arquitetura microserviços acima.

 ---

## 💡 Melhorias Futuras

- Página inicial (Seleção de categoria)  
- Pesquisem produtos 
- Especificações de produtos
- Comentários de produtos no site
- Autenticação de usuários
- Histórico de produtos vistos
- Histórico de avaliações do usuário
- Integração com APIs externas (ex: Amazon, Mercado Livre)
- Sistema de recomendação inteligente
- Likes/dislikes em comentários
- Ranking de produtos mais bem avaliados

---

## ⚠️ Desafios e Aprendizados

- Criação de interface intuitiva
- Integração entre front-end e back-end
- Trabalho em equipe
- Padronização de código

---

## 📄 Licença

Este projeto está sem licença definida.

---

## 👥 Integrantes

Arthur Silva Correia
23.00877-6

Bruno Ferreira Nishiya
23.01020-7

Diego Mourão Oliveira
23.01580-2

Felipe Kolanian Pasquini
23.00118-6 

Ilan Hameiry
23.00981-0

Leonardo Luiz Seixas Iorio
23.00847-7

Luca Lopes Martinho
23.00064-3
