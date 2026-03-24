#!/bin/bash
# MentorHub Frontend - Production Deploy Script
# Usage: ./deploy.sh <api-domain>
# Example: ./deploy.sh https://api.mentorhub.com

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check arguments
if [ -z "$1" ]; then
  echo -e "${RED}Error: API domain not provided${NC}"
  echo "Usage: ./deploy.sh <api-domain>"
  echo "Example: ./deploy.sh https://api.mentorhub.com"
  exit 1
fi

API_DOMAIN=$1
PROJECT_NAME="mentorhub-frontend"
REGION="us-central1"

echo -e "${YELLOW}🚀 MentorHub Frontend Production Deploy${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "API Domain: $API_DOMAIN"
echo "Region: $REGION"
echo ""

# Step 1: Install dependencies
echo -e "${YELLOW}📦 Step 1: Installing dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Step 2: Build project
echo -e "${YELLOW}🔨 Step 2: Building project...${NC}"
npm run build
if [ -d "dist" ]; then
  echo -e "${GREEN}✓ Build successful${NC}"
else
  echo -e "${RED}✗ Build failed${NC}"
  exit 1
fi
echo ""

# Step 3: Deploy to Cloud Run
echo -e "${YELLOW}☁️  Step 3: Deploying to Google Cloud Run...${NC}"
gcloud run deploy $PROJECT_NAME \
  --source . \
  --platform managed \
  --region $REGION \
  --set-env-vars="VITE_API_BASE_URL=$API_DOMAIN" \
  --allow-unauthenticated \
  --memory=256Mi \
  --cpu=1

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Deployment successful${NC}"
else
  echo -e "${RED}✗ Deployment failed${NC}"
  exit 1
fi
echo ""

# Step 4: Get service URL
echo -e "${YELLOW}🔗 Getting service URL...${NC}"
SERVICE_URL=$(gcloud run services describe $PROJECT_NAME --region $REGION --format 'value(status.url)')
echo -e "${GREEN}✓ Service deployed at: $SERVICE_URL${NC}"
echo ""

# Step 5: Summary
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ DEPLOYMENT COMPLETE${NC}"
echo ""
echo "Service URL: $SERVICE_URL"
echo "API Domain: $API_DOMAIN"
echo "Region: $REGION"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Test the application at: $SERVICE_URL"
echo "2. Verify all features work (auth, bookings, profiles)"
echo "3. Check error handling with network issues"
echo "4. Monitor Cloud Run logs: gcloud run logs read $PROJECT_NAME --region $REGION"
echo ""
echo -e "${GREEN}Happy deploying! 🎉${NC}"

