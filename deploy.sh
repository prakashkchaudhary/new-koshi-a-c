#!/bin/bash

# Bus Booking System - Deployment Script
# This script builds and deploys the application

echo "🚀 Starting deployment process..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Build Frontend
echo -e "${YELLOW}📦 Building frontend...${NC}"
cd frontend
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend build successful${NC}"
else
    echo -e "${RED}❌ Frontend build failed${NC}"
    exit 1
fi

# Step 2: Copy build to backend (optional - for single server deployment)
echo -e "${YELLOW}📋 Copying build to backend...${NC}"
rm -rf ../backend/public/*
cp -r build/* ../backend/public/
echo -e "${GREEN}✅ Build copied to backend${NC}"

# Step 3: Install backend dependencies
echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
cd ../backend
npm install --production

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
else
    echo -e "${RED}❌ Backend dependency installation failed${NC}"
    exit 1
fi

# Step 4: Check environment variables
echo -e "${YELLOW}🔍 Checking environment variables...${NC}"
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env file not found in backend directory${NC}"
    echo -e "${YELLOW}Please create .env file with required variables${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Environment file found${NC}"

# Step 5: Test backend connection
echo -e "${YELLOW}🧪 Testing backend...${NC}"
# Add your test command here if needed

echo ""
echo -e "${GREEN}✅ Deployment preparation complete!${NC}"
echo ""
echo "Next steps:"
echo "1. For local deployment: cd backend && npm start"
echo "2. For Vercel: Deploy frontend/build folder"
echo "3. For Render: Push to GitHub (auto-deploys from render.yaml)"
echo "4. For Docker: docker-compose up -d"
echo ""
echo "🎉 Happy deploying!"
