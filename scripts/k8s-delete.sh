#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

NAMESPACE="allforone"
MANIFESTS=(
  k8s/gateway.yaml
  k8s/history.yaml
  k8s/review.yaml
  k8s/catalog.yaml
  k8s/user.yaml
  k8s/auth.yaml
  k8s/request-bus.yaml
  k8s/event-bus.yaml
  k8s/namespace.yaml
)

if ! command -v kubectl >/dev/null 2>&1; then
  echo "Erro: kubectl não encontrado."
  exit 1
fi

if ! kubectl cluster-info >/dev/null 2>&1; then
  echo "Erro: cluster Kubernetes inacessível."
  exit 1
fi

echo "Removendo recursos em k8s/..."
for f in "${MANIFESTS[@]}"; do
  kubectl delete -f "$f" --ignore-not-found
done

kubectl -n "$NAMESPACE" delete secret mongo --ignore-not-found 2>/dev/null || true
kubectl delete namespace "$NAMESPACE" --ignore-not-found

echo "Recursos K8s do AllForOne removidos."
