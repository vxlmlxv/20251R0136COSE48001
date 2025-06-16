#!/bin/bash

# EC2 User Data Script - GitHub Clone and Deploy
# This script clones the repository, builds, and deploys the application

# Update the system
yum update -y

# Install Java 22 (Amazon Corretto)
yum install -y java-22-amazon-corretto-headless

# Install Git and build tools (with conflict resolution)
yum install -y git htop wget --allowerasing

# Create application directory
mkdir -p /opt/preffy
chown ec2-user:ec2-user /opt/preffy

# Switch to ec2-user context for git operations
sudo -u ec2-user bash << 'EOF'
cd /home/ec2-user

# Clone the repository
echo "🔗 Cloning repository..."
git clone https://github.com/vxlmlxv/preffy.git
cd preffy

# Make gradlew executable
chmod +x backend/gradlew

# Build the backend
echo "🔨 Building backend..."
cd backend
./gradlew clean build -x test
cd ..

# Copy the built JAR
if [ -f "backend/build/libs/demo-0.0.1-SNAPSHOT.jar" ]; then
    cp backend/build/libs/demo-0.0.1-SNAPSHOT.jar /home/ec2-user/preffy-backend.jar
    echo "✅ JAR copied successfully"
else
    echo "❌ JAR build failed"
    exit 1
fi

# Copy configuration file
cp application-production.properties /home/ec2-user/
EOF

# Create systemd service for the application
cat > /etc/systemd/system/preffy-backend.service << 'EOF'
[Unit]
Description=Preffy Video Flow Backend
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user
ExecStart=/usr/bin/java -jar /home/ec2-user/preffy-backend.jar --spring.config.location=/home/ec2-user/application-production.properties
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
Environment=SPRING_PROFILES_ACTIVE=h2

[Install]
WantedBy=multi-user.target
EOF

# Enable and start the service
systemctl daemon-reload
systemctl enable preffy-backend

# Set up log rotation
cat > /etc/logrotate.d/preffy-backend << 'EOF'
/home/ec2-user/application.log {
    daily
    rotate 7
    compress
    missingok
    notifempty
    create 0644 ec2-user ec2-user
}
EOF

# Create management scripts
cat > /home/ec2-user/check-status.sh << 'EOF'
#!/bin/bash
echo "🔍 Preffy Backend Status Check"
echo "=============================="

# Check if Java process is running
if pgrep -f "preffy-backend.jar" > /dev/null; then
    echo "✅ Application process: RUNNING"
    PID=$(pgrep -f "preffy-backend.jar")
    echo "   PID: $PID"
else
    echo "❌ Application process: NOT RUNNING"
fi

# Check if port 8080 is listening
if netstat -tuln | grep :8080 > /dev/null 2>&1; then
    echo "✅ Port 8080: LISTENING"
else
    echo "❌ Port 8080: NOT LISTENING"
fi

# Check application health endpoint
if curl -f http://localhost:8080/api/health > /dev/null 2>&1; then
    echo "✅ Health endpoint: RESPONDING"
elif curl -f http://localhost:8080/swagger-ui/index.html > /dev/null 2>&1; then
    echo "✅ Swagger UI: RESPONDING"
else
    echo "❌ API endpoints: NOT RESPONDING"
fi

# Show recent logs
echo ""
echo "📋 Recent Logs (last 15 lines):"
echo "================================"
tail -n 15 /home/ec2-user/application.log 2>/dev/null || echo "No logs found"
EOF

cat > /home/ec2-user/restart-app.sh << 'EOF'
#!/bin/bash
echo "🔄 Restarting Preffy Backend..."

# Stop the application
pkill -f "preffy-backend.jar"
sleep 5

# Start the application
nohup java -jar /home/ec2-user/preffy-backend.jar --spring.config.location=/home/ec2-user/application-production.properties --spring.profiles.active=h2 > /home/ec2-user/application.log 2>&1 &

echo "✅ Application restarted"
echo "⏳ Waiting 15 seconds for startup..."
sleep 15

# Check status
/home/ec2-user/check-status.sh
EOF

cat > /home/ec2-user/redeploy.sh << 'EOF'
#!/bin/bash
echo "🔄 Redeploying from GitHub..."

# Stop the application
pkill -f "preffy-backend.jar"
sleep 3

# Update repository
cd /home/ec2-user/preffy
git pull origin main

# Rebuild
cd backend
./gradlew clean build -x test
cd ..

# Update JAR
if [ -f "backend/build/libs/demo-0.0.1-SNAPSHOT.jar" ]; then
    cp backend/build/libs/demo-0.0.1-SNAPSHOT.jar /home/ec2-user/preffy-backend.jar
    echo "✅ JAR updated successfully"
else
    echo "❌ JAR build failed"
    exit 1
fi

# Update configuration
cp application-production.properties /home/ec2-user/

# Restart application
nohup java -jar /home/ec2-user/preffy-backend.jar --spring.config.location=/home/ec2-user/application-production.properties --spring.profiles.active=h2 > /home/ec2-user/application.log 2>&1 &

echo "✅ Redeployment complete"
echo "⏳ Waiting 15 seconds for startup..."
sleep 15

# Check status
/home/ec2-user/check-status.sh
EOF

# Make scripts executable and set ownership
chmod +x /home/ec2-user/*.sh
chown ec2-user:ec2-user /home/ec2-user/*.sh

# Wait a moment for the build to complete, then start the service
sleep 30

# Start the application
sudo -u ec2-user bash << 'EOF'
nohup java -jar /home/ec2-user/preffy-backend.jar --spring.config.location=/home/ec2-user/application-production.properties --spring.profiles.active=h2 > /home/ec2-user/application.log 2>&1 &
EOF

# Output completion message
echo "✅ EC2 GitHub deployment complete!"
echo "🔧 Java 22 installed"
echo "📁 Repository cloned and built"
echo "🚀 Application started"
