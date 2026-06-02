#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env ]]; then
  echo "Erro: crie .env na raiz com MONGO_URI=..."
  exit 1
fi

BACK_MSS_DIR="back-end/mss"
if [[ ! -d "$BACK_MSS_DIR" ]]; then
  echo "Erro: diretório $BACK_MSS_DIR não encontrado"
  exit 1
fi

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

if [[ ! -f "$BACK_MSS_DIR/.env" ]]; then
  cp .env "$BACK_MSS_DIR/.env"
  echo "Copiado .env → $BACK_MSS_DIR/.env"
fi

EVENT_BUS_DIR="back-end/infra/event-bus"
REQUEST_BUS_DIR="back-end/infra/request-bus"
GATEWAY_DIR="back-end/infra/gateway"

AUTH_DIR="$(pick_dir "back-end/mss/Identity/auth" "back-end/mss/auth")"
USER_DIR="$(pick_dir "back-end/mss/Identity/user" "back-end/mss/user")"
CATALOG_DIR="$(pick_dir "back-end/mss/Catalog/catalog" "back-end/mss/catalog")"
REVIEW_DIR="$(pick_dir "back-end/mss/Engagment/review" "back-end/mss/review")"
HISTORY_DIR="$(pick_dir "back-end/mss/Engagment/history" "back-end/mss/history")"

for required in "$EVENT_BUS_DIR" "$REQUEST_BUS_DIR" "$GATEWAY_DIR" "$AUTH_DIR" "$USER_DIR" "$CATALOG_DIR" "$REVIEW_DIR" "$HISTORY_DIR"; do
  if [[ -z "$required" || ! -f "$required/package.json" ]]; then
    echo "Erro: serviço não encontrado ou sem package.json: $required"
    exit 1
  fi
done

echo "Instalando dependências (se necessário)..."
npm --prefix "$EVENT_BUS_DIR" install
npm --prefix "$REQUEST_BUS_DIR" install
npm --prefix "$AUTH_DIR" install
npm --prefix "$USER_DIR" install
npm --prefix "$CATALOG_DIR" install
npm --prefix "$REVIEW_DIR" install
npm --prefix "$HISTORY_DIR" install
npm --prefix "$GATEWAY_DIR" install
npm --prefix "$FRONT_DIR" install

echo ""
echo "Subindo MSS + front-end..."
echo "  Back-end (gateway): http://localhost:10000"
echo "  Front-end:          http://localhost:5173"
echo ""
npx concurrently -k \
  -n event,request,auth,user,catalog,review,history,gateway,front \
  -c blue,green,magenta,yellow,cyan,white,red,brightBlue,brightGreen \
  "npm --prefix $EVENT_BUS_DIR start" \
  "sleep 1 && npm --prefix $REQUEST_BUS_DIR start" \
  "sleep 2 && npm --prefix $AUTH_DIR start" \
  "sleep 3 && npm --prefix $USER_DIR start" \
  "sleep 4 && npm --prefix $CATALOG_DIR start" \
  "sleep 5 && npm --prefix $REVIEW_DIR start" \
  "sleep 6 && npm --prefix $HISTORY_DIR start" \
  "sleep 7 && npm --prefix $GATEWAY_DIR start" \
  "npm --prefix $FRONT_DIR run dev"
