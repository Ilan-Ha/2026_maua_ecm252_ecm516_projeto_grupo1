import {addItem} from './userDatabaseManager.js'

// Arquivo Principal do Backend
import http from 'http'
// Banco de dados em memória
let usuarios = [];
// Criação do servidor
const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  // Respondendo requisições preflight (OPTIONS)
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }
  // Rota de cadastro
   if (req.url === "/cadastro" && req.method === "POST") {
    let body = "";
    // Recebendo dados do front-end
    req.on("data", chunk => {
      body += chunk;
    });
    // Finalizando o recebimento de dados
    req.on("end", () => {
      let dados;
      // Tenta converter o body para JSON
      try {
        dados = JSON.parse(body);
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "JSON inválido" }));
        return;
      }
      // Verifica se já existe usuário com mesmo email
      const emailExiste = usuarios.find(u => u.email === dados.email);
      if (emailExiste) {
        res.writeHead(409, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Email já cadastrado" }));
        return;
      }
      // Verifica se já existe usuário com mesmo nome
      const nomeExiste = usuarios.find(u => u.nome === dados.nome);
      if (nomeExiste) {
        res.writeHead(409, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Nome já cadastrado" }));
        return;
      }
      // Salva em memória
      usuarios.push(dados); 
      addItem(dados)
      console.log("Usuários:", usuarios);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        message: "Usuário cadastrado"
      }));
    });
    return;
  }
  // Rota de login
  if (req.url === "/login" && req.method === "POST") {
    let body = "";
    // Recebendo dados do front-end
    req.on("data", chunk => {
      body += chunk;
    });
    // Finalizando o recebimento de dados
    req.on("end", () => {
      let dados;
      // Tenta converter o body para JSON
      try {
        dados = JSON.parse(body);
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "JSON inválido" }));
        return;
      }
      const { email, senha } = dados;
      // Verifica se o usuário existe
      const usuario = usuarios.find(
        (u) => u.email === email && u.senha === senha
      );
      // Se o usuário existe
      if (usuario) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
          message: "Login OK",
          usuario: {
            nome: usuario.nome,
            email: usuario.email
          }
        }));
      } else {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
          message: "Credenciais inválidas"
        }));
      }
    });
    return;
  }
  // Rota de atualização do usuário
 if (req.url === "/usuario" && req.method === "PUT") {
  let body = "";
  // Recebendo dados do front-end
  req.on("data", chunk => {
    body += chunk;
  });
  // Finalizando o recebimento de dados
  req.on("end", () => {
    // Recebe os dados do front-end 2
    let dados;
    // Tenta converter o body para JSON
    try {
      dados = JSON.parse(body);
    } catch {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "JSON inválido" }));
      return;
    }
    const { email, nome, senha } = dados;
    // procura usuário pelo email
    const usuario = usuarios.find(u => u.email === email);
    // Se o usuário não existe
    if (!usuario) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        message: "Usuário não encontrado"
      }));
      return;
    }
    // atualiza campos
    if (nome) usuario.nome = nome;
    if (senha) usuario.senha = senha;
    // Mostra no terminal
    console.log("Usuário atualizado:", usuario);
    // Resposta ao front-end
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      message: "Dados atualizados",
      usuario: {
        nome: usuario.nome,
        email: usuario.email
      }
    }));
  });
  return;
  }
  // Fallback (Erro 404)
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Rota não encontrada" }));
});
//Definição da porta
const PORT = 3000;
// Inicialização do servidor
server.listen(PORT, () => {
  console.log(`Rodando em http://localhost:${PORT}`);
});