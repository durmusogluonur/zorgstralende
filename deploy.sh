#!/bin/bash
# Hostinger: Git pull sonrası çalıştırın. Build üretir; Node uygulamasını panelden yeniden başlatın.
set -e
cd "$(dirname "$0")"
echo "Installing dependencies..."
npm ci
echo "Building..."
npm run build
echo "Build complete. Restart your Node.js app from Hostinger panel (Node.js Manager)."
