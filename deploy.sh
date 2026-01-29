#!/bin/bash
# Hostinger: Git pull sonrası çalıştırın. Build üretir; Node uygulamasını panelden yeniden başlatın.
# Beyaz ekran / CSS-JS 404 hatası = build alınmamış demektir. Bu script'i mutlaka çalıştırın.
set -e
cd "$(dirname "$0")"
echo "Installing dependencies..."
npm ci
echo "Building (this creates .next/static - required for site to load correctly)..."
npm run build
echo "Build complete."
echo ""
echo "If you use standalone mode, run:"
echo "  cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/"
echo "Then start with: node .next/standalone/server.js"
echo ""
echo "Otherwise ensure start command is: npm start (from project root)."
echo "Restart your Node.js app from Hostinger panel (Node.js Manager)."
