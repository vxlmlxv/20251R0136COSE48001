#!/bin/bash

# Demo Mode Test Script
# This script tests the demo mode functionality

echo "🎭 Testing Demo Mode Implementation..."

# Check if frontend is running
if curl -s http://localhost:8082 > /dev/null; then
    echo "✅ Frontend is running on http://localhost:8082"
else
    echo "❌ Frontend is not running. Please start with 'npm run dev' in the frontend directory"
    exit 1
fi

echo ""
echo "📋 Demo Mode Test Checklist:"
echo "1. Navigate to http://localhost:8082/login"
echo "2. Use demo credentials:"
echo "   - Email: demo@preffy.com"
echo "   - Password: demo123"
echo "3. Verify demo mode banner appears in navbar"
echo "4. Check that demo project is available in dashboard"
echo "5. Explore demo project analysis results"
echo "6. Try to create a new project (should show error)"
echo "7. Logout to exit demo mode"
echo ""

echo "🔗 Quick Links:"
echo "- Login: http://localhost:8082/login"
echo "- Dashboard: http://localhost:8082/app/dashboard"
echo ""

echo "✨ Demo mode implementation is ready for testing!"
