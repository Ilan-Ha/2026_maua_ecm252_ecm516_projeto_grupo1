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

cd arquitetura-microservicos/

# conferindo execução do docker
if ! docker info > /dev/null 2>&1; then
    echo "Docker engine não está em execução - inicie o Docker e tente denovo!"
    exit 1
fi

# array de diretorios
#           0            1          2       3           4       5       6       7
IMAGES=("event-bus" "request-bus" "auth" "catalog" "history" "review" "user" "gateway")

# portas
#       e-b   r-b  auth cat  his  revi user gatew
PORTS=(10001 10002 3001 3003 3005 3004 3002 10000)


LENGHT="${#IMAGES[@]}"

# iniciando construcao
echo "Iniciando execução de imagens!"

for ((i=0;i<LENGHT;++i))
do
    echo "Imagem: ${IMAGES[$i]}"
    if [[ "$i" -eq 0 || "$i" -eq 1 || "$i" -eq 7 ]]; then
        # imagens que não usam .env
        docker run --name "${IMAGES[$i]}" -d -p "${PORTS[$i]}":"${PORTS[$i]}" "${IMAGES[$i]}"
    else
        # imagens que usam .env
        docker run --name "${IMAGES[$i]}" -d -p "${PORTS[$i]}":"${PORTS[$i]}" --env-file back-end/.env "${IMAGES[$i]}"
    fi
done