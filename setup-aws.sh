#!/bin/bash

# AWS Setup Script for Preffy Backend Deployment

echo "🔧 AWS EC2 Deployment Setup for Preffy Backend"
echo "==============================================="
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed."
    echo ""
    echo "📥 To install AWS CLI:"
    echo "   brew install awscli"
    echo "   # Or download from: https://aws.amazon.com/cli/"
    echo ""
    exit 1
fi

echo "✅ AWS CLI is installed: $(aws --version)"
echo ""

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    echo "🔑 AWS credentials not configured."
    echo ""
    echo "To configure AWS credentials, you need:"
    echo "1. AWS Access Key ID"
    echo "2. AWS Secret Access Key"
    echo "3. Default region (e.g., us-east-1)"
    echo ""
    echo "📋 Steps to get AWS credentials:"
    echo "1. Go to AWS Console → IAM → Users"
    echo "2. Create/select a user with EC2 permissions"
    echo "3. Create Access Key → Command Line Interface (CLI)"
    echo "4. Copy the Access Key ID and Secret Access Key"
    echo ""
    
    read -p "Do you want to configure AWS credentials now? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        aws configure
        echo ""
        echo "✅ AWS credentials configured!"
    else
        echo "❌ Please run 'aws configure' when you have your credentials ready."
        exit 1
    fi
else
    echo "✅ AWS credentials are configured:"
    aws sts get-caller-identity
fi

echo ""
echo "🧪 Testing AWS permissions..."

# Test EC2 permissions
if aws ec2 describe-regions --region us-east-1 > /dev/null 2>&1; then
    echo "✅ EC2 permissions: OK"
else
    echo "❌ EC2 permissions: FAILED"
    echo "💡 Your AWS user needs EC2 permissions (AmazonEC2FullAccess policy)"
fi

echo ""
echo "📋 Deployment Options:"
echo ""
echo "1️⃣  Quick EC2 Deployment:"
echo "   ./deploy-ec2.sh"
echo ""
echo "2️⃣  Docker Deployment (alternative):"
echo "   docker-compose -f docker-compose.backend.yml up -d"
echo ""
echo "3️⃣  Manual deployment steps:"
echo "   See AWS_EC2_DEPLOYMENT.md for detailed instructions"
echo ""

echo "🔍 Checking backend build..."
cd backend
if ./gradlew build -x test > /dev/null 2>&1; then
    echo "✅ Backend builds successfully"
else
    echo "⚠️  Backend build issues detected"
    echo "💡 Run: cd backend && ./gradlew build"
fi
cd ..

echo ""
echo "💰 Estimated AWS Costs:"
echo "   • t3.micro EC2: $8-12/month (Free tier: 750 hours/month for 12 months)"
echo "   • EBS Storage: $1/month (Free tier: 30GB for 12 months)"
echo "   • Data Transfer: $0.09/GB (Free tier: 1GB/month)"
echo ""

echo "🚀 Ready to deploy!"
echo "Run: ./deploy-ec2.sh"
