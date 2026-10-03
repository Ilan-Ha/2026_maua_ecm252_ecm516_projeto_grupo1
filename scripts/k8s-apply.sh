#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

NAMESPACE="allforone"
IMAGES=(event-bus request-bus auth catalog history review user gateway)
MANIFESTS=(
  k8s/event-bus.yaml
  k8s/request-bus.yaml
  k8s/auth.yaml
  k8s/user.yaml
  k8s/catalog.yaml
  k8s/review.yaml
  k8s/history.yaml
  k8s/gateway.yaml
)

if ! command -v kubectl >/dev/null 2>&1; then
  echo "Erro: kubectl não encontrado."
  exit 1
fi

if ! kubectl cluster-info >/dev/null 2>&1; then
  echo "Erro: cluster Kubernetes inacessível. Habilite o Kubernetes no Docker Desktop e tente de novo."
  exit 1
fi

if [[ ! -f .env ]]; then
  echo "Erro: crie .env na raiz com MONGO_URI=..."
  exit 1
fi

MONGO_URI="$(grep -E '^MONGO_URI=' .env | head -n1 | cut -d= -f2-)"
MONGO_URI="${MONGO_URI%\"}"
MONGO_URI="${MONGO_URI#\"}"
MONGO_URI="${MONGO_URI%\'}"
MONGO_URI="${MONGO_URI#\'}"

if [[ -z "${MONGO_URI}" ]]; then
  echo "Erro: MONGO_URI vazia no .env"
  exit 1
fi

if ! command -v docker >/dev/null 2>&1 || ! docker info >/dev/null 2>&1; then
  echo "Erro: Docker engine não está em execução."
  exit 1
fi

missing=0
for img in "${IMAGES[@]}"; do
  if ! docker image inspect "${img}:latest" >/dev/null 2>&1; then
    missing=1
    break
  fi
done

if [[ "$missing" -eq 1 ]]; then
  echo "Imagens locais ausentes — rodando scripts/create-all-images.sh"
  ./scripts/create-all-images.sh
fi

echo "Aplicando namespace..."
kubectl apply -f k8s/namespace.yaml

echo "Criando/atualizando Secret mongo..."
kubectl -n "$NAMESPACE" create secret generic mongo \
  --from-literal=MONGO_URI="$MONGO_URI" \
  --dry-run=client -o yaml | kubectl apply -f -

echo "Aplicando Deployments e Services..."
for f in "${MANIFESTS[@]}"; do
  kubectl apply -f "$f"
done

echo "Aguardando Deployments..."
for name in event-bus request-bus auth user catalog review history gateway; do
  kubectl -n "$NAMESPACE" rollout status "deployment/${name}" --timeout=180s || true
done

echo
kubectl -n "$NAMESPACE" get pods,svc
echo
echo "Gateway health (hostPort 10000): curl -s http://localhost:10000/health"
echo "Se algum MSS falhou ao se inscrever no event-bus no boot, reinicie o pod: kubectl -n ${NAMESPACE} rollout restart deployment/<nome>"
