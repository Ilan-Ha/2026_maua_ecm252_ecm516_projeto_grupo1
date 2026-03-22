// Arquivo Principal do Backend
const http = require("http");
// Banco de dados em memória
let usuarios = [];
// Criação do servidor
const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
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
          message: "Login OK"
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