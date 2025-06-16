#!/bin/bash

# Preffy API Documentation - Google Cloud Run Deployment Script
# This script deploys the Swagger UI to Google Cloud Run

set -e

# Configuration
PROJECT_ID=${GOOGLE_CLOUD_PROJECT:-""}
REGION=${REGION:-"us-central1"}
SERVICE_NAME=${SERVICE_NAME:-"preffy-api-docs"}
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "🚀 Deploying Preffy API Documentation to Google Cloud Run..."
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Error: gcloud CLI is not installed."
    echo "💡 Install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "❌ Error: Not authenticated with gcloud."
    echo "💡 Run: gcloud auth login"
    exit 1
fi

# Get or set project ID
if [ -z "$PROJECT_ID" ]; then
    PROJECT_ID=$(gcloud config get-value project)
    if [ -z "$PROJECT_ID" ]; then
        echo "❌ Error: No Google Cloud project set."
        echo "💡 Run: gcloud config set project YOUR_PROJECT_ID"
        echo "💡 Or set environment variable: export GOOGLE_CLOUD_PROJECT=YOUR_PROJECT_ID"
        exit 1
    fi
fi

IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "📋 Configuration:"
echo "   Project ID: $PROJECT_ID"
echo "   Region: $REGION"
echo "   Service Name: $SERVICE_NAME"
echo "   Image: $IMAGE_NAME"
echo ""

# Enable required APIs
echo "🔧 Enabling required Google Cloud APIs..."
gcloud services enable cloudbuild.googleapis.com --project=$PROJECT_ID
gcloud services enable run.googleapis.com --project=$PROJECT_ID
gcloud services enable containerregistry.googleapis.com --project=$PROJECT_ID

# Build and push the image using Google Cloud Build
echo "🔨 Building and pushing Docker image to Google Container Registry..."
gcloud builds submit . --tag $IMAGE_NAME --project=$PROJECT_ID

if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to build and push image."
    exit 1
fi

# Deploy to Cloud Run
echo "🚀 Deploying to Google Cloud Run..."
gcloud run deploy $SERVICE_NAME \
    --image $IMAGE_NAME \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --port 8080 \
    --memory 512Mi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 10 \
    --project=$PROJECT_ID

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Success! Swagger UI deployed to Google Cloud Run."
    echo ""
    
    # Get the service URL
    SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --project=$PROJECT_ID --format='value(status.url)')
    
    echo "🌐 Your API Documentation is now available at:"
    echo "   $SERVICE_URL"
    echo ""
    echo "📋 Service Details:"
    echo "   Service Name: $SERVICE_NAME"
    echo "   Region: $REGION"
    echo "   Project: $PROJECT_ID"
    echo ""
    echo "🔧 Useful Commands:"
    echo "   View logs:    gcloud run services logs tail $SERVICE_NAME --region=$REGION --project=$PROJECT_ID"
    echo "   Update:       gcloud run services update $SERVICE_NAME --region=$REGION --project=$PROJECT_ID"
    echo "   Delete:       gcloud run services delete $SERVICE_NAME --region=$REGION --project=$PROJECT_ID"
    echo ""
    echo "💡 The service scales to zero when not in use (no cost when idle)."
    echo "💡 HTTPS is automatically provided by Google Cloud Run."
else
    echo "❌ Error: Failed to deploy to Cloud Run."
    exit 1
fi
