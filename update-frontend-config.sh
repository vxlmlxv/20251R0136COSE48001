#!/bin/bash

# Script to update frontend configuration with AWS backend IP
# Usage: ./update-frontend-config.sh <EC2_PUBLIC_IP>

if [ -z "$1" ]; then
    echo "❌ Error: Please provide the EC2 public IP address"
    echo "Usage: $0 <EC2_PUBLIC_IP>"
    exit 1
fi

EC2_IP="$1"
FRONTEND_ENV_FILE="frontend/.env.production"

echo "🔄 Updating frontend configuration..."
echo "   EC2 IP: $EC2_IP"
echo "   Config file: $FRONTEND_ENV_FILE"

# Update production environment file
cat > $FRONTEND_ENV_FILE << EOF
# Production Environment Variables - Updated for AWS EC2
VITE_API_URL=http://$EC2_IP:8080/api
VITE_DEV_MODE=false
VITE_APP_ENV=production
VITE_USE_MOCK_API=false
EOF

echo "✅ Frontend configuration updated!"
echo ""
echo "📋 Updated configuration:"
cat $FRONTEND_ENV_FILE
echo ""
echo "🚀 Next steps:"
echo "   1. Build the frontend: cd frontend && npm run build"
echo "   2. Deploy the frontend to your hosting service"
echo "   3. Or serve locally for testing: cd frontend && npm run preview"
