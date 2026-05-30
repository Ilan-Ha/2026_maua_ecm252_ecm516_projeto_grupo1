🛒 AllForOne - Plataforma de Comparação e Reviews de Produtos

Aplicação web em desenvolvimento para comparação, consulta e análise de produtos, permitindo que usuários naveguem por categorias, consultem especificações técnicas, comparem produtos e mantenham histórico de itens visualizados.

O projeto foi desenvolvido durante as disciplinas ECM252 e ECM516 do Instituto Mauá de Tecnologia, com foco em desenvolvimento web, integração front-end/back-end, persistência de dados e evolução para uma arquitetura baseada em microsserviços.

⸻

📌 Objetivo do Projeto

O objetivo da aplicação é oferecer uma plataforma simples e funcional para apoiar usuários na escolha de produtos, reunindo informações como:

* categorias de produtos;
* detalhes técnicos;
* preço médio;
* marca;
* ano de lançamento;
* imagens;
* sites de compra;
* comparação entre produtos;
* histórico de produtos visualizados;
* cadastro e login de usuários.

⸻

🌐 Funcionalidades Implementadas

👤 Usuário e Autenticação

* Cadastro de usuário.
* Login de usuário.
* Validação de e-mail.
* Validação de senha.
* Criptografia de senha com bcrypt na arquitetura de microsserviços.
* Perfil do usuário.
* Atualização de dados cadastrais.
* Persistência de sessão no navegador por meio de localStorage.

🛍️ Catálogo de Produtos

* Listagem de categorias.
* Listagem de produtos por categoria.
* Página de detalhes de produto.
* Exibição de:
    * nome;
    * marca;
    * descrição;
    * preço médio;
    * ano de lançamento;
    * imagens;
    * especificações técnicas;
    * links de compra.

🔍 Comparação de Produtos

* Seleção de categoria.
* Comparação entre dois ou mais produtos.
* Exibição lado a lado das especificações.
* Destaque para menor preço médio.
* Comparação dinâmica com base nos produtos selecionados.

🕘 Histórico

* Registro de produtos acessados.
* Armazenamento local do histórico no navegador.
* Limite de até 50 produtos visualizados.
* Opção para limpar histórico.
* Preparação para persistência do histórico no back-end.

🟢 Monitoramento

* Componente visual de status para:
    * front-end;
    * back-end;
    * banco de dados.
* Rotas de health check no back-end.

⸻

🖥️ Telas Principais

* Página de login.
* Página de cadastro.
* Página de perfil.
* Página de catálogo.
* Página de detalhes do produto.
* Página de comparação de produtos.
* Página de histórico de produtos visualizados.

⸻

🧱 Arquitetura do Projeto

Atualmente, o repositório possui duas estruturas principais:

.
├── BACK-END/
├── FRONT-END/
├── arquitetura-microservicos/
├── api-shared-config.json
├── .env.example
└── README.md

1. Estrutura original

A estrutura original concentra a aplicação em:

BACK-END/
FRONT-END/

Essa versão possui um back-end Node.js/Express integrado ao MongoDB e um front-end React com Vite.

2. Arquitetura de microsserviços

A versão mais recente do projeto está organizada na pasta:

arquitetura-microservicos/

Essa estrutura separa responsabilidades em serviços independentes, aproximando o projeto de uma arquitetura distribuída.

arquitetura-microservicos/
├── back-end/
│   ├── auth/
│   ├── catalog/
│   ├── event-bus/
│   ├── gateway/
│   ├── request-bus/
│   ├── user/
│   └── utlis/
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

⸻

🔙 Microsserviços de Back-end

gateway

Serviço responsável por centralizar requisições externas e encaminhá-las para os microsserviços internos corretos.

Porta padrão:

10000

event-bus

Serviço responsável pela comunicação assíncrona entre microsserviços por meio de eventos.

Exemplos de eventos:

user.create
user.added
user.re.register

Porta padrão:

10001

request-bus

Serviço responsável pela comunicação síncrona do tipo request/reply entre microsserviços.

Porta padrão:

10002

auth

Serviço responsável por autenticação e cadastro.

Principais responsabilidades:

