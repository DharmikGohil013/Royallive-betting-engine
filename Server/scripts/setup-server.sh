#!/bin/bash
# ============================================
#  GAIN LIVE Admin Panel — Server Setup Script
#  Run this on your VPS (Ubuntu 22.04)
# ============================================

set -e

echo ""
echo "🚀  GAIN LIVE Admin Panel — Server Setup"
echo "========================================="
echo ""

# --------------- Install Node.js 20 ---------------
echo "📦  Installing Node.js 20..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    apt-get install -y nodejs
fi
echo "   Node.js $(node -v)"
echo "   npm $(npm -v)"

# --------------- Install PM2 ---------------
echo ""
echo "📦  Installing PM2 process manager..."
npm install -g pm2

# --------------- Create app directory ---------------
APP_DIR="/var/www/gainlive-admin"
echo ""
echo "📁  Setting up application directory: $APP_DIR"
mkdir -p $APP_DIR

# --------------- Copy server files ---------------
echo ""
echo "📋  Copying server files..."
# This will be done via SCP from your local machine
# The script assumes files are already in $APP_DIR

# --------------- Install dependencies ---------------
echo ""
echo "📦  Installing server dependencies..."
cd $APP_DIR
npm install --production

# --------------- Setup Nginx ---------------
echo ""
echo "🌐  Configuring Nginx..."
cp $APP_DIR/nginx/gainlive-admin.conf /etc/nginx/sites-available/gainlive-admin
ln -sf /etc/nginx/sites-available/gainlive-admin /etc/nginx/sites-enabled/gainlive-admin
rm -f /etc/nginx/sites-enabled/default

# Test and reload Nginx
nginx -t
systemctl reload nginx
echo "   ✅ Nginx configured and reloaded"

# --------------- Setup PM2 ---------------
echo ""
echo "🔄  Starting server with PM2..."
cd $APP_DIR
pm2 stop gainlive-admin 2>/dev/null || true
pm2 delete gainlive-admin 2>/dev/null || true
pm2 start server.js --name gainlive-admin
pm2 save
pm2 startup

echo ""
echo "============================================="
echo "✅  Setup Complete!"
echo ""
echo "   Server:  http://45.77.168.91"
echo "   Status:  pm2 status"
echo "   Logs:    pm2 logs gainlive-admin"
echo ""
echo "   ⚠️  Don't forget to run: npm run create-admin"
echo "      to set your admin password!"
echo "============================================="
echo ""
