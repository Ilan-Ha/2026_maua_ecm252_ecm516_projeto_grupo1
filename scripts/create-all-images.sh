#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

cd arquitetura-microservicos/


# conferindo execução do docker
if ! docker info > /dev/null 2>&1; then
    echo "Docker engine não está em execução - inicie o Docker e tente denovo!"
    exit 1
fi

# array de diretorios
IMAGES=("event-bus" "request-bus" "auth" "catalog" "history" "review" "user" "gateway")
LENGHT="${#IMAGES[@]}"

# iniciando construcao
echo "Iniciando construção de imagens!"

for ((i=0;i<LENGHT;++i))
do
    echo "Imagem: ${IMAGES[$i]}"
    docker build -t "${IMAGES[$i]}" -f back-end/"${IMAGES[$i]}"/Dockerfile .
done

