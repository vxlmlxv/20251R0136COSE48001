# AWS EC2 GitHub Deployment Guide

This guide will help you deploy the Preffy Video Flow application to AWS EC2 by cloning directly from your GitHub repository.

## Prerequisites

1. **AWS CLI installed and configured**
   ```bash
   aws configure
   ```

2. **GitHub repository** 
   - Make sure your repository is public or you have proper SSH keys configured
   - Repository URL: `https://github.com/vxlmlxv/preffy-video-flow.git`

3. **AWS Account** with appropriate permissions for EC2, Security Groups, and Key Pairs

## Quick Deployment

### 1. Deploy Backend to AWS EC2

Run the GitHub deployment script:

```bash
./deploy-ec2-github.sh
```

This script will:
- Create EC2 instance with Amazon Linux 2023
- Install Java 22 and Git
- Clone your GitHub repository
- Build the Spring Boot application using Gradle
- Start the backend service automatically
- Configure H2 in-memory database
- Set up management scripts

### 2. Update Frontend Configuration

After deployment completes, update the frontend to use the AWS backend:

```bash
./update-frontend-config.sh <EC2_PUBLIC_IP>
```

Replace `<EC2_PUBLIC_IP>` with the IP address shown after deployment.

### 3. Test the Deployment

The script will automatically test the deployment. You can also manually test:

```bash
# Test health endpoint
curl http://YOUR_EC2_IP:8080/api/health

# Test Swagger UI
curl http://YOUR_EC2_IP:8080/swagger-ui/index.html
```

## Management Commands

After deployment, you can manage your instance using:

```bash
# Check status
./manage-ec2.sh status

# Start/stop instance
./manage-ec2.sh start
./manage-ec2.sh stop

# Terminate instance (permanent deletion)
./manage-ec2.sh terminate
```

## Remote Management

SSH into your instance to manage the application:

```bash
# SSH into the instance
ssh -i preffy-key-pair.pem ec2-user@YOUR_EC2_IP

# Check application status
./check-status.sh

# View logs
tail -f application.log

# Restart application
./restart-app.sh

# Redeploy from latest GitHub changes
./redeploy.sh
```

## Application URLs

After successful deployment:

- **Backend API**: `http://YOUR_EC2_IP:8080`
- **Swagger UI**: `http://YOUR_EC2_IP:8080/swagger-ui/index.html`
- **Health Check**: `http://YOUR_EC2_IP:8080/api/health`

## Key Features of GitHub Deployment

1. **Automatic Build**: Application is built from source on the EC2 instance
2. **No Local Dependencies**: No need to build locally or upload JAR files
3. **Easy Updates**: Use the `redeploy.sh` script to pull latest changes and rebuild
4. **Production Ready**: Configured with proper logging, service management, and monitoring
5. **Cost Effective**: Uses t3.micro instance (~$8-12/month)

## Database Configuration

The deployment uses H2 in-memory database by default for demonstration purposes. Data will be reset when the application restarts.

To switch to persistent PostgreSQL:
1. Set up AWS RDS PostgreSQL instance
2. Update `application-production.properties`
3. Change `SPRING_PROFILES_ACTIVE` from `h2` to `postgres`

## Security

The deployment creates a security group that allows:
- SSH access (port 22) from anywhere
- HTTP access (port 8080) from anywhere

For production use, consider restricting access to specific IP ranges.

## Troubleshooting

### Application Not Starting
```bash
# SSH into instance and check logs
ssh -i preffy-key-pair.pem ec2-user@YOUR_EC2_IP
tail -f application.log
```

### Build Failures
```bash
# SSH into instance and rebuild manually
ssh -i preffy-key-pair.pem ec2-user@YOUR_EC2_IP
cd preffy-video-flow/backend
./gradlew clean build
```

### Port Not Accessible
- Check security group allows port 8080
- Verify application is running: `./check-status.sh`

## Cost Management

- **Running costs**: ~$8-12/month for t3.micro instance
- **Stop instance** when not in use to reduce costs
- **Terminate instance** to completely remove and stop billing

## Next Steps

1. **Frontend Deployment**: Deploy the frontend to a service like Netlify, Vercel, or AWS S3
2. **Domain Setup**: Configure a custom domain for your application
3. **SSL Certificate**: Set up HTTPS using AWS Certificate Manager or Let's Encrypt
4. **Database Upgrade**: Move to persistent database (AWS RDS)
5. **Monitoring**: Set up CloudWatch monitoring and alerts
