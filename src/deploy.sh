#!/bin/bash

# KawanLapor Deployment Script
# Run with: bash deploy.sh

echo "🚀 Starting KawanLapor Deployment..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: .env file not found!${NC}"
    echo -e "${YELLOW}Copy .env.example to .env and fill in your credentials${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Found .env file${NC}"

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Dependencies installed${NC}"

# Build application
echo -e "${YELLOW}🔨 Building application...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful${NC}"

# Create logs directory
mkdir -p logs

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}⚠️  PM2 not found. Installing globally...${NC}"
    sudo npm install -g pm2
fi

# Start or restart application with PM2
echo -e "${YELLOW}🏃 Starting application with PM2...${NC}"
pm2 delete kawanlapor 2>/dev/null || true
pm2 start ecosystem.config.js

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to start application${NC}"
    exit 1
fi

# Save PM2 configuration
pm2 save

echo -e "${GREEN}✅ Application started successfully!${NC}"
echo ""
echo -e "${GREEN}🎉 Deployment complete!${NC}"
echo ""
echo "📊 Application Status:"
pm2 status
echo ""
echo "📝 View logs with: pm2 logs kawanlapor"
echo "🔄 Restart with: pm2 restart kawanlapor"
echo "🛑 Stop with: pm2 stop kawanlapor"
echo ""
echo -e "${GREEN}🌐 Application is running at: http://localhost:3000${NC}"
