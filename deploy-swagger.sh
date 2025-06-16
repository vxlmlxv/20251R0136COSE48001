#!/bin/bash

# Preffy API Documentation Deployment Script

echo "🚀 Deploying Preffy API Documentation with Swagger UI..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running. Please start Docker first."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Error: docker-compose is not installed. Please install docker-compose first."
    exit 1
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.simple.yml down

# Build and start the containers
echo "🔨 Building and starting Swagger UI container..."
docker-compose -f docker-compose.simple.yml up -d --build

# Wait a moment for the container to start
sleep 5

# Check if the container is running
if docker ps | grep -q "preffy-swagger-ui"; then
    echo "✅ Success! Swagger UI is now running."
    echo ""
    echo "📋 Access Information:"
    echo "   🌐 Local URL: http://localhost:3001"
    echo "   📖 API Documentation: Interactive Swagger UI interface"
    echo ""
    echo "🔧 Container Management:"
    echo "   Stop:    docker-compose -f docker-compose.simple.yml down"
    echo "   Restart: docker-compose -f docker-compose.simple.yml restart"
    echo "   Logs:    docker-compose -f docker-compose.simple.yml logs -f"
    echo ""
    echo "🌍 For external access, make sure port 3001 is open in your firewall."
    echo "   External URL: http://YOUR_SERVER_IP:3001"
else
    echo "❌ Error: Container failed to start. Check the logs:"
    docker-compose -f docker-compose.simple.yml logs
    exit 1
fi
