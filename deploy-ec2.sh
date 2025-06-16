#!/bin/bash

# Preffy Backend - AWS EC2 Deployment Script
# This script deploys the Spring Boot backend to AWS EC2

set -e

# Configuration
AWS_REGION=${AWS_REGION:-"us-east-1"}
KEY_NAME=${KEY_NAME:-"preffy-key-pair"}
INSTANCE_TYPE=${INSTANCE_TYPE:-"t3.micro"}
SECURITY_GROUP_NAME="preffy-backend-sg"
EC2_NAME="preffy-backend-server"
JAR_NAME="preffy-backend.jar"

echo "🚀 Deploying Preffy Backend to AWS EC2..."
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ Error: AWS CLI is not installed."
    echo "💡 Install it from: https://aws.amazon.com/cli/"
    exit 1
fi

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ Error: AWS credentials not configured."
    echo "💡 Run: aws configure"
    exit 1
fi

echo "📋 Configuration:"
echo "   Region: $AWS_REGION"
echo "   Instance Type: $INSTANCE_TYPE"
echo "   Key Name: $KEY_NAME"
echo "   Security Group: $SECURITY_GROUP_NAME"
echo ""

# Build the Spring Boot JAR
echo "🔨 Building Spring Boot application..."
cd backend
./gradlew clean build -x test
cd ..

if [ ! -f "backend/build/libs/demo-0.0.1-SNAPSHOT.jar" ]; then
    echo "❌ Error: JAR file not found after build."
    exit 1
fi

# Copy and rename JAR
cp backend/build/libs/demo-0.0.1-SNAPSHOT.jar $JAR_NAME
echo "✅ JAR built successfully: $JAR_NAME"

# Create EC2 key pair if it doesn't exist
if ! aws ec2 describe-key-pairs --key-names $KEY_NAME --region $AWS_REGION &> /dev/null; then
    echo "🔑 Creating EC2 key pair..."
    aws ec2 create-key-pair \
        --key-name $KEY_NAME \
        --region $AWS_REGION \
        --query 'KeyMaterial' \
        --output text > ${KEY_NAME}.pem
    chmod 400 ${KEY_NAME}.pem
    echo "✅ Key pair created: ${KEY_NAME}.pem"
else
    echo "✅ Key pair already exists: $KEY_NAME"
fi

# Create security group if it doesn't exist
SECURITY_GROUP_ID=$(aws ec2 describe-security-groups \
    --filters "Name=group-name,Values=$SECURITY_GROUP_NAME" \
    --region $AWS_REGION \
    --query 'SecurityGroups[0].GroupId' \
    --output text 2>/dev/null || echo "None")

if [ "$SECURITY_GROUP_ID" = "None" ]; then
    echo "🔒 Creating security group..."
    SECURITY_GROUP_ID=$(aws ec2 create-security-group \
        --group-name $SECURITY_GROUP_NAME \
        --description "Security group for Preffy Backend" \
        --region $AWS_REGION \
        --query 'GroupId' \
        --output text)
    
    # Add inbound rules
    aws ec2 authorize-security-group-ingress \
        --group-id $SECURITY_GROUP_ID \
        --protocol tcp \
        --port 22 \
        --cidr 0.0.0.0/0 \
        --region $AWS_REGION
    
    aws ec2 authorize-security-group-ingress \
        --group-id $SECURITY_GROUP_ID \
        --protocol tcp \
        --port 8080 \
        --cidr 0.0.0.0/0 \
        --region $AWS_REGION
    
    echo "✅ Security group created: $SECURITY_GROUP_ID"
else
    echo "✅ Security group already exists: $SECURITY_GROUP_ID"
fi

# Get the latest Amazon Linux 2023 AMI
AMI_ID=$(aws ec2 describe-images \
    --owners amazon \
    --filters "Name=name,Values=al2023-ami-*" "Name=architecture,Values=x86_64" \
    --region $AWS_REGION \
    --query 'Images | sort_by(@, &CreationDate) | [-1].ImageId' \
    --output text)

