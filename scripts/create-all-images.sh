#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/arquitetura-microservicos"

if ! docker info > /dev/null 2>&1; then
  echo "Docker engine não está em execução - inicie o Docker e tente de novo!"
  exit 1
fi

# Node MSS (catalog é Dart)
NODE_IMAGES=(event-bus request-bus auth history review user gateway)
echo "Iniciando construção de imagens!"

for image in "${NODE_IMAGES[@]}"; do
  echo "Imagem (Node): ${image}"
  docker build -t "${image}" -f "back-end/${image}/Dockerfile" .
done

echo "Imagem (Dart): catalog"
docker build -t catalog -f dart_back_end/catalog/Dockerfile .

echo "Todas as imagens foram construídas."
