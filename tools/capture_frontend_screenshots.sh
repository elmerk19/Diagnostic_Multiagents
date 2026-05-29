#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

if ! command -v node >/dev/null 2>&1; then
  echo "Erreur : node n'est pas installé ou accessible."
  exit 1
fi

if [ ! -d "node_modules" ]; then
  echo "Erreur : dépendances NPM manquantes. Exécutez 'npm install' à la racine du dépôt." >&2
  exit 1
fi

mkdir -p screenshots

cd frontend
npm run dev -- --host > "$ROOT_DIR/tools/frontend_capture.log" 2>&1 &
FRONTEND_PID=$!
cd "$ROOT_DIR"

echo "Lancement du frontend React en arrière-plan (PID=$FRONTEND_PID)..."
echo "Attente du démarrage du serveur (6s)..."
sleep 6

APP_URL="${APP_URL:-http://localhost:5173}"
if ! curl -sSf "$APP_URL" >/dev/null 2>&1; then
  echo "Attention : le serveur frontend ne répond pas encore sur $APP_URL." >&2
fi

echo "Exécution du script de capture Playwright..."
APP_URL="$APP_URL" node tools/playwright_capture_frontend.js

echo "Arrêt du frontend (PID=$FRONTEND_PID)"
kill "$FRONTEND_PID" || true

echo "Captures enregistrées dans ./screenshots"
exit 0
