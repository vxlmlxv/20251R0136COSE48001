 #!/bin/bash

# Preffy Video Feedback Platform - External Access Manager
# This script helps manage external access to your platform

echo "🌐 Preffy Video Feedback Platform - External Access Manager"
echo "============================================================"

# Function to start LocalTunnel tunnels
start_tunnels() {
    echo "🚀 Starting external access tunnels..."
    
    # Kill existing tunnels
    pkill -f "lt --port"
    
    # Start backend tunnel
    echo "📡 Starting backend API tunnel..."
    lt --port 3002 > /tmp/backend_tunnel.log 2>&1 &
    sleep 3
    BACKEND_URL=$(grep "your url is:" /tmp/backend_tunnel.log | awk '{print $4}')
    
    # Start frontend tunnel  
    echo "🌍 Starting frontend tunnel..."
    lt --port 3000 > /tmp/frontend_tunnel.log 2>&1 &
    sleep 3
    FRONTEND_URL=$(grep "your url is:" /tmp/frontend_tunnel.log | awk '{print $4}')
    
    echo ""
    echo "✅ Tunnels Active!"
    echo "Frontend: $FRONTEND_URL"
    echo "Backend:  $BACKEND_URL"
    echo ""
    echo "🌐 Share the frontend URL with anyone for access!"
}

# Function to stop tunnels
stop_tunnels() {
    echo "🛑 Stopping external access tunnels..."
    pkill -f "lt --port"
    echo "✅ Tunnels stopped"
}

# Function to show status
show_status() {
    echo "📊 Current Status:"
    echo "=================="
    
    # Check if services are running
    if pgrep -f "npm run start:dev" > /dev/null; then
        echo "✅ Backend Server: Running (Port 3002)"
    else
        echo "❌ Backend Server: Not Running"
    fi
    
    if pgrep -f "npm run dev" > /dev/null; then
        echo "✅ Frontend Server: Running (Port 3000)"
    else
        echo "❌ Frontend Server: Not Running"
    fi
    
    # Check tunnel status
    if pgrep -f "lt --port 3002" > /dev/null; then
        BACKEND_URL=$(cat /tmp/backend_tunnel.log 2>/dev/null | grep "your url is:" | awk '{print $4}')
        echo "✅ Backend Tunnel: $BACKEND_URL"
    else
        echo "❌ Backend Tunnel: Not Active"
    fi
    
    if pgrep -f "lt --port 3000" > /dev/null; then
        FRONTEND_URL=$(cat /tmp/frontend_tunnel.log 2>/dev/null | grep "your url is:" | awk '{print $4}')
        echo "✅ Frontend Tunnel: $FRONTEND_URL"
    else
        echo "❌ Frontend Tunnel: Not Active"
    fi
}

# Function to start all services
start_all() {
    echo "🚀 Starting all Preffy services..."
    
    # Start database containers
    echo "📊 Starting database containers..."
    cd backend && docker-compose -f docker-compose.db.yml up -d
    
    # Start backend
    echo "⚡ Starting backend server..."
    npm run start:dev > /tmp/backend.log 2>&1 &
    
    # Start frontend
    echo "🎨 Starting frontend server..."
    cd ../frontend && npm run dev -- --host 0.0.0.0 --port 3000 > /tmp/frontend.log 2>&1 &
    
    # Wait for services to start
    sleep 5
    
    # Start tunnels
    start_tunnels
}

# Main menu
case "$1" in
    start)
        start_tunnels
        ;;
    stop)
        stop_tunnels
        ;;
    status)
        show_status
        ;;
    all)
        start_all
        ;;
    *)
        echo "Usage: $0 {start|stop|status|all}"
        echo ""
        echo "Commands:"
        echo "  start   - Start external access tunnels"
        echo "  stop    - Stop external access tunnels"
        echo "  status  - Show current service status"
        echo "  all     - Start all services and tunnels"
        echo ""
        exit 1
        ;;
esac
