#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

BACK_MSS_DIR="back-end/mss"

pick_dir() {
  local preferred="$1"
  local fallback="$2"
  if [[ -d "$preferred" ]]; then
    echo "$preferred"
  elif [[ -d "$fallback" ]]; then
    echo "$fallback"
  else
    echo ""
  fi
}

if [[ -d "front-end/project" ]]; then
  FRONT_DIR="front-end/project"
elif [[ -d "FRONT-END/project" ]]; then
  FRONT_DIR="FRONT-END/project"
else
  echo "Erro: não foi encontrado front-end/project nem FRONT-END/project"
  exit 1
fi

EVENT_BUS_DIR="back-end/infra/event-bus"
REQUEST_BUS_DIR="back-end/infra/request-bus"
GATEWAY_DIR="back-end/infra/gateway"

AUTH_DIR="$(pick_dir "back-end/mss/Identity/auth" "back-end/mss/auth")"
USER_DIR="$(pick_dir "back-end/mss/Identity/user" "back-end/mss/user")"
CATALOG_DIR="$(pick_dir "back-end/mss/Catalog/catalog" "back-end/mss/catalog")"
REVIEW_DIR="$(pick_dir "back-end/mss/Engagment/review" "back-end/mss/review")"
HISTORY_DIR="$(pick_dir "back-end/mss/Engagment/history" "back-end/mss/history")"

echo "Instalando dependências do monorepo..."
npm install

echo "Instalando tooling TypeScript (back-end/mss)..."
npm --prefix "$BACK_MSS_DIR" install

echo "Instalando infra..."
npm --prefix "$EVENT_BUS_DIR" install
npm --prefix "$REQUEST_BUS_DIR" install
npm --prefix "$GATEWAY_DIR" install

echo "Instalando microserviços..."
npm --prefix "$AUTH_DIR" install
npm --prefix "$USER_DIR" install
npm --prefix "$CATALOG_DIR" install
npm --prefix "$REVIEW_DIR" install
npm --prefix "$HISTORY_DIR" install

echo "Instalando front-end..."
npm --prefix "$FRONT_DIR" install

echo ""
echo "Todas as dependências instaladas."
