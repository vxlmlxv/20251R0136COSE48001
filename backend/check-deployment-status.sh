#!/bin/bash

# Preffy Video Flow - Deployment Status Checker
# This script checks the status of backend server and database deployment

set -e

# Configuration
PROJECT_ID=${1:-"preffy-video-platform"}
REGION=${2:-"us-west2"}
SERVICE_NAME="preffy-backend"
INSTANCE_NAME="preffy-mysql"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Preffy Video Flow - Deployment Status Check${NC}"
echo "================================================"

# Check if gcloud is installed and authenticated
echo -e "${YELLOW}🔐 Checking Google Cloud authentication...${NC}"
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI is not installed${NC}"
    exit 1
fi

if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo -e "${RED}❌ Not authenticated with gcloud${NC}"
    echo -e "${YELLOW}💡 Run: gcloud auth login${NC}"
    exit 1
else
    ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format="value(account)")
    echo -e "${GREEN}✅ Authenticated as: ${ACCOUNT}${NC}"
fi

# Check project configuration
echo -e "${YELLOW}📝 Checking project configuration...${NC}"
CURRENT_PROJECT=$(gcloud config get-value project 2>/dev/null || echo "")
if [ "$CURRENT_PROJECT" != "$PROJECT_ID" ]; then
    echo -e "${YELLOW}⚠️  Setting project to: ${PROJECT_ID}${NC}"
    gcloud config set project ${PROJECT_ID}
else
    echo -e "${GREEN}✅ Project set to: ${PROJECT_ID}${NC}"
fi

# Check enabled APIs
echo -e "${YELLOW}🔧 Checking required APIs...${NC}"
REQUIRED_APIS=(
    "cloudbuild.googleapis.com"
    "run.googleapis.com"
    "artifactregistry.googleapis.com"
    "sqladmin.googleapis.com"
    "storage.googleapis.com"
)

for api in "${REQUIRED_APIS[@]}"; do
    if gcloud services list --enabled --filter="name:${api}" --format="value(name)" | grep -q "${api}"; then
        echo -e "${GREEN}✅ ${api} is enabled${NC}"
    else
        echo -e "${RED}❌ ${api} is not enabled${NC}"
        echo -e "${YELLOW}💡 Enable with: gcloud services enable ${api}${NC}"
    fi
done

# Check Cloud SQL instance
echo -e "${YELLOW}🗄️  Checking Cloud SQL instance...${NC}"
if gcloud sql instances describe ${INSTANCE_NAME} &> /dev/null; then
    echo -e "${GREEN}✅ Cloud SQL instance '${INSTANCE_NAME}' exists${NC}"
    
    # Get instance details
    INSTANCE_STATE=$(gcloud sql instances describe ${INSTANCE_NAME} --format="value(state)")
    INSTANCE_IP=$(gcloud sql instances describe ${INSTANCE_NAME} --format="value(ipAddresses[0].ipAddress)")
    INSTANCE_CONNECTION=$(gcloud sql instances describe ${INSTANCE_NAME} --format="value(connectionName)")
    
    echo -e "   State: ${INSTANCE_STATE}"
    echo -e "   IP Address: ${INSTANCE_IP}"
    echo -e "   Connection Name: ${INSTANCE_CONNECTION}"
    
    # Check databases
    echo -e "${YELLOW}📊 Checking databases...${NC}"
    if gcloud sql databases describe preffy_db --instance=${INSTANCE_NAME} &> /dev/null; then
        echo -e "${GREEN}✅ Database 'preffy_db' exists${NC}"
    else
        echo -e "${RED}❌ Database 'preffy_db' does not exist${NC}"
    fi
    
    # Check users
    echo -e "${YELLOW}👤 Checking database users...${NC}"
    if gcloud sql users list --instance=${INSTANCE_NAME} --format="value(name)" | grep -q "preffy_user"; then
        echo -e "${GREEN}✅ Database user 'preffy_user' exists${NC}"
    else
        echo -e "${RED}❌ Database user 'preffy_user' does not exist${NC}"
    fi
else
    echo -e "${RED}❌ Cloud SQL instance '${INSTANCE_NAME}' does not exist${NC}"
    echo -e "${YELLOW}💡 Run: ./setup-cloud-sql.sh${NC}"
fi

# Check Artifact Registry
echo -e "${YELLOW}📦 Checking Artifact Registry...${NC}"
if gcloud artifacts repositories describe preffy-video-flow --location=${REGION} &> /dev/null; then
    echo -e "${GREEN}✅ Artifact Registry repository exists${NC}"
else
    echo -e "${RED}❌ Artifact Registry repository does not exist${NC}"
fi

