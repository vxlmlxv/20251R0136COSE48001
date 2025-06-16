# AWS EC2 Deployment Guide for Preffy Backend

This guide provides complete instructions for deploying your Spring Boot backend to AWS EC2.

## 📋 Prerequisites

### 1. Install AWS CLI
```bash
# macOS
brew install awscli

# Or download from: https://aws.amazon.com/cli/
```

### 2. Configure AWS Credentials
```bash
aws configure
```
You'll need:
- AWS Access Key ID
- AWS Secret Access Key  
- Default region (e.g., `us-east-1`)
- Default output format (`json`)

### 3. Verify AWS Setup
```bash
aws sts get-caller-identity
```

## 🚀 Quick Deployment

### One-Command Deployment
```bash
./deploy-ec2.sh
```

This script will:
- ✅ Build your Spring Boot JAR
- ✅ Create EC2 key pair
- ✅ Set up security groups
- ✅ Launch EC2 instance  
- ✅ Install Java and dependencies
- ✅ Deploy and start your application
- ✅ Provide access URLs

## 🛠️ Management Commands

### Check Status
```bash
./manage-ec2.sh status
```

### Start/Stop Instance
```bash
./manage-ec2.sh start    # Start stopped instance
./manage-ec2.sh stop     # Stop running instance
./manage-ec2.sh restart  # Restart instance
```

### Deploy New Version
```bash
./manage-ec2.sh deploy   # Build and deploy latest code
```

### View Logs
```bash
./manage-ec2.sh logs     # Live tail of application logs
```

### SSH Access
```bash
./manage-ec2.sh ssh      # Connect to server
```

## 🌐 Access Your Application

After deployment, your backend will be available at:

- **API Base URL**: `http://YOUR_EC2_IP:8080`
- **Swagger UI**: `http://YOUR_EC2_IP:8080/swagger-ui/index.html`
- **API Documentation**: `http://YOUR_EC2_IP:8080/v3/api-docs`

## 📊 AWS Resources Created

### EC2 Instance
- **Type**: t3.micro (Free tier eligible)
- **OS**: Amazon Linux 2023
- **Storage**: 8GB EBS (Free tier eligible)
- **Java**: Amazon Corretto 22

### Security Group
- **Port 22**: SSH access (0.0.0.0/0)
- **Port 8080**: Application access (0.0.0.0/0)

### Key Pair
- **Name**: `preffy-backend-key`
- **File**: `preffy-backend-key.pem` (keep secure!)

## 💰 Cost Estimation

### Free Tier (First 12 months)
- **EC2 t3.micro**: 750 hours/month FREE
- **EBS Storage**: 30GB FREE
- **Data Transfer**: 1GB/month FREE

### After Free Tier
- **EC2 t3.micro**: ~$8-12/month
- **EBS Storage**: ~$1/month (8GB)
- **Data Transfer**: ~$0.09/GB

## 🔧 Configuration

### Environment Variables
Edit `application-production.properties` to configure:

```properties
# Database (consider AWS RDS)
spring.datasource.url=jdbc:postgresql://your-rds-endpoint:5432/preffydb
spring.datasource.username=your_username
spring.datasource.password=your_password

# JWT Secret (CHANGE THIS!)
app.jwtSecret=your_secure_jwt_secret_here

# CORS (adjust for your frontend)
app.cors.allowed-origins=https://your-frontend-domain.com
```

### Database Options

#### Option 1: AWS RDS (Recommended for Production)
```bash
# Create RDS PostgreSQL instance
aws rds create-db-instance \
    --db-instance-identifier preffy-db \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --master-username preffy_admin \
    --master-user-password your_secure_password \
    --allocated-storage 20
```

#### Option 2: PostgreSQL on EC2
```bash
# SSH to EC2 and install PostgreSQL
ssh -i preffy-backend-key.pem ec2-user@YOUR_EC2_IP
sudo yum install -y postgresql15-server
sudo postgresql-setup --initdb
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

## 🔒 Security Best Practices

### 1. Secure JWT Secret
```bash
# Generate secure random secret
openssl rand -base64 64
```

### 2. Environment Variables
Consider using AWS Systems Manager Parameter Store:
```bash
aws ssm put-parameter \
    --name "/preffy/jwt-secret" \
    --value "your-secure-secret" \
    --type "SecureString"
```

### 3. Restrict Security Group
```bash
# Limit SSH to your IP only
aws ec2 authorize-security-group-ingress \
    --group-id sg-xxxxxxxxx \
    --protocol tcp \
    --port 22 \
    --cidr YOUR_IP/32
```

## 🚨 Troubleshooting

### Application Won't Start
```bash
# Check logs
./manage-ec2.sh logs

# SSH and check manually
./manage-ec2.sh ssh
sudo systemctl status preffy-backend
journalctl -u preffy-backend -f
```

### Can't Connect to Database
```bash
# Test database connection
./manage-ec2.sh ssh
psql -h your-db-host -U your-username -d your-database
```

### Port 8080 Not Accessible
```bash
# Check security group rules
aws ec2 describe-security-groups --group-names preffy-backend-sg

# Check if application is binding to correct interface
./manage-ec2.sh ssh
netstat -tuln | grep 8080
```

## 📈 Scaling Options

### Vertical Scaling
```bash
# Upgrade to larger instance
aws ec2 modify-instance-attribute \
    --instance-id i-xxxxxxxxx \
    --instance-type t3.small
```

### Load Balancing
```bash
# Create Application Load Balancer
aws elbv2 create-load-balancer \
    --name preffy-backend-alb \
    --subnets subnet-xxxxxxxx subnet-yyyyyyyy
```

### Auto Scaling
```bash
# Create Launch Template and Auto Scaling Group
aws ec2 create-launch-template \
    --launch-template-name preffy-backend-template
```

## 🔄 CI/CD Integration

### GitHub Actions Example
```yaml
name: Deploy to EC2
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to EC2
        run: ./manage-ec2.sh deploy
```

## 🛑 Cleanup

### Stop Instance (Keep for Later)
```bash
./manage-ec2.sh stop
```

### Terminate Instance (Permanent Deletion)
```bash
./manage-ec2.sh terminate
```

### Delete All Resources
```bash
# Terminate instance
aws ec2 terminate-instances --instance-ids i-xxxxxxxxx

# Delete security group
aws ec2 delete-security-group --group-name preffy-backend-sg

# Delete key pair
aws ec2 delete-key-pair --key-name preffy-backend-key
rm preffy-backend-key.pem
```

## 📞 Support

For issues:
1. Check the troubleshooting section above
2. Review AWS CloudWatch logs
3. Check the application logs: `./manage-ec2.sh logs`
4. Verify security group and network settings

Your Spring Boot backend is now ready for production on AWS EC2! 🎉
