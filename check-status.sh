#!/bin/bash

# Check Swagger UI deployment status

echo "🔍 Checking Preffy API Documentation Status..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running"
    exit 1
fi

# Check if container exists and is running
if docker ps | grep -q "preffy-swagger-ui"; then
    echo "✅ Container is running"
    
    # Get container info
    CONTAINER_ID=$(docker ps --filter "name=preffy-swagger-ui" --format "{{.ID}}")
    PORT=$(docker ps --filter "name=preffy-swagger-ui" --format "{{.Ports}}" | grep -o '0.0.0.0:[0-9]*' | cut -d: -f2)
    
    echo "📋 Container Details:"
    echo "   ID: $CONTAINER_ID"
    echo "   Port: $PORT"
    echo "   URL: http://localhost:$PORT"
    echo ""
    
    # Test if the service responds
    echo "🌐 Testing API Documentation availability..."
    if curl -s -o /dev/null -w "%{http_code}" "http://localhost:$PORT" | grep -q "200"; then
        echo "✅ API Documentation is accessible"
        echo "🚀 Ready to share: http://localhost:$PORT"
    else
        echo "⚠️  Service is starting up, please wait a moment..."
    fi
    
elif docker ps -a | grep -q "preffy-swagger-ui"; then
    echo "⚠️  Container exists but is not running"
    echo "🔄 Starting container..."
    docker start preffy-swagger-ui
else
    echo "❌ Container not found"
    echo "💡 Run './deploy-swagger.sh' to deploy"
fi

echo ""
echo "🔧 Useful Commands:"
echo "   View logs:     docker logs preffy-swagger-ui"
echo "   Stop:          docker stop preffy-swagger-ui"
echo "   Restart:       docker restart preffy-swagger-ui"
echo "   Open browser:  ./open-docs.sh"