* cadastro;
* login;
* validação de e-mail;
* validação de senha;
* criptografia de senha com bcrypt;
* emissão de eventos relacionados ao cadastro de usuário.

Porta padrão:

3001

user

Serviço responsável pelos dados de perfil do usuário.

Principais responsabilidades:

* criação de perfil a partir de eventos;
* validação de nome;
* verificação de nome já cadastrado;
* retorno de dados do usuário para autenticação.

Porta padrão:

3002

catalog

Serviço responsável pelo catálogo de produtos.

Principais responsabilidades:

* inicialização de categorias padrão;
* listagem de categorias;
* listagem de produtos;
* consulta de catálogo.

Porta padrão:

3003

⸻

🧭 Front-end em Microsserviços

A pasta arquitetura-microservicos/front-end está organizada por domínios:

front-end/
├── auth/
├── catalog/
├── shell/
└── user/

shell

Aplicação principal responsável por integrar os módulos do front-end.

Porta padrão:

4000

auth

Módulo de interface relacionado a login e cadastro.

Porta padrão:

4001

user

Módulo de interface relacionado ao perfil do usuário.

Porta padrão:

4002

catalog

Módulo de interface relacionado ao catálogo e produtos.

Porta padrão:

4003

⸻

🛠️ Tecnologias Utilizadas

Front-end

* React
* Vite
* React Router DOM
* Bootstrap
* Font Awesome
* JavaScript ES Modules
* CSS

Back-end

* Node.js
* Express
* MongoDB
* Mongoose
* CORS
* Dotenv
* Axios
* Node Fetch
* Nodemon
* Zod
* Bcrypt

Ferramentas

* Git
* GitHub
* npm
* MongoDB Atlas ou MongoDB local

⸻

⚙️ Configuração de Ambiente

O projeto utiliza variável de ambiente para conexão com o MongoDB.

Crie um arquivo .env com base no arquivo .env.example.

Exemplo:

MONGO_URI=sua_string_de_conexao_mongodb

Na arquitetura de microsserviços, o arquivo .env.example está em:

arquitetura-microservicos/back-end/.env.example

⸻

🚀 Como Executar - Estrutura Original

1. Clone o repositório

git clone https://github.com/Ilan-Ha/2026_maua_ecm252_ecm516_projeto_grupo1

2. Acesse a pasta do projeto

cd 2026_maua_ecm252_ecm516_projeto_grupo1

3. Configure o .env

Crie um arquivo .env na raiz do projeto:

MONGO_URI=sua_string_de_conexao_mongodb

4. Instale e execute o front-end

cd FRONT-END/project
npm install
npm run dev

O front-end será executado em:

http://localhost:5173

5. Em outro terminal, instale e execute o back-end

cd BACK-END
npm install
node back.js

O back-end será executado em:

http://localhost:3000

⸻

🚀 Como Executar - Arquitetura de Microsserviços

1. Clone o repositório

git clone https://github.com/Ilan-Ha/2026_maua_ecm252_ecm516_projeto_grupo1

2. Acesse a pasta da arquitetura de microsserviços

cd 2026_maua_ecm252_ecm516_projeto_grupo1/arquitetura-microservicos

3. Configure o .env

Crie um arquivo .env em:

arquitetura-microservicos/back-end/

Com o conteúdo:

MONGO_URI=sua_string_de_conexao_mongodb

4. Instale as dependências dos serviços de back-end

Execute em cada serviço:

cd back-end/event-bus
npm install
cd ../request-bus
npm install
cd ../gateway
npm install
cd ../auth
npm install
cd ../user
npm install
cd ../catalog
npm install

5. Execute os serviços de back-end

Recomenda-se iniciar primeiro os serviços de comunicação, depois os serviços de domínio.

Em terminais separados, execute:

cd arquitetura-microservicos/back-end/event-bus
npm start
cd arquitetura-microservicos/back-end/request-bus
npm start
cd arquitetura-microservicos/back-end/gateway
npm start
cd arquitetura-microservicos/back-end/user
npm start
cd arquitetura-microservicos/back-end/auth
npm start
cd arquitetura-microservicos/back-end/catalog
npm start

6. Execute os módulos de front-end

Acesse cada módulo de front-end e instale as dependências conforme necessário:

