#!/bin/bash
# ============================================
#  GAIN LIVE Admin Panel — Deploy Script
#  Run this from your LOCAL machine (Git Bash / WSL)
# ============================================

SERVER_IP="45.77.168.91"
SERVER_USER="root"
APP_DIR="/var/www/gainlive-admin"
ADMIN_DIR="../Admin"

echo ""
echo "🚀  GAIN LIVE Admin Panel — Deploy"
echo "===================================="
echo ""

# --------------- Step 1: Build Admin Frontend ---------------
echo "🔨  Building Admin frontend..."
cd "$ADMIN_DIR"
npm run build
echo "   ✅ Build complete"

# --------------- Step 2: Upload to Server ---------------
echo ""
echo "📤  Uploading files to server..."

# Upload server files
scp -r ../Server/server.js $SERVER_USER@$SERVER_IP:$APP_DIR/
scp -r ../Server/package.json $SERVER_USER@$SERVER_IP:$APP_DIR/
scp -r ../Server/.env $SERVER_USER@$SERVER_IP:$APP_DIR/
scp -r ../Server/scripts $SERVER_USER@$SERVER_IP:$APP_DIR/
scp -r ../Server/nginx $SERVER_USER@$SERVER_IP:$APP_DIR/

# Upload built admin frontend
scp -r dist/* $SERVER_USER@$SERVER_IP:$APP_DIR/admin-dist/

echo "   ✅ Files uploaded"

# --------------- Step 3: Restart server ---------------
echo ""
echo "🔄  Restarting server..."
ssh $SERVER_USER@$SERVER_IP "cd $APP_DIR && npm install --production && pm2 restart gainlive-admin"

echo ""
echo "===================================="
echo "✅  Deployed! Visit: http://$SERVER_IP"
echo "===================================="
echo ""
