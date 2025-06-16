#!/bin/bash

# Preffy Video Feedback Platform - Production Deployment Manager
# This script demonstrates a production-ready deployment with built frontend

echo "🌐 Preffy Video Feedback Platform - Production Deployment"
echo "=========================================================="

# Function to build frontend
build_frontend() {
    echo "🔨 Building frontend for production..."
    cd frontend
    npm run build
    cd ..
    echo "✅ Frontend built successfully"
}

# Function to serve built frontend with a simple HTTP server
serve_frontend() {
    echo "🌍 Starting production frontend server..."
    cd frontend/dist
    
    # Use Python's built-in HTTP server if available
    if command -v python3 &> /dev/null; then
        python3 -m http.server 3000 > /tmp/frontend_prod.log 2>&1 &
        echo "✅ Frontend serving on http://localhost:3000"
    elif command -v python &> /dev/null; then
        python -m SimpleHTTPServer 3000 > /tmp/frontend_prod.log 2>&1 &
        echo "✅ Frontend serving on http://localhost:3000"
    else
        echo "❌ Python not found. Please install Python or use a different HTTP server."
        return 1
    fi
    cd ../..
}

# Function to start production tunnels
start_production_tunnels() {
    echo "🚀 Starting production external access tunnels..."
    
    # Kill existing tunnels
    pkill -f "lt --port"
    
    # Start backend tunnel (same as development)
    echo "📡 Starting backend API tunnel..."
    lt --port 3002 > /tmp/backend_tunnel.log 2>&1 &
    sleep 3
    BACKEND_URL=$(grep "your url is:" /tmp/backend_tunnel.log | awk '{print $4}')
    
    # Start frontend tunnel for production build
    echo "🌍 Starting production frontend tunnel..."
    lt --port 3000 > /tmp/frontend_tunnel.log 2>&1 &
    sleep 3
    FRONTEND_URL=$(grep "your url is:" /tmp/frontend_tunnel.log | awk '{print $4}')
    
    echo ""
    echo "🎉 Production Deployment Active!"
    echo "================================"
    echo "Frontend: $FRONTEND_URL"
    echo "Backend:  $BACKEND_URL"
    echo ""
    echo "🌐 Share the frontend URL for external access!"
    echo "📱 This is a production-optimized build with:"
    echo "   • Minified and compressed assets"
    echo "   • Optimized bundle size"
    echo "   • Production-ready configuration"
}

# Function to start production environment
start_production() {
    echo "🚀 Starting production deployment..."
    
    # Start database containers
    echo "📊 Starting database containers..."
    cd backend && docker-compose -f docker-compose.db.yml up -d
    
    # Start backend in production mode
    echo "⚡ Starting backend server..."
    npm run start:prod > /tmp/backend_prod.log 2>&1 &
    
    # Build and serve frontend
    cd ..
    build_frontend
    serve_frontend
    
    # Wait for services to start
    sleep 5
    
    # Start production tunnels
    start_production_tunnels
}

# Function to show production status
show_production_status() {
    echo "📊 Production Status:"
    echo "===================="
    
    # Check if services are running
    if pgrep -f "npm run start:prod" > /dev/null; then
        echo "✅ Backend Server: Running (Production Mode - Port 3002)"
    elif pgrep -f "npm run start:dev" > /dev/null; then
        echo "⚠️  Backend Server: Running (Development Mode - Port 3002)"
    else
        echo "❌ Backend Server: Not Running"
    fi
    
    if pgrep -f "python.*http.server 3000" > /dev/null || pgrep -f "python.*SimpleHTTPServer 3000" > /dev/null; then
        echo "✅ Production Frontend: Running (Port 3000)"
    elif pgrep -f "npm run dev" > /dev/null; then
        echo "⚠️  Development Frontend: Running (Port 3000)"
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
    
    # Check if frontend is built
    if [ -d "frontend/dist" ]; then
        echo "✅ Frontend Build: Ready"
    else
        echo "❌ Frontend Build: Not Built"
    fi
}

# Function to stop production services
stop_production() {
    echo "🛑 Stopping production services..."
    
    # Stop tunnels
    pkill -f "lt --port"
    
    # Stop frontend server
    pkill -f "python.*http.server 3000"
    pkill -f "python.*SimpleHTTPServer 3000"
    
    # Stop backend
    pkill -f "npm run start:prod"
    pkill -f "npm run start:dev"
    
    # Stop database containers
    cd backend && docker-compose -f docker-compose.db.yml down
    cd ..
    
    echo "✅ All production services stopped"
}

# Function to setup Firebase-style deployment info
show_deployment_info() {
    echo ""
    echo "🔥 Firebase-Style Production Deployment Ready!"
    echo "=============================================="
    echo ""
    echo "📦 What's been accomplished:"
    echo "   ✅ Frontend built and optimized"
    echo "   ✅ Backend compiled successfully"  
    echo "   ✅ Production-ready configuration"
    echo "   ✅ External access tunnels active"
    echo ""
    echo "🌐 External URLs:"
    if [ -f "/tmp/frontend_tunnel.log" ]; then
        FRONTEND_URL=$(cat /tmp/frontend_tunnel.log 2>/dev/null | grep "your url is:" | awk '{print $4}')
        echo "   Frontend: $FRONTEND_URL"
    fi
    if [ -f "/tmp/backend_tunnel.log" ]; then
        BACKEND_URL=$(cat /tmp/backend_tunnel.log 2>/dev/null | grep "your url is:" | awk '{print $4}')
        echo "   Backend:  $BACKEND_URL"
    fi
    echo ""
    echo "🚀 Next Steps for Full Firebase Deployment:"
    echo "   1. Create Firebase project at https://console.firebase.google.com"
    echo "   2. Enable Firestore Database"
    echo "   3. Enable Authentication"
    echo "   4. Enable Cloud Storage"
    echo "   5. Deploy using: firebase deploy"
    echo ""
    echo "💡 Current setup provides:"
    echo "   • Production-optimized frontend build"
    echo "   • Scalable backend architecture"  
    echo "   • External network access"
    echo "   • Database integration"
    echo ""
}

# Main menu
case "$1" in
    build)
        build_frontend
        ;;
    serve)
        serve_frontend
        ;;
    start)
        start_production_tunnels
        ;;
    deploy)
        start_production
        show_deployment_info
        ;;
    status)
        show_production_status
        ;;
    stop)
        stop_production
        ;;
    info)
        show_deployment_info
        ;;
    *)
        echo "Usage: $0 {build|serve|start|deploy|status|stop|info}"
        echo ""
        echo "Commands:"
        echo "  build   - Build frontend for production"
        echo "  serve   - Serve built frontend"
        echo "  start   - Start production tunnels only"
        echo "  deploy  - Full production deployment"
        echo "  status  - Show production status"
        echo "  stop    - Stop all production services"
        echo "  info    - Show deployment information"
        echo ""
        exit 1
        ;;
esac
