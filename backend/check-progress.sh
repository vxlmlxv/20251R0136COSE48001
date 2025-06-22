#!/bin/bash

# Simple deployment progress checker

echo "🔍 Checking deployment progress..."

# Check if APIs are enabled
echo "📡 API Status:"
gcloud services list --enabled --filter="name:(cloudbuild.googleapis.com OR run.googleapis.com OR sqladmin.googleapis.com)" --format="value(name)" 2>/dev/null | while read api; do
    echo "  ✅ $api"
done

# Check if Cloud SQL instance exists
echo -e "\n🗄️ Cloud SQL Status:"
if gcloud sql instances list --format="value(name)" 2>/dev/null | grep -q "preffy-mysql"; then
    echo "  ✅ preffy-mysql instance exists"
else
    echo "  ❌ preffy-mysql instance not found"
fi

# Check if Cloud Run service exists
echo -e "\n🚀 Cloud Run Status:"
if gcloud run services list --region=us-central1 --format="value(metadata.name)" 2>/dev/null | grep -q "preffy-backend"; then
    echo "  ✅ preffy-backend service exists"
    SERVICE_URL=$(gcloud run services describe preffy-backend --region=us-central1 --format="value(status.url)" 2>/dev/null)
    echo "  📍 Service URL: $SERVICE_URL"
else
    echo "  ❌ preffy-backend service not found"
fi

# Check if Artifact Registry exists
echo -e "\n📦 Artifact Registry Status:"
if gcloud artifacts repositories list --location=us-central1 --format="value(name)" 2>/dev/null | grep -q "preffy-video-flow"; then
    echo "  ✅ preffy-video-flow repository exists"
else
    echo "  ❌ preffy-video-flow repository not found"
fi

echo -e "\n✨ Check complete!"
