# Bus Booking System - Deployment Script (PowerShell)
# This script builds and deploys the application on Windows

Write-Host "🚀 Starting deployment process..." -ForegroundColor Cyan

# Step 1: Build Frontend
Write-Host "`n📦 Building frontend..." -ForegroundColor Yellow
Set-Location frontend
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend build successful" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend build failed" -ForegroundColor Red
    exit 1
}

# Step 2: Copy build to backend (optional - for single server deployment)
Write-Host "`n📋 Copying build to backend..." -ForegroundColor Yellow
if (Test-Path "../backend/public") {
    Remove-Item -Path "../backend/public/*" -Recurse -Force
}
Copy-Item -Path "build/*" -Destination "../backend/public/" -Recurse -Force
Write-Host "✅ Build copied to backend" -ForegroundColor Green

# Step 3: Install backend dependencies
Write-Host "`n📦 Installing backend dependencies..." -ForegroundColor Yellow
Set-Location ../backend
npm install --production

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "❌ Backend dependency installation failed" -ForegroundColor Red
    exit 1
}

# Step 4: Check environment variables
Write-Host "`n🔍 Checking environment variables..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Write-Host "❌ .env file not found in backend directory" -ForegroundColor Red
    Write-Host "Please create .env file with required variables" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Environment file found" -ForegroundColor Green

# Step 5: Summary
Write-Host "`n✅ Deployment preparation complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. For local deployment: cd backend; npm start"
Write-Host "2. For Vercel: Deploy frontend/build folder"
Write-Host "3. For Render: Push to GitHub (auto-deploys from render.yaml)"
Write-Host "4. For Docker: docker-compose up -d"
Write-Host "`n🎉 Happy deploying!" -ForegroundColor Cyan