# Check Cloud Run service
echo -e "${YELLOW}🚀 Checking Cloud Run service...${NC}"
if gcloud run services describe ${SERVICE_NAME} --region=${REGION} &> /dev/null; then
    echo -e "${GREEN}✅ Cloud Run service '${SERVICE_NAME}' exists${NC}"
    
    # Get service details
    SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} --region=${REGION} --format="value(status.url)")
    SERVICE_IMAGE=$(gcloud run services describe ${SERVICE_NAME} --region=${REGION} --format="value(spec.template.spec.template.spec.containers[0].image)")
    
    echo -e "   Service URL: ${SERVICE_URL}"
    echo -e "   Current Image: ${SERVICE_IMAGE}"
    
    # Test health endpoint
    echo -e "${YELLOW}🏥 Testing health endpoint...${NC}"
    if curl -s -f "${SERVICE_URL}/actuator/health" > /dev/null; then
        echo -e "${GREEN}✅ Health endpoint is responding${NC}"
        HEALTH_RESPONSE=$(curl -s "${SERVICE_URL}/actuator/health")
        echo -e "   Health Status: ${HEALTH_RESPONSE}"
    else
        echo -e "${RED}❌ Health endpoint is not responding${NC}"
        echo -e "${YELLOW}💡 Check service logs: gcloud logging read \"resource.type=cloud_run_revision AND resource.labels.service_name=${SERVICE_NAME}\" --limit 10${NC}"
    fi
    
    # Test API endpoint
    echo -e "${YELLOW}🔌 Testing API endpoint...${NC}"
    if curl -s -f "${SERVICE_URL}/api/health" > /dev/null; then
        echo -e "${GREEN}✅ API endpoint is responding${NC}"
    else
        echo -e "${RED}❌ API endpoint is not responding${NC}"
    fi
else
    echo -e "${RED}❌ Cloud Run service '${SERVICE_NAME}' does not exist${NC}"
    echo -e "${YELLOW}💡 Run: ./deploy-cloud-run.sh${NC}"
fi

# Check service account
echo -e "${YELLOW}👤 Checking service account...${NC}"
SA_EMAIL="preffy-backend@${PROJECT_ID}.iam.gserviceaccount.com"
if gcloud iam service-accounts describe ${SA_EMAIL} &> /dev/null; then
    echo -e "${GREEN}✅ Service account exists: ${SA_EMAIL}${NC}"
else
    echo -e "${RED}❌ Service account does not exist: ${SA_EMAIL}${NC}"
fi

# Summary
echo ""
echo -e "${BLUE}📋 Summary${NC}"
echo "=========="

# Count status
CHECKS_PASSED=0
TOTAL_CHECKS=6

if gcloud sql instances describe ${INSTANCE_NAME} &> /dev/null; then ((CHECKS_PASSED++)); fi
if gcloud artifacts repositories describe preffy-video-flow --location=${REGION} &> /dev/null; then ((CHECKS_PASSED++)); fi
if gcloud run services describe ${SERVICE_NAME} --region=${REGION} &> /dev/null; then ((CHECKS_PASSED++)); fi
if gcloud iam service-accounts describe ${SA_EMAIL} &> /dev/null; then ((CHECKS_PASSED++)); fi

# Add API and health checks
API_COUNT=0
for api in "${REQUIRED_APIS[@]}"; do
    if gcloud services list --enabled --filter="name:${api}" --format="value(name)" | grep -q "${api}"; then
        ((API_COUNT++))
    fi
done

if [ ${API_COUNT} -eq ${#REQUIRED_APIS[@]} ]; then ((CHECKS_PASSED++)); fi

if gcloud run services describe ${SERVICE_NAME} --region=${REGION} &> /dev/null; then
    SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} --region=${REGION} --format="value(status.url)")
    if curl -s -f "${SERVICE_URL}/actuator/health" > /dev/null; then
        ((CHECKS_PASSED++))
    fi
fi

echo -e "Status: ${CHECKS_PASSED}/${TOTAL_CHECKS} checks passed"

if [ ${CHECKS_PASSED} -eq ${TOTAL_CHECKS} ]; then
    echo -e "${GREEN}🎉 All systems operational!${NC}"
else
    echo -e "${YELLOW}⚠️  Some components need attention${NC}"
    echo ""
    echo -e "${BLUE}Next Steps:${NC}"
    if ! gcloud sql instances describe ${INSTANCE_NAME} &> /dev/null; then
        echo -e "1. Set up Cloud SQL: ${YELLOW}./setup-cloud-sql.sh${NC}"
    fi
    if ! gcloud run services describe ${SERVICE_NAME} --region=${REGION} &> /dev/null; then
        echo -e "2. Deploy backend: ${YELLOW}./deploy-cloud-run.sh${NC}"
    fi
    echo -e "3. Check logs: ${YELLOW}gcloud logging read \"resource.type=cloud_run_revision\" --limit 10${NC}"
fi

echo ""
echo -e "${BLUE}📖 For detailed deployment instructions, see: MANUAL_DEPLOYMENT.md${NC}"
