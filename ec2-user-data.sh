#!/bin/bash

# EC2 User Data Script - Runs on instance startup
# This script installs Java and prepares the environment for Spring Boot

# Update the system
yum update -y

# Install Java 22 (Amazon Corretto)
yum install -y java-22-amazon-corretto-headless

# Install additional tools
yum install -y htop curl wget

# Create application directory
mkdir -p /opt/preffy
chown ec2-user:ec2-user /opt/preffy

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

[Install]
WantedBy=multi-user.target
EOF

# Enable the service (but don't start it yet - we need to copy files first)
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

# Create a simple status check script
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

# Check application API endpoint
if curl -f http://localhost:8080/swagger-ui/index.html > /dev/null 2>&1; then
    echo "✅ API endpoint: RESPONDING"
else
    echo "❌ API endpoint: NOT RESPONDING"
fi

# Show recent logs
echo ""
echo "📋 Recent Logs (last 10 lines):"
echo "================================"
tail -n 10 /home/ec2-user/application.log 2>/dev/null || echo "No logs found"
EOF

chmod +x /home/ec2-user/check-status.sh
chown ec2-user:ec2-user /home/ec2-user/check-status.sh

# Create restart script
cat > /home/ec2-user/restart-app.sh << 'EOF'
#!/bin/bash
echo "🔄 Restarting Preffy Backend..."

# Stop the application
pkill -f "preffy-backend.jar"
sleep 5

# Start the application
nohup java -jar /home/ec2-user/preffy-backend.jar --spring.config.location=/home/ec2-user/application-production.properties > /home/ec2-user/application.log 2>&1 &

echo "✅ Application restarted"
echo "⏳ Waiting 10 seconds for startup..."
sleep 10

# Check status
/home/ec2-user/check-status.sh
EOF

chmod +x /home/ec2-user/restart-app.sh
chown ec2-user:ec2-user /home/ec2-user/restart-app.sh

# Output completion message
echo "✅ EC2 instance setup complete!"
echo "🔧 Java 22 installed"
echo "📁 Application directory created"
echo "🎯 Ready for application deployment"
