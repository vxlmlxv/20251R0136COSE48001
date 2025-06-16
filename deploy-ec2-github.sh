#!/bin/bash

# Preffy Backend - AWS EC2 GitHub Deployment Script
# This script deploys by cloning from GitHub repository

set -e

# Configuration
AWS_REGION=${AWS_REGION:-"us-east-1"}
KEY_NAME=${KEY_NAME:-"preffy-key-pair"}
INSTANCE_TYPE=${INSTANCE_TYPE:-"t3.micro"}
SECURITY_GROUP_NAME="preffy-backend-sg"
EC2_NAME="preffy-backend-server"
GITHUB_REPO="https://github.com/vxlmlxv/preffy.git"

echo "🚀 Deploying Preffy Backend from GitHub to AWS EC2..."
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
echo "   GitHub Repo: $GITHUB_REPO"
echo ""

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
    --user-data file://ec2-user-data-github.sh \
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

# Wait for the instance to fully initialize and application to start
echo "⏳ Waiting for instance to initialize and application to build (3 minutes)..."
echo "   This includes: system updates, Java installation, Git clone, Gradle build, and app startup"
sleep 180

# Test application availability
echo "🔍 Testing application availability..."
for i in {1..10}; do
    if curl -f http://$PUBLIC_IP:8080/api/health > /dev/null 2>&1; then
        echo "✅ Application is responding!"
        break
    elif curl -f http://$PUBLIC_IP:8080/swagger-ui/index.html > /dev/null 2>&1; then
        echo "✅ Application is responding (Swagger UI available)!"
        break
    else
        echo "⏳ Attempt $i/10 - Application not ready yet, waiting 30 seconds..."
        sleep 30
    fi
done

echo ""
echo "🎉 GitHub Deployment Complete!"
echo ""
echo "🌐 Your Spring Boot backend is now running at:"
echo "   Backend API: http://$PUBLIC_IP:8080"
echo "   Swagger UI: http://$PUBLIC_IP:8080/swagger-ui/index.html"
echo ""
echo "🔧 Management Commands:"
echo "   SSH: ssh -i ${KEY_NAME}.pem ec2-user@$PUBLIC_IP"
echo "   Check Status: ssh -i ${KEY_NAME}.pem ec2-user@$PUBLIC_IP './check-status.sh'"
echo "   View Logs: ssh -i ${KEY_NAME}.pem ec2-user@$PUBLIC_IP 'tail -f application.log'"
echo "   Restart App: ssh -i ${KEY_NAME}.pem ec2-user@$PUBLIC_IP './restart-app.sh'"
echo "   Redeploy: ssh -i ${KEY_NAME}.pem ec2-user@$PUBLIC_IP './redeploy.sh'"
echo ""
echo "📝 Notes:"
echo "   - Application builds from GitHub on first deploy (may take 3-5 minutes)"
echo "   - Uses H2 in-memory database (data resets on restart)"
echo "   - Repository: $GITHUB_REPO"
echo ""
echo "💰 Cost: ~$8-12/month for t3.micro instance"
echo "🛑 To stop: aws ec2 stop-instances --instance-ids $INSTANCE_ID --region $AWS_REGION"
echo "🗑️  To terminate: aws ec2 terminate-instances --instance-ids $INSTANCE_ID --region $AWS_REGION"

# Update manage-ec2.sh with new instance details
cat > manage-ec2.sh << EOF
#!/bin/bash

# Preffy Backend EC2 Management Script
INSTANCE_ID="$INSTANCE_ID"
KEY_NAME="$KEY_NAME"
AWS_REGION="$AWS_REGION"

case "\$1" in
    "status")
        echo "🔍 Checking Preffy Backend EC2 Status..."
        echo ""
        
        # Get instance details
        INSTANCE_INFO=\$(aws ec2 describe-instances \\
            --instance-ids \$INSTANCE_ID \\
            --region \$AWS_REGION \\
            --query 'Reservations[0].Instances[0].[State.Name,PublicIpAddress]' \\
            --output text)
        
        STATE=\$(echo \$INSTANCE_INFO | cut -d' ' -f1)
        PUBLIC_IP=\$(echo \$INSTANCE_INFO | cut -d' ' -f2)
        
        echo "📋 Instance Details:"
        echo "   Instance ID: \$INSTANCE_ID"
        echo "   State: \$STATE"
        echo "   Public IP: \$PUBLIC_IP"
        echo ""
        
        if [ "\$STATE" = "running" ]; then
            echo "🌐 Application URLs:"
            echo "   Backend API: http://\$PUBLIC_IP:8080"
            echo "   Swagger UI: http://\$PUBLIC_IP:8080/swagger-ui/index.html"
            echo ""
            echo "🔧 Management Commands:"
            echo "   SSH: ssh -i \${KEY_NAME}.pem ec2-user@\$PUBLIC_IP"
            echo "   Check Status: ssh -i \${KEY_NAME}.pem ec2-user@\$PUBLIC_IP './check-status.sh'"
            echo "   View Logs: ssh -i \${KEY_NAME}.pem ec2-user@\$PUBLIC_IP 'tail -f application.log'"
            echo "   Restart App: ssh -i \${KEY_NAME}.pem ec2-user@\$PUBLIC_IP './restart-app.sh'"
            echo "   Redeploy: ssh -i \${KEY_NAME}.pem ec2-user@\$PUBLIC_IP './redeploy.sh'"
            echo ""
            
            # Test application
            if curl -f http://\$PUBLIC_IP:8080/api/health > /dev/null 2>&1; then
                echo "✅ Application is responding!"
            elif curl -f http://\$PUBLIC_IP:8080/swagger-ui/index.html > /dev/null 2>&1; then
                echo "✅ Application is responding (Swagger UI)!"
            else
                echo "⚠️  Application may not be responding (still starting up?)"
            fi
        fi
        ;;
    "start")
        echo "▶️  Starting EC2 instance..."
        aws ec2 start-instances --instance-ids \$INSTANCE_ID --region \$AWS_REGION
        aws ec2 wait instance-running --instance-ids \$INSTANCE_ID --region \$AWS_REGION
        echo "✅ Instance started!"
        ;;
    "stop")
        echo "⏹️  Stopping EC2 instance..."
        aws ec2 stop-instances --instance-ids \$INSTANCE_ID --region \$AWS_REGION
        echo "✅ Instance stopped!"
        ;;
    "terminate")
        echo "🗑️  Terminating EC2 instance..."
        read -p "Are you sure? This will permanently delete the instance (y/N): " -n 1 -r
        echo
        if [[ \$REPLY =~ ^[Yy]\$ ]]; then
            aws ec2 terminate-instances --instance-ids \$INSTANCE_ID --region \$AWS_REGION
            echo "✅ Instance terminated!"
        else
            echo "❌ Termination cancelled"
        fi
        ;;
    *)
        echo "Usage: \$0 {status|start|stop|terminate}"
        echo ""
        echo "Commands:"
        echo "  status     - Show instance status and application URLs"
        echo "  start      - Start the stopped instance"
        echo "  stop       - Stop the running instance"
        echo "  terminate  - Permanently delete the instance"
        ;;
esac
EOF

chmod +x manage-ec2.sh

echo ""
echo "📝 Management script updated: ./manage-ec2.sh"
echo "   Usage: ./manage-ec2.sh {status|start|stop|terminate}"
