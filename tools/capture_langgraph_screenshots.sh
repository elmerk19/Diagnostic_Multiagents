#!/usr/bin/env bash
set -euo pipefail

# Script wrapper minimal pour lancer LangGraph Studio et exécuter le captureur Playwright.
# Usage: bash tools/capture_langgraph_screenshots.sh

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

if ! command -v langgraph >/dev/null 2>&1; then
  echo "Erreur : la commande 'langgraph' est introuvable. Installez langgraph dans votre venv :"
  echo "  python -m venv .venv && source .venv/bin/activate && pip install langgraph"
  exit 1
fi

mkdir -p screenshots

echo "Lancement de LangGraph Studio en arrière-plan..."
langgraph studio &
STUDIO_PID=$!

echo "Attente du démarrage du serveur (6s)..."
sleep 6

if [ ! -f node_modules/playwright ]; then
  echo "Attention : Playwright non installé localement. Installez-le avec 'npm i -D playwright' avant d'exécuter ce script." >&2
fi

echo "Exécution du script Playwright de capture..."
node tools/playwright_capture.js

echo "Captures enregistrées dans ./screenshots"

echo "Arrêt du processus LangGraph Studio (PID $STUDIO_PID)"
kill $STUDIO_PID || true

exit 0
