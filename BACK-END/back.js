import mysql2 from 'mysql2/promise'
import dotenv from 'dotenv'
dotenv.config({ path: '../.env' })

const dbPassword = process.env.LoginPassword;

if (!dbPassword) {
  throw new Error("LoginPassword is not defined");
}

let dbConection 

const conectar = async () => {
    try {
        dbConection = await mysql2.createConnection({
            host: 'sql10.freesqldatabase.com',
            user: 'sql10821756',
            password: dbPassword,
            database: 'sql10821756',
            port: '3306'
        })
        console.log('Conectado ao MySQL')
    } catch (error) {
        console.log(`Erro ao conectar com o banco de dados: ${error}`)
    }
}
conectar()

// Arquivo Principal do Backend
import http from 'http'
// Criação do servidor
const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  // Recebe DataBase
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
    req.on("end", async () => {
      let dados;
      // Tenta converter o body para JSON
      try {
        dados = JSON.parse(body);
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "JSON inválido" }));
        return;
      }

      const [result] = await dbConection.query('SELECT Username, Email FROM tb_login WHERE Email = ? AND Username = ?',[dados.email,dados.nome])

      let Username = false, Email = false
      if(result[0]){
        console.log(result[0])
        Username = result[0].Username
        Email = result[0].Email
      }
      
      // Verifica se já existe usuário com mesmo email
      
      if (Email) {
        res.writeHead(409, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Email já cadastrado" }));
        return;
      }
      
      // Verifica se já existe usuário com mesmo nome
      if (Username) {
        res.writeHead(409, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Nome já cadastrado" }));
        return;
      }
      // Salva em memória
       await dbConection.query('INSERT INTO tb_login (Username, Email, PasswordHash) VALUES (?, ?, ?)',
        [dados.nome,dados.email,dados.senha])
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
    req.on("end", async () => {
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
      const [result] = await dbConection.query(
  'SELECT * FROM tb_login WHERE Email = ? AND PasswordHash = ?',
  [email, senha]
);

if (!result.length) {
  res.writeHead(401, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Credenciais inválidas" }));
  return;
} else{

  const {Username, Email} = result[0]
  // Se o usuário existe
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      message: "Login OK",
      usuario: {
        nome: Username,
        email: Email
      }
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
  req.on("end", async () => {
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

    const [result] = await dbConection.query('SELECT * FROM tb_login WHERE Email = ? ',[email])

    const usuario = result[0]
    // Se o usuário não existe
    if (!usuario) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        message: "Usuário não encontrado"
      }));
      return;
    }
    
    
    // atualiza campos
    await dbConection.query('UPDATE tb_login SET Username = ?, Email = ?, PasswordHash = ? WHERE LoginID = ?',
        [dados.nome,dados.email,dados.senha,usuario.LoginID])

    // Mostra no terminal
    console.log("Usuário atualizado:", dados);
    // Resposta ao front-end
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      message: "Dados atualizados"
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