#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env ]]; then
  echo "Erro: crie .env na raiz com MONGO_URI=..."
  exit 1
fi

if [[ ! -f arquitetura-microservicos/back-end/.env ]]; then
  cp .env arquitetura-microservicos/back-end/.env
  echo "Copiado .env → arquitetura-microservicos/back-end/.env"
fi

echo "Instalando dependências (se necessário)..."
npm run install:all

echo ""
echo "Subindo MSS + front-end..."
echo "  Back-end (gateway): http://localhost:10000"
echo "  Front-end:          http://localhost:5173"
echo ""
npm start
