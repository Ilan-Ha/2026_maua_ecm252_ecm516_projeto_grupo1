// Arquivo Principal do Backend
const http = require('http');

// Criação do servidor
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

  // Rota simples
  if (req.url === '/api/products' && req.method === 'GET') {
    const products = [
      { id: 1, name: 'iPhone 15 Pro', category: 'Celular', price: 'R$ 7.999', brand: 'Apple', image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=300' },
      { id: 2, name: 'Samsung Galaxy S24 Ultra', category: 'Celular', price: 'R$ 6.499', brand: 'Samsung', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=300' },
      { id: 3, name: 'MacBook Air M3', category: 'Laptop', price: 'R$ 9.499', brand: 'Apple', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=300' },
      { id: 4, name: 'Sony WH-1000XM5', category: 'Fones', price: 'R$ 2.299', brand: 'Sony', image: 'https://images.unsplash.com/photo-1628202926206-c63a34b1618f?auto=format&fit=crop&q=80&w=300' },
      { id: 5, name: 'iPad Air', category: 'Tablet', price: 'R$ 5.999', brand: 'Apple', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=300' },
      { id: 6, name: 'Nintendo Switch OLED', category: 'Console', price: 'R$ 2.499', brand: 'Nintendo', image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&q=80&w=300' }
    ];
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(products));
  } else if (req.url === '/api/data' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Olá do Back-end! A conexão foi um sucesso!' }));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Rota não encontrada' }));
  }
});
// Definição da porta
const PORT = 3000;
// Inicialização do servidor
server.listen(PORT, () => {
  console.log(`Servidor back-end rodando em http://localhost:${PORT}`);
});