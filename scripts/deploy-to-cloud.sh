#!/bin/bash

echo "🚀 Deploying Xpert Forex Trade to Google Cloud Run..."

# Configuration
PROJECT_ID="xpert-forex-trade"
SERVICE_NAME="bot-server"
REGION="us-central1"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI not found. Install from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Set project
echo "📋 Setting project to $PROJECT_ID..."
gcloud config set project $PROJECT_ID

# Build container
echo "🔨 Building container image..."
cd scripts
gcloud builds submit --tag $IMAGE_NAME

# Deploy to Cloud Run
echo "☁️ Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10 \
  --set-env-vars "ENVIRONMENT=production"

# Get service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --format 'value(status.url)')

echo ""
echo "✅ Deployment complete!"
echo "📊 Bot API URL: $SERVICE_URL"
echo ""
echo "Next steps:"
echo "1. Update js/bot-integration.js with: const BOT_API_URL = '$SERVICE_URL';"
echo "2. Update js/signal-history.js with: const BOT_API_URL = '$SERVICE_URL';"
echo "3. Test: curl $SERVICE_URL/health"
echo "4. Upload website to Hostinger"
