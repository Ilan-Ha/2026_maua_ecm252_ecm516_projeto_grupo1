// Arquivo Principal do Backend
const http = require("http");
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
      const dados = JSON.parse(body);
      // Salva em memória
      usuarios.push(dados); 
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
      const { email, senha } = JSON.parse(body);
      // Verifica se o usuário existe
      const usuario = usuarios.find(
        (u) => u.email === email && u.senha === senha
      );
      // Se o usuário existe
      if (usuario) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
          message: "Login OK",
          usuario: usuario
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
    const { email, nome, senha } = JSON.parse(body);
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
      usuario: usuario
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