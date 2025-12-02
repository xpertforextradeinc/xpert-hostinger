# 🚀 Deploy Xpert Forex Trade to Google Cloud Run
# PowerShell deployment script for Windows

Write-Host "🚀 Deploying Xpert Forex Trade to Google Cloud Run..." -ForegroundColor Cyan

# Configuration
$PROJECT_ID = "xpert-forex-trade"
$SERVICE_NAME = "bot-server"
$REGION = "us-central1"
$IMAGE_NAME = "gcr.io/$PROJECT_ID/$SERVICE_NAME"

# Check if gcloud is installed
if (-not (Get-Command gcloud -ErrorAction SilentlyContinue)) {
    Write-Host "❌ gcloud CLI not found. Install from: https://cloud.google.com/sdk/docs/install" -ForegroundColor Red
    exit 1
}

# Set project
Write-Host "📋 Setting project to $PROJECT_ID..." -ForegroundColor Yellow
gcloud config set project $PROJECT_ID

# Build container
Write-Host "🔨 Building container image..." -ForegroundColor Yellow
Set-Location -Path "C:\Users\USER\Projects\xpert-hostinger\scripts"
gcloud builds submit --tag $IMAGE_NAME

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

# Deploy to Cloud Run
Write-Host "☁️ Deploying to Cloud Run..." -ForegroundColor Yellow
gcloud run deploy $SERVICE_NAME `
  --image $IMAGE_NAME `
  --platform managed `
  --region $REGION `
  --allow-unauthenticated `
  --memory 512Mi `
  --cpu 1 `
  --max-instances 10 `
  --set-env-vars "ENVIRONMENT=production"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    exit 1
}

# Get service URL
$SERVICE_URL = gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --format "value(status.url)"

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "📊 Bot API URL: $SERVICE_URL" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Update js/bot-integration.js with: const BOT_API_URL = '$SERVICE_URL';" -ForegroundColor White
Write-Host "2. Update js/signal-history.js with: const BOT_API_URL = '$SERVICE_URL';" -ForegroundColor White
Write-Host "3. Test: curl $SERVICE_URL/health" -ForegroundColor White
Write-Host "4. Upload website to Hostinger" -ForegroundColor White
Write-Host ""
Write-Host "🧪 Testing API health..." -ForegroundColor Yellow
curl "$SERVICE_URL/health"
