#!/bin/bash

# AWS EC2 Management Script for Preffy Backend

set -e

INSTANCE_NAME="preffy-backend-server"
AWS_REGION=${AWS_REGION:-"us-east-1"}

# Function to get instance ID by name
get_instance_id() {
    aws ec2 describe-instances \
        --filters "Name=tag:Name,Values=$INSTANCE_NAME" "Name=instance-state-name,Values=running,stopped" \
        --region $AWS_REGION \
        --query 'Reservations[0].Instances[0].InstanceId' \
        --output text 2>/dev/null || echo "None"
}

# Function to get instance public IP
get_public_ip() {
    local instance_id=$1
    aws ec2 describe-instances \
        --instance-ids $instance_id \
        --region $AWS_REGION \
        --query 'Reservations[0].Instances[0].PublicIpAddress' \
        --output text 2>/dev/null || echo "None"
}

# Function to get instance state
get_instance_state() {
    local instance_id=$1
    aws ec2 describe-instances \
        --instance-ids $instance_id \
        --region $AWS_REGION \
        --query 'Reservations[0].Instances[0].State.Name' \
        --output text 2>/dev/null || echo "None"
}

# Main script
case "${1:-status}" in
    "status")
        echo "🔍 Checking Preffy Backend EC2 Status..."
        echo ""
        
        INSTANCE_ID=$(get_instance_id)
        if [ "$INSTANCE_ID" = "None" ]; then
            echo "❌ No instance found with name: $INSTANCE_NAME"
            exit 1
        fi
        
        STATE=$(get_instance_state $INSTANCE_ID)
        PUBLIC_IP=$(get_public_ip $INSTANCE_ID)
        
        echo "📋 Instance Details:"
        echo "   Instance ID: $INSTANCE_ID"
        echo "   State: $STATE"
        echo "   Public IP: $PUBLIC_IP"
        echo ""
        
        if [ "$STATE" = "running" ]; then
            echo "🌐 Application URLs:"
            echo "   Backend API: http://$PUBLIC_IP:8080"
            echo "   Swagger UI: http://$PUBLIC_IP:8080/swagger-ui/index.html"
            echo ""
            echo "🔧 Management Commands:"
            echo "   SSH: ssh -i preffy-backend-key.pem ec2-user@$PUBLIC_IP"
            echo "   Check Status: ssh -i preffy-backend-key.pem ec2-user@$PUBLIC_IP './check-status.sh'"
            echo "   View Logs: ssh -i preffy-backend-key.pem ec2-user@$PUBLIC_IP 'tail -f application.log'"
            echo "   Restart App: ssh -i preffy-backend-key.pem ec2-user@$PUBLIC_IP './restart-app.sh'"
            
            # Test if application is responding
            if curl -f -s "http://$PUBLIC_IP:8080/swagger-ui/index.html" > /dev/null 2>&1; then
                echo ""
                echo "✅ Application is responding and Swagger UI is accessible!"
            else
                echo ""
                echo "⚠️  Application may not be responding (still starting up?)"
            fi
        fi
        ;;
        
    "start")
        echo "🚀 Starting Preffy Backend EC2 instance..."
        
        INSTANCE_ID=$(get_instance_id)
        if [ "$INSTANCE_ID" = "None" ]; then
            echo "❌ No instance found with name: $INSTANCE_NAME"
            exit 1
        fi
        
        aws ec2 start-instances --instance-ids $INSTANCE_ID --region $AWS_REGION
        echo "⏳ Waiting for instance to start..."
        aws ec2 wait instance-running --instance-ids $INSTANCE_ID --region $AWS_REGION
        
        PUBLIC_IP=$(get_public_ip $INSTANCE_ID)
        echo "✅ Instance started successfully!"
        echo "🌐 Public IP: $PUBLIC_IP"
        echo "⏳ Application may take 1-2 minutes to fully start"
        ;;
        
    "stop")
        echo "🛑 Stopping Preffy Backend EC2 instance..."
        
        INSTANCE_ID=$(get_instance_id)
        if [ "$INSTANCE_ID" = "None" ]; then
            echo "❌ No instance found with name: $INSTANCE_NAME"
            exit 1
        fi
        
        aws ec2 stop-instances --instance-ids $INSTANCE_ID --region $AWS_REGION
        echo "⏳ Waiting for instance to stop..."
        aws ec2 wait instance-stopped --instance-ids $INSTANCE_ID --region $AWS_REGION
        echo "✅ Instance stopped successfully!"
        echo "💰 No charges while stopped (except for EBS storage)"
        ;;
        
    "restart")
        echo "🔄 Restarting Preffy Backend EC2 instance..."
        
        INSTANCE_ID=$(get_instance_id)
        if [ "$INSTANCE_ID" = "None" ]; then
            echo "❌ No instance found with name: $INSTANCE_NAME"
            exit 1
        fi
        
        aws ec2 reboot-instances --instance-ids $INSTANCE_ID --region $AWS_REGION
        echo "⏳ Waiting for instance to restart..."
        sleep 30
        aws ec2 wait instance-running --instance-ids $INSTANCE_ID --region $AWS_REGION
        
        PUBLIC_IP=$(get_public_ip $INSTANCE_ID)
        echo "✅ Instance restarted successfully!"
        echo "🌐 Public IP: $PUBLIC_IP"
        echo "⏳ Application may take 1-2 minutes to fully start"
        ;;
        
    "terminate")
        echo "🗑️  Terminating Preffy Backend EC2 instance..."
        echo "⚠️  WARNING: This will permanently delete the instance and all data!"
        read -p "Are you sure? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            INSTANCE_ID=$(get_instance_id)
            if [ "$INSTANCE_ID" = "None" ]; then
                echo "❌ No instance found with name: $INSTANCE_NAME"
                exit 1
            fi
            
            aws ec2 terminate-instances --instance-ids $INSTANCE_ID --region $AWS_REGION
            echo "✅ Instance termination initiated"
            echo "💾 All data will be permanently lost"
        else
            echo "❌ Termination cancelled"
        fi
        ;;
        
    "logs")
        echo "📋 Fetching application logs..."
        
        INSTANCE_ID=$(get_instance_id)
        if [ "$INSTANCE_ID" = "None" ]; then
            echo "❌ No instance found with name: $INSTANCE_NAME"
            exit 1
        fi
        
        STATE=$(get_instance_state $INSTANCE_ID)
        if [ "$STATE" != "running" ]; then
            echo "❌ Instance is not running (state: $STATE)"
            exit 1
        fi
        
        PUBLIC_IP=$(get_public_ip $INSTANCE_ID)
        ssh -i preffy-backend-key.pem -o StrictHostKeyChecking=no ec2-user@$PUBLIC_IP 'tail -f application.log'
        ;;
        
    "ssh")
        echo "🔗 Connecting to Preffy Backend EC2 instance..."
        
        INSTANCE_ID=$(get_instance_id)
        if [ "$INSTANCE_ID" = "None" ]; then
            echo "❌ No instance found with name: $INSTANCE_NAME"
            exit 1
        fi
        
        STATE=$(get_instance_state $INSTANCE_ID)
        if [ "$STATE" != "running" ]; then
            echo "❌ Instance is not running (state: $STATE)"
            exit 1
        fi
        
        PUBLIC_IP=$(get_public_ip $INSTANCE_ID)
        ssh -i preffy-backend-key.pem -o StrictHostKeyChecking=no ec2-user@$PUBLIC_IP
        ;;
        
    "deploy")
        echo "📦 Deploying new application version..."
        
        INSTANCE_ID=$(get_instance_id)
        if [ "$INSTANCE_ID" = "None" ]; then
            echo "❌ No instance found with name: $INSTANCE_NAME"
            exit 1
        fi
        
        STATE=$(get_instance_state $INSTANCE_ID)
        if [ "$STATE" != "running" ]; then
            echo "❌ Instance is not running (state: $STATE)"
            exit 1
        fi
        
        # Build new JAR
        echo "🔨 Building application..."
        cd backend
        ./gradlew clean build -x test
        cd ..
        
        # Copy new JAR
        JAR_NAME="preffy-backend.jar"
        cp backend/build/libs/demo-0.0.1-SNAPSHOT.jar $JAR_NAME
        
        PUBLIC_IP=$(get_public_ip $INSTANCE_ID)
        echo "📦 Uploading new version..."
        scp -i preffy-backend-key.pem -o StrictHostKeyChecking=no $JAR_NAME ec2-user@$PUBLIC_IP:/home/ec2-user/
        
        echo "🔄 Restarting application..."
        ssh -i preffy-backend-key.pem -o StrictHostKeyChecking=no ec2-user@$PUBLIC_IP './restart-app.sh'
        
        rm -f $JAR_NAME
        echo "✅ Deployment complete!"
        ;;
        
    *)
        echo "🛠️  Preffy Backend EC2 Management"
        echo "================================="
        echo ""
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  status     - Show instance status and connection info"
        echo "  start      - Start the EC2 instance"
        echo "  stop       - Stop the EC2 instance"
        echo "  restart    - Restart the EC2 instance"
        echo "  terminate  - Permanently delete the instance"
        echo "  logs       - View application logs (live tail)"
        echo "  ssh        - Connect to the instance via SSH"
        echo "  deploy     - Build and deploy new application version"
        echo ""
        echo "Examples:"
        echo "  $0 status          # Check current status"
        echo "  $0 start           # Start stopped instance"
        echo "  $0 logs            # View live logs"
        echo "  $0 deploy          # Deploy new version"
        ;;
esac