cd arquitetura-microservicos/front-end/shell
npm install
npm run dev

Repita o processo para os demais módulos, caso estejam sendo executados separadamente:

cd arquitetura-microservicos/front-end/auth
npm install
npm run dev
cd arquitetura-microservicos/front-end/user
npm install
npm run dev
cd arquitetura-microservicos/front-end/catalog
npm install
npm run dev

⸻

🔌 Portas Padrão

Back-end

Serviço	Porta
Gateway	10000
Event Bus	10001
Request Bus	10002
Auth	3001
User	3002
Catalog	3003
Images	3000

Front-end

Módulo	Porta
Shell	4000
Auth	4001
User	4002
Catalog	4003

⸻

📡 Principais Rotas

Gateway

POST /requisicao
GET /requisicao

Auth

POST /cadastro
POST /login
POST /perfil/atualizar/senha

User

POST /eventos
POST /requisicao

Catalog

GET /catalogo

Event Bus

POST /eventos
POST /inscricao
POST /desinscricao
GET /dados

Request Bus

POST /requisicao

⸻

🗃️ Banco de Dados

O projeto utiliza MongoDB com Mongoose.

Na arquitetura de microsserviços, há separação lógica por domínio:

* autenticação;
* perfil de usuário;
* catálogo de produtos.

Exemplos de coleções utilizadas:

* auth;
* user;
* categorias;
* produtos.

⸻

✅ Status Atual do Projeto

Funcionalidades já presentes ou parcialmente implementadas:

* cadastro de usuários;
* login de usuários;
* validação de nome;
* validação de senha;
* criptografia de senha;
* perfil de usuário;
* catálogo de produtos;
* detalhes de produto;
* comparação entre produtos;
* histórico local de visualização;
* comunicação via gateway;
* comunicação síncrona via request-bus;
* comunicação assíncrona via event-bus;
* organização inicial em microsserviços.

⸻

⚠️ Observações Técnicas

* A estrutura original BACK-END/ e FRONT-END/ ainda existe no repositório.
* A arquitetura mais recente está concentrada em arquitetura-microservicos/.
* Alguns módulos ainda estão em evolução e podem exigir ajustes de integração.
* A execução completa exige múltiplos terminais, pois cada microsserviço roda de forma independente.
* É necessário configurar corretamente o MONGO_URI antes de iniciar os serviços que dependem do banco de dados.
* A padronização das respostas entre serviços segue o modelo com campos como error, status, message e content.

⸻

💡 Melhorias Futuras

* Criar script único para instalar todas as dependências.
* Criar script único para iniciar todos os microsserviços.
* Adicionar Docker e Docker Compose.
* Melhorar documentação das rotas.
* Adicionar testes automatizados.
* Implementar autenticação com token JWT.
* Persistir histórico de produtos visualizados no banco de dados.
* Adicionar sistema completo de reviews e comentários.
* Implementar notas e avaliações de produtos.
* Integrar APIs externas, como Amazon ou Mercado Livre.
* Criar ranking de produtos mais bem avaliados.
* Adicionar likes e dislikes em comentários.
* Criar sistema de recomendação inteligente.
* Melhorar tratamento global de erros.
* Criar documentação de arquitetura com diagrama dos microsserviços.

⸻

⚠️ Desafios e Aprendizados

Durante o desenvolvimento, o grupo trabalhou com:

* criação de interface web com React;
* integração entre front-end e back-end;
* persistência de dados com MongoDB;
* validação de dados com Zod;
* criptografia de senha;
* separação de responsabilidades;
* comunicação entre microsserviços;
* uso de event bus;
* uso de request bus;
* padronização de configuração compartilhada;
* organização de projeto em equipe;
* versionamento com Git e GitHub.

⸻

📄 Licença

Este projeto está sem licença definida.

⸻

👥 Integrantes

* Arthur Silva Correia - 23.00877-6
* Bruno Ferreira Nishiya - 23.01020-7
* Diego Mourão Oliveira - 23.01580-2
* Felipe Kolanian Pasquini - 23.00118-6
* Ilan Hameiry - 23.00981-0
* Leonardo Luiz Seixas Iorio - 23.00847-7
* Luca Lopes Martinho - 23.0