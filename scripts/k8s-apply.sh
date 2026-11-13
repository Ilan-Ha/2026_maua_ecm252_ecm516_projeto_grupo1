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
# Nomes reais dos Deployments nos manifests (sufixo -deployment)
DEPLOYMENTS=(
  event-bus-deployment
  request-bus-deployment
  auth-deployment
  user-deployment
  catalog-deployment
  review-deployment
  history-deployment
  gateway-deployment
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
for name in "${DEPLOYMENTS[@]}"; do
  kubectl -n "$NAMESPACE" rollout status "deployment/${name}" --timeout=180s || true
done

echo
kubectl -n "$NAMESPACE" get pods,svc
echo

NODE_PORT="$(kubectl -n "$NAMESPACE" get svc gateway-nodeport-service -o jsonpath='{.spec.ports[0].nodePort}' 2>/dev/null || true)"
if [[ -n "${NODE_PORT}" ]]; then
  echo "Gateway NodePort: http://localhost:${NODE_PORT}"
  echo "Health: curl -s http://localhost:${NODE_PORT}/health"
else
  echo "Gateway NodePort não encontrado — confira: kubectl -n ${NAMESPACE} get svc"
fi

echo "Se algum MSS falhou ao se inscrever no event-bus no boot:"
echo "  kubectl -n ${NAMESPACE} rollout restart deployment/<nome>-deployment"
