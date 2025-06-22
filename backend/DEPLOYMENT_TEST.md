# Quick Cloud Run Deployment Test

This guide provides a quick way to test the Cloud Run deployment locally before deploying to GCP.

## Local Testing with Docker

### 1. Build the Docker Image

```bash
cd backend
docker build -t preffy-backend:local .
```

### 2. Test with Production Profile

```bash
# Create a test environment file
cat > .env.test << EOF
SPRING_PROFILES_ACTIVE=production
GOOGLE_CLOUD_PROJECT=test-project
GCS_BUCKET_NAME=test-bucket
DB_USER=test_user
DB_PASSWORD=test_password
JWT_SECRET=test_jwt_secret_key_for_development_only
CLOUDSQL_INSTANCE_CONNECTION_NAME=test:us-west2:test-instance
EOF

# Run the container with test environment
docker run --rm -p 8080:8080 --env-file .env.test preffy-backend:local
```

### 3. Test the Application

```bash
# Health check
curl http://localhost:8080/actuator/health

# API endpoints (should return authentication errors since no real DB)
curl http://localhost:8080/api/projects
```

## Pre-Deployment Checklist

- [ ] **Google Cloud Project** created and configured
- [ ] **Billing** enabled on the project
- [ ] **gcloud CLI** installed and authenticated
- [ ] **Docker** installed for local testing
- [ ] **Cloud SQL instance** created (use `./setup-cloud-sql.sh`)
- [ ] **Storage bucket** created for file uploads
- [ ] **Service account** created with appropriate permissions
- [ ] **Environment variables** prepared and secured

## Deployment Commands

### Option 1: Automated Script
```bash
./deploy-cloud-run.sh YOUR_PROJECT_ID us-west2
```

### Option 2: Manual Cloud Build
```bash
cd quickstart-docker
gcloud builds submit . --config=cloudbuild.yaml
```

### Option 3: GitHub Actions
Push to main branch or manually trigger the "Deploy to Cloud Run" workflow.

## Environment Variables Checklist

Required for production deployment:

```bash
# Database
export DB_PASSWORD="your_secure_database_password"
export DB_USER="preffy_user"

# Security
export JWT_SECRET="your_very_long_and_secure_jwt_secret_key"

# Google Cloud
export GOOGLE_CLOUD_PROJECT="your-project-id"
export GCS_BUCKET_NAME="your-storage-bucket"
export CLOUDSQL_INSTANCE_CONNECTION_NAME="project:region:instance"

# Optional
export ALLOWED_ORIGINS="https://your-frontend-domain.com"
export BODY_FEEDBACK_API_URL="https://your-api.com/body-feedback"
export SCRIPT_FEEDBACK_API_URL="https://your-api.com/script-feedback"
```

## Verification Steps

After deployment:

1. **Health Check**: Visit `https://your-service-url/actuator/health`
2. **API Test**: Try accessing `https://your-service-url/api/projects`
3. **Logs**: Check Cloud Run logs for any errors
4. **Database**: Verify database tables are created
5. **Storage**: Test file upload functionality

## Common Issues

- **Build fails**: Check Docker context and file paths
- **Service won't start**: Check environment variables and logs
- **Database connection fails**: Verify Cloud SQL configuration
- **Permission denied**: Check service account roles

## Rollback Plan

If deployment fails:

```bash
# List previous revisions
gcloud run revisions list --service=preffy-backend --region=us-west2

# Rollback to previous revision
gcloud run services update-traffic preffy-backend \
  --to-revisions=REVISION_NAME=100 \
  --region=us-west2
```
