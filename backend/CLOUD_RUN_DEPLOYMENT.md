# Cloud Run Deployment Guide for Preffy Video Flow Backend

This guide will help you deploy the Preffy Video Flow backend to Google Cloud Run.

## Prerequisites

1. **Google Cloud Account** with billing enabled
2. **Google Cloud SDK (gcloud)** installed and configured
3. **Docker** installed (for local testing)
4. **Project setup** in Google Cloud Console

## Quick Start

### 1. Run the Automated Deployment Script

```bash
cd backend
./deploy-cloud-run.sh [PROJECT_ID] [REGION]
```

Example:
```bash
./deploy-cloud-run.sh preffy-video-platform us-west2
```

### 2. Set Environment Variables

After deployment, configure the following environment variables in Cloud Run:

```bash
# Database Configuration
DB_PASSWORD=your_secure_database_password
DB_USER=preffy_user

# JWT Security
JWT_SECRET=your_very_long_and_secure_jwt_secret_key_here

# Google Cloud Storage
GCS_BUCKET_NAME=preffy-storage
GOOGLE_CLOUD_PROJECT=your-project-id

# External APIs (optional)
BODY_FEEDBACK_API_URL=https://your-body-feedback-api.com
SCRIPT_FEEDBACK_API_URL=https://your-script-feedback-api.com

# CORS Configuration
ALLOWED_ORIGINS=https://your-frontend-domain.com,https://preffy-video-flow.web.app
```

## Manual Deployment Steps

If you prefer to deploy manually or customize the process:

### 1. Enable Required APIs

```bash
gcloud services enable \
    cloudbuild.googleapis.com \
    run.googleapis.com \
    artifactregistry.googleapis.com \
    sqladmin.googleapis.com \
    storage.googleapis.com
```

### 2. Create Artifact Registry Repository

```bash
gcloud artifacts repositories create preffy-video-flow \
    --repository-format=docker \
    --location=us-west2 \
    --description="Preffy Video Flow Docker images"
```

### 3. Configure Docker Authentication

```bash
gcloud auth configure-docker us-west2-docker.pkg.dev
```

### 4. Create Service Account

```bash
# Create service account
gcloud iam service-accounts create preffy-backend \
    --display-name="Preffy Backend Service Account"

# Grant Cloud SQL client role
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:preffy-backend@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/cloudsql.client"

# Grant Storage admin role
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:preffy-backend@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/storage.admin"
```

### 5. Build and Deploy

```bash
cd backend/quickstart-docker
gcloud builds submit . --config=cloudbuild.yaml
```

## Cloud SQL Setup

### 1. Create Cloud SQL Instance

```bash
gcloud sql instances create preffy-mysql \
    --database-version=MYSQL_8_0 \
    --tier=db-f1-micro \
    --region=us-west2 \
    --root-password=YOUR_ROOT_PASSWORD
```

### 2. Create Database and User

```bash
# Create database
gcloud sql databases create preffy_db --instance=preffy-mysql

# Create user
gcloud sql users create preffy_user \
    --instance=preffy-mysql \
    --password=YOUR_USER_PASSWORD
```

### 3. Grant Permissions

```sql
-- Connect to the database and run:
GRANT ALL PRIVILEGES ON preffy_db.* TO 'preffy_user'@'%';
FLUSH PRIVILEGES;
```

## Google Cloud Storage Setup

### 1. Create Storage Bucket

```bash
gsutil mb gs://preffy-storage
```

### 2. Set Bucket Permissions

```bash
# Make bucket publicly readable for serving files
gsutil iam ch allUsers:objectViewer gs://preffy-storage

# Or configure more restrictive permissions as needed
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `SPRING_PROFILES_ACTIVE` | Spring profile | `production` |
| `DB_PASSWORD` | Database password | `secure_password123` |
| `DB_USER` | Database username | `preffy_user` |
| `JWT_SECRET` | JWT signing secret | `your_jwt_secret_key` |
| `GCS_BUCKET_NAME` | Storage bucket name | `preffy-storage` |
| `GOOGLE_CLOUD_PROJECT` | GCP Project ID | `preffy-video-platform` |
| `CLOUDSQL_INSTANCE_CONNECTION_NAME` | Cloud SQL connection | `project:region:instance` |
| `BODY_FEEDBACK_API_URL` | Body feedback API | `https://api.example.com/body` |
| `SCRIPT_FEEDBACK_API_URL` | Script feedback API | `https://api.example.com/script` |
| `ALLOWED_ORIGINS` | CORS origins | `https://example.com` |

## Testing the Deployment

### 1. Health Check

```bash
curl https://preffy-backend-xxxxx-uw.a.run.app/actuator/health
```

### 2. API Endpoints

```bash
# Get projects
curl https://preffy-backend-xxxxx-uw.a.run.app/api/projects

# Health endpoint
curl https://preffy-backend-xxxxx-uw.a.run.app/actuator/health
```

## Monitoring and Logging

### 1. View Logs

```bash
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=preffy-backend" --limit=50 --format=json
```

### 2. Monitor Metrics

Visit the Cloud Run service in the Google Cloud Console to view:
- Request count and latency
- Memory and CPU usage
- Error rates
- Container instance metrics

## Scaling Configuration

The current configuration sets:
- **Min instances**: 0 (scales to zero when not used)
- **Max instances**: 10
- **Memory**: 1GB
- **CPU**: 1 vCPU

To modify scaling:

```bash
gcloud run services update preffy-backend \
    --region=us-west2 \
    --min-instances=1 \
    --max-instances=20 \
    --memory=2Gi \
    --cpu=2
```

## Security Best Practices

1. **Use IAM roles** with minimal required permissions
2. **Store secrets** in Google Secret Manager (not environment variables)
3. **Enable VPC connectors** for private network access
4. **Configure proper CORS** settings
5. **Use HTTPS only** (enabled by default in Cloud Run)
6. **Regular security updates** of base images

## Troubleshooting

### Common Issues

1. **Service not starting**: Check logs for configuration errors
2. **Database connection failed**: Verify Cloud SQL connection name and credentials
3. **Permission denied**: Check service account roles and permissions
4. **Out of memory**: Increase memory allocation or optimize application

### Debug Commands

```bash
# View service details
gcloud run services describe preffy-backend --region=us-west2

# View recent logs
gcloud logs tail cloudbuild

# Check service account permissions
gcloud projects get-iam-policy YOUR_PROJECT_ID
```

## Cost Optimization

1. **Use appropriate instance sizes** based on actual usage
2. **Configure minimum instances** to 0 for development
3. **Monitor usage** and adjust scaling accordingly
4. **Use committed use discounts** for production workloads

## Next Steps

1. Set up **monitoring and alerting**
2. Configure **custom domain** for the service
3. Implement **CI/CD pipeline** for automated deployments
4. Set up **database backups** and disaster recovery
5. Configure **load testing** to verify performance
