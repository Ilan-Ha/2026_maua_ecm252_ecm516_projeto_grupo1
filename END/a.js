// Arquivo Principal do Backend
const http = require('http');

const server = http.createServer((req, res) => {
  // Configurando CORS para permitir requisições do front-end
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Respondendo requisições preflight (OPTIONS)
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Rota simples de exemplo
  if (req.url === '/api/data' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Olá do Back-end! A conexão foi um sucesso!' }));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Rota não encontrada' }));
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor back-end rodando em http://localhost:${PORT}`);
});
