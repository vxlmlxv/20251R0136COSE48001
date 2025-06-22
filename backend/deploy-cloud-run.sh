#!/bin/bash

# Preffy Video Flow Backend - Cloud Run Deployment Script
# This script sets up and deploys the backend to Google Cloud Run

set -e

# Configuration
PROJECT_ID=${1:-"preffy-video-platform"}
REGION=${2:-"us-central1"}
SERVICE_NAME="preffy-backend"
REPOSITORY_NAME="preffy-video-flow"
IMAGE_NAME="backend"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Preffy Video Flow Backend - Cloud Run Deployment${NC}"
echo "=============================================="

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo -e "${YELLOW}⚠️  Not authenticated with gcloud. Running authentication...${NC}"
    gcloud auth login
fi

# Set project
echo -e "${YELLOW}📝 Setting project to: ${PROJECT_ID}${NC}"
gcloud config set project ${PROJECT_ID}

# Enable required APIs
echo -e "${YELLOW}🔧 Enabling required APIs...${NC}"
gcloud services enable \
    cloudbuild.googleapis.com \
    run.googleapis.com \
    artifactregistry.googleapis.com \
    sqladmin.googleapis.com \
    storage.googleapis.com

# Create Artifact Registry repository if it doesn't exist
echo -e "${YELLOW}📦 Setting up Artifact Registry...${NC}"
if ! gcloud artifacts repositories describe ${REPOSITORY_NAME} --location=${REGION} &> /dev/null; then
    echo -e "${YELLOW}Creating Artifact Registry repository...${NC}"
    gcloud artifacts repositories create ${REPOSITORY_NAME} \
        --repository-format=docker \
        --location=${REGION} \
        --description="Preffy Video Flow Docker images"
else
    echo -e "${GREEN}✅ Artifact Registry repository already exists${NC}"
fi

# Configure Docker authentication
echo -e "${YELLOW}🔐 Configuring Docker authentication...${NC}"
gcloud auth configure-docker ${REGION}-docker.pkg.dev

# Create service account for Cloud Run if it doesn't exist
SA_EMAIL="preffy-backend@${PROJECT_ID}.iam.gserviceaccount.com"
echo -e "${YELLOW}👤 Setting up service account...${NC}"
if ! gcloud iam service-accounts describe ${SA_EMAIL} &> /dev/null; then
    echo -e "${YELLOW}Creating service account...${NC}"
    gcloud iam service-accounts create preffy-backend \
        --display-name="Preffy Backend Service Account" \
        --description="Service account for Preffy Video Flow backend"
    
    # Grant necessary permissions
    gcloud projects add-iam-policy-binding ${PROJECT_ID} \
        --member="serviceAccount:${SA_EMAIL}" \
        --role="roles/cloudsql.client"
    
    gcloud projects add-iam-policy-binding ${PROJECT_ID} \
        --member="serviceAccount:${SA_EMAIL}" \
        --role="roles/storage.admin"
else
    echo -e "${GREEN}✅ Service account already exists${NC}"
fi

# Build and deploy using Cloud Build
echo -e "${YELLOW}🏗️  Building and deploying with Cloud Build...${NC}"
cd "$(dirname "$0")"

# Create a temporary env file with deployment variables
cat > .env.deploy << EOF
CLOUDSQL_INSTANCE_CONNECTION_NAME=${PROJECT_ID}:${REGION}:preffy-mysql
SERVICE_ACCOUNT_EMAIL=${SA_EMAIL}
EOF

# Submit build to Cloud Build
gcloud builds submit . \
    --config=cloudbuild.yaml \
    --substitutions=_CLOUDSQL_INSTANCE_CONNECTION_NAME=${PROJECT_ID}:${REGION}:preffy-mysql,_SERVICE_ACCOUNT_EMAIL=${SA_EMAIL}

# Clean up temporary files
rm -f .env.deploy

echo -e "${GREEN}✅ Deployment completed!${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Set up environment variables in Cloud Run:"
echo "   - DB_PASSWORD: Your database password"
echo "   - JWT_SECRET: Your JWT secret key"
echo "   - GCS_BUCKET_NAME: Your storage bucket name"
echo ""
echo "2. Configure your Cloud SQL instance and database"
echo ""
echo "3. Test your deployment:"
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} --region=${REGION} --format="value(status.url)")
echo -e "${GREEN}   Service URL: ${SERVICE_URL}${NC}"
echo -e "${GREEN}   Health Check: ${SERVICE_URL}/actuator/health${NC}"
echo ""
echo -e "${YELLOW}⚠️  Remember to configure your frontend CORS settings to allow the new Cloud Run URL${NC}"