echo "🖥️  Using AMI: $AMI_ID"

# Launch EC2 instance
echo "🚀 Launching EC2 instance..."
INSTANCE_ID=$(aws ec2 run-instances \
    --image-id $AMI_ID \
    --count 1 \
    --instance-type $INSTANCE_TYPE \
    --key-name $KEY_NAME \
    --security-group-ids $SECURITY_GROUP_ID \
    --region $AWS_REGION \
    --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=$EC2_NAME}]" \
    --user-data file://ec2-user-data.sh \
    --query 'Instances[0].InstanceId' \
    --output text)

echo "✅ Instance launched: $INSTANCE_ID"

# Wait for instance to be running
echo "⏳ Waiting for instance to be running..."
aws ec2 wait instance-running --instance-ids $INSTANCE_ID --region $AWS_REGION

# Get public IP
PUBLIC_IP=$(aws ec2 describe-instances \
    --instance-ids $INSTANCE_ID \
    --region $AWS_REGION \
    --query 'Reservations[0].Instances[0].PublicIpAddress' \
    --output text)

echo "✅ Instance is running!"
echo ""
echo "📋 Instance Details:"
echo "   Instance ID: $INSTANCE_ID"
echo "   Public IP: $PUBLIC_IP"
echo "   SSH Access: ssh -i ${KEY_NAME}.pem ec2-user@$PUBLIC_IP"
echo ""

# Wait a bit for the instance to fully initialize
echo "⏳ Waiting for instance to initialize (60 seconds)..."
sleep 60

# Copy JAR to EC2 instance
echo "📦 Copying JAR file to EC2 instance..."
scp -i ${KEY_NAME}.pem -o StrictHostKeyChecking=no $JAR_NAME ec2-user@$PUBLIC_IP:/home/ec2-user/

# Copy application properties
scp -i ${KEY_NAME}.pem -o StrictHostKeyChecking=no application-production.properties ec2-user@$PUBLIC_IP:/home/ec2-user/

# Start the application
echo "🚀 Starting Spring Boot application..."
ssh -i ${KEY_NAME}.pem -o StrictHostKeyChecking=no ec2-user@$PUBLIC_IP << 'EOF'
# Start the application in the background
nohup java -jar preffy-backend.jar --spring.config.location=application-production.properties > application.log 2>&1 &

# Wait a moment for startup
sleep 10

# Check if application is running
if curl -f http://localhost:8080/api/projects > /dev/null 2>&1; then
    echo "✅ Application started successfully!"
else
    echo "⚠️  Application may still be starting up..."
fi
EOF

echo ""
echo "🎉 Deployment Complete!"
echo ""
echo "🌐 Your Spring Boot backend is now running at:"
echo "   http://$PUBLIC_IP:8080"
echo ""
echo "🔗 API Endpoints:"
echo "   API Docs: http://$PUBLIC_IP:8080/swagger-ui/index.html"
echo ""
echo "🔧 Management Commands:"
echo "   SSH to server: ssh -i ${KEY_NAME}.pem ec2-user@$PUBLIC_IP"
echo "   View logs: ssh -i ${KEY_NAME}.pem ec2-user@$PUBLIC_IP 'tail -f application.log'"
echo "   Restart app: ssh -i ${KEY_NAME}.pem ec2-user@$PUBLIC_IP 'pkill java && nohup java -jar preffy-backend.jar --spring.config.location=application-production.properties > application.log 2>&1 &'"
echo ""
echo "💰 Cost: ~$8-12/month for t3.micro instance"
echo "🛑 To stop: aws ec2 stop-instances --instance-ids $INSTANCE_ID --region $AWS_REGION"
echo "🗑️  To terminate: aws ec2 terminate-instances --instance-ids $INSTANCE_ID --region $AWS_REGION"


