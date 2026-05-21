#!/bin/bash
set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
VAULT="${1:-$HOME/Documents/Obsidian}"

echo "=== Building wiki index from: $VAULT ==="
python3 "$SCRIPT_DIR/build-wiki-index.py" "$VAULT" -o "$PROJECT_DIR/worker/wiki-data.json"

echo ""
echo "=== Deploying Worker ==="
cd "$PROJECT_DIR/worker"
wrangler deploy

echo ""
echo "✓ Done. Worker live at: https://doge-wiki-search.zstufjj2004.workers.dev"
