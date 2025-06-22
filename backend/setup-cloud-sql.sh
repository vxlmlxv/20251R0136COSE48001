#!/bin/bash

# Cloud SQL Setup Script for Preffy Video Flow
# This script creates and configures the Cloud SQL MySQL instance

set -e

# Configuration
PROJECT_ID=${1:-"preffy-video-platform"}
REGION=${2:-"us-west2"}
INSTANCE_NAME="preffy-mysql"
DATABASE_NAME="preffy_db"
DB_USER="preffy_user"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🗄️  Preffy Video Flow - Cloud SQL Setup${NC}"
echo "========================================="

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Set project
echo -e "${YELLOW}📝 Setting project to: ${PROJECT_ID}${NC}"
gcloud config set project ${PROJECT_ID}

# Enable Cloud SQL API
echo -e "${YELLOW}🔧 Enabling Cloud SQL API...${NC}"
gcloud services enable sqladmin.googleapis.com

# Check if instance already exists
if gcloud sql instances describe ${INSTANCE_NAME} &> /dev/null; then
    echo -e "${GREEN}✅ Cloud SQL instance '${INSTANCE_NAME}' already exists${NC}"
    INSTANCE_EXISTS=true
else
    INSTANCE_EXISTS=false
fi

# Create Cloud SQL instance if it doesn't exist
if [ "$INSTANCE_EXISTS" = false ]; then
    echo -e "${YELLOW}🏗️  Creating Cloud SQL instance...${NC}"
    echo "This may take several minutes..."
    
    # Prompt for root password
    echo -e "${YELLOW}Please enter a secure root password for the MySQL instance:${NC}"
    read -s ROOT_PASSWORD
    echo
    
    gcloud sql instances create ${INSTANCE_NAME} \
        --database-version=MYSQL_8_0 \
        --tier=db-f1-micro \
        --region=${REGION} \
        --root-password=${ROOT_PASSWORD} \
        --storage-type=SSD \
        --storage-size=10GB \
        --storage-auto-increase \
        --backup-start-time=03:00 \
        --enable-bin-log \
        --maintenance-window-day=SUN \
        --maintenance-window-hour=04 \
        --deletion-protection
    
    echo -e "${GREEN}✅ Cloud SQL instance created successfully${NC}"
else
    echo -e "${YELLOW}ℹ️  Using existing Cloud SQL instance${NC}"
fi

# Check if database exists
if gcloud sql databases describe ${DATABASE_NAME} --instance=${INSTANCE_NAME} &> /dev/null; then
    echo -e "${GREEN}✅ Database '${DATABASE_NAME}' already exists${NC}"
else
    echo -e "${YELLOW}🗄️  Creating database...${NC}"
    gcloud sql databases create ${DATABASE_NAME} --instance=${INSTANCE_NAME}
    echo -e "${GREEN}✅ Database created successfully${NC}"
fi

# Check if user exists
if gcloud sql users describe ${DB_USER} --instance=${INSTANCE_NAME} &> /dev/null; then
    echo -e "${GREEN}✅ User '${DB_USER}' already exists${NC}"
    echo -e "${YELLOW}⚠️  If you need to reset the password, delete the user and run this script again${NC}"
else
    echo -e "${YELLOW}👤 Creating database user...${NC}"
    echo -e "${YELLOW}Please enter a secure password for the database user '${DB_USER}':${NC}"
    read -s DB_PASSWORD
    echo
    
    gcloud sql users create ${DB_USER} \
        --instance=${INSTANCE_NAME} \
        --password=${DB_PASSWORD}
    
    echo -e "${GREEN}✅ Database user created successfully${NC}"
fi

# Get connection information
CONNECTION_NAME=$(gcloud sql instances describe ${INSTANCE_NAME} --format="value(connectionName)")
IP_ADDRESS=$(gcloud sql instances describe ${INSTANCE_NAME} --format="value(ipAddresses[0].ipAddress)")

echo -e "${GREEN}✅ Cloud SQL setup completed!${NC}"
echo ""
echo -e "${BLUE}📋 Connection Information:${NC}"
echo "================================"
echo -e "${YELLOW}Instance Connection Name:${NC} ${CONNECTION_NAME}"
echo -e "${YELLOW}Instance IP Address:${NC} ${IP_ADDRESS}"
echo -e "${YELLOW}Database Name:${NC} ${DATABASE_NAME}"
echo -e "${YELLOW}Database User:${NC} ${DB_USER}"
echo ""
echo -e "${BLUE}🔧 Environment Variables for Cloud Run:${NC}"
echo "========================================"
echo "CLOUDSQL_INSTANCE_CONNECTION_NAME=${CONNECTION_NAME}"
echo "DB_USER=${DB_USER}"
echo "DB_PASSWORD=[your_database_password]"
echo ""
echo -e "${BLUE}🔐 Security Recommendations:${NC}"
echo "============================"
echo "1. Store database password in Google Secret Manager"
echo "2. Use IAM database authentication when possible"
echo "3. Configure VPC peering for private access"
echo "4. Regularly update and patch the database"
echo "5. Monitor database access logs"
echo ""
echo -e "${YELLOW}⚠️  Important Notes:${NC}"
echo "- The instance has deletion protection enabled"
echo "- Automated backups are configured for 3:00 AM daily"
echo "- Maintenance window is set for Sundays at 4:00 AM"
echo "- Binary logging is enabled for point-in-time recovery"
echo ""
echo -e "${BLUE}📚 Next Steps:${NC}"
echo "1. Configure your Cloud Run service with the connection details above"
echo "2. Set up database monitoring and alerting"
echo "3. Consider setting up read replicas for high availability"
echo "4. Review and adjust instance tier based on actual usage"

# Save connection info to file
cat > cloud-sql-connection-info.txt << EOF
# Cloud SQL Connection Information
# Generated on $(date)

Instance Connection Name: ${CONNECTION_NAME}
Instance IP Address: ${IP_ADDRESS}
Database Name: ${DATABASE_NAME}
Database User: ${DB_USER}

# Environment Variables for Cloud Run:
CLOUDSQL_INSTANCE_CONNECTION_NAME=${CONNECTION_NAME}
DB_USER=${DB_USER}
DB_PASSWORD=[your_database_password]

# Connection URL for application.properties:
spring.datasource.url=jdbc:mysql://google/${DATABASE_NAME}?cloudSqlInstance=${CONNECTION_NAME}&socketFactory=com.google.cloud.sql.mysql.SocketFactory&useSSL=false
EOF

echo ""
echo -e "${GREEN}💾 Connection information saved to: cloud-sql-connection-info.txt${NC}"
