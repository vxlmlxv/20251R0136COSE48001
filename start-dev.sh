#!/bin/bash

# Preffy Local Development Startup Script
echo "🚀 Starting Preffy Local Development Environment..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${YELLOW}Warning: Port $1 is already in use${NC}"
        return 1
    fi
    return 0
}

# Function to setup shared storage
setup_shared_storage() {
    echo -e "${BLUE}Setting up shared storage...${NC}"
    
    # Create shared storage directory
    SHARED_STORAGE="/tmp/preffy-shared-storage"
    mkdir -p "$SHARED_STORAGE/videos"
    
    # Create Docker volume directory to match the shared storage
    echo -e "${BLUE}Creating Docker volume for shared storage...${NC}"
    docker volume create preffy_uploads >/dev/null 2>&1 || true
    
    echo -e "${GREEN}✅ Shared storage configured at: $SHARED_STORAGE${NC}"
}

# Function to wait for service
wait_for_service() {
    local url=$1
    local name=$2
    local max_attempts=30
    local attempt=1
    
    echo -e "${BLUE}Waiting for $name to be ready...${NC}"
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ $name is ready!${NC}"
            return 0
        fi
        echo -e "${YELLOW}Attempt $attempt/$max_attempts: $name not ready yet...${NC}"
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo -e "${RED}❌ $name failed to start after $max_attempts attempts${NC}"
    return 1
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Check if required ports are available
echo -e "${BLUE}Checking port availability...${NC}"
check_port 3306 || echo -e "${YELLOW}MySQL port 3306 is in use${NC}"
check_port 8080 || echo -e "${YELLOW}Backend port 8080 is in use${NC}"
check_port 8081 || echo -e "${YELLOW}Frontend port 8081 is in use${NC}"
check_port 8000 || echo -e "${YELLOW}FastAPI port 8000 is in use${NC}"

# Setup shared storage
setup_shared_storage

# Start Docker services
echo -e "${BLUE}Starting Docker services...${NC}"
cd backend
docker-compose up -d

# Wait for MySQL to be ready
wait_for_service "mysql://preffyuser:preffypass123@localhost:3306/preffydb" "MySQL"

# Go back to root directory
cd ..

# Install frontend dependencies if needed
if [ ! -d "frontend/node_modules" ]; then
    echo -e "${BLUE}Installing frontend dependencies...${NC}"
    cd frontend
    npm install
    cd ..
fi

# Start backend and frontend concurrently
echo -e "${BLUE}Starting backend and frontend services...${NC}"
npm run dev &

# Store PID for cleanup
DEV_PID=$!

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}Shutting down services...${NC}"
    kill $DEV_PID 2>/dev/null
    cd backend
    docker-compose down
    echo -e "${GREEN}✅ All services stopped${NC}"
}

# Set trap for cleanup
trap cleanup EXIT INT TERM

# Wait for services to start
sleep 5

echo -e "\n${GREEN}🎉 Preffy Development Environment is running!${NC}"
echo -e "${BLUE}📱 Frontend: http://localhost:8081${NC}"
echo -e "${BLUE}🔧 Backend API: http://localhost:8080${NC}"
echo -e "${BLUE}🤖 FastAPI: http://localhost:8000${NC}"
echo -e "${BLUE}🗄️  phpMyAdmin: http://localhost:8085${NC}"
echo -e "${BLUE}📊 Swagger UI: http://localhost:8080/swagger-ui.html${NC}"
echo -e "\n${YELLOW}Press Ctrl+C to stop all services${NC}"

# Keep script running
wait $DEV_PID
