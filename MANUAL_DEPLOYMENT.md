# Manual Deployment Guide

Auto-deployment via GitHub Actions has been disabled to provide better control over production releases. This guide provides comprehensive instructions for manually deploying both backend and frontend components.

## Overview

The application consists of:
- **Backend**: Spring Boot application deployed to Google Cloud Run
- **Frontend**: React application deployed to Firebase Hosting

**Disabled GitHub Actions**:
- `firebase-hosting-merge.yml` - No longer auto-deploys frontend on main branch
- `firebase-hosting-pull-request.yml` - No longer creates preview deployments on PRs
- `build-and-test.yml` - Only performs CI (build/test/lint), no deployment

## Prerequisites

## Prerequisites

1. **Google Cloud CLI**: Ensure you have `gcloud` CLI installed and authenticated
2. **Firebase CLI**: Install and authenticate with `firebase login` 
3. **Docker**: For building container images
4. **Node.js & npm**: For frontend builds
5. **Java 22**: For backend builds
6. **Project Setup**: Cloud Run service and Cloud SQL instance configured

### Authentication Setup

```bash
# Google Cloud authentication
gcloud auth login
gcloud config set project preffy-video-c76b5

# Firebase authentication  
firebase login
```

## Backend Deployment

### Option 1: Using the Deployment Script

```bash
cd backend
./deploy-cloud-run.sh
```

### Option 2: Manual Commands

```bash
cd backend

# Build the Docker image
docker build -t us-west2-docker.pkg.dev/YOUR_PROJECT_ID/preffy-video-flow/preffy-backend:latest .

# Push to Artifact Registry
docker push us-west2-docker.pkg.dev/YOUR_PROJECT_ID/preffy-video-flow/preffy-backend:latest

# Deploy to Cloud Run
gcloud run deploy preffy-backend \
  --image us-west2-docker.pkg.dev/YOUR_PROJECT_ID/preffy-video-flow/preffy-backend:latest \
  --region us-west2 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 2Gi \
  --cpu 2 \
  --min-instances 1 \
  --max-instances 20 \
  --set-env-vars "SPRING_PROFILES_ACTIVE=production" \
  --set-env-vars "GOOGLE_CLOUD_PROJECT=YOUR_PROJECT_ID" \
  --set-env-vars "GCS_BUCKET_NAME=YOUR_BUCKET_NAME" \
  --set-env-vars "DB_USER=YOUR_DB_USER" \
  --set-env-vars "DB_PASSWORD=YOUR_DB_PASSWORD" \
  --set-env-vars "JWT_SECRET=YOUR_JWT_SECRET" \
  --set-env-vars "CLOUDSQL_INSTANCE_CONNECTION_NAME=YOUR_INSTANCE_CONNECTION" \
  --set-cloudsql-instances "YOUR_INSTANCE_CONNECTION" \
  --service-account "YOUR_SERVICE_ACCOUNT@YOUR_PROJECT_ID.iam.gserviceaccount.com"
```

## Frontend Deployment

### Firebase Hosting (Recommended)

```bash
cd frontend

# Install dependencies
npm ci

# Build the frontend
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting

# Verify deployment
firebase hosting:sites:list
```

### Preview Before Production Deploy

```bash
cd frontend

# Build the application
npm run build

# Preview locally
firebase serve --only hosting

# Deploy to preview channel for testing
firebase hosting:channel:deploy preview

# Deploy to production when ready
firebase deploy --only hosting
```

### Alternative: Cloud Storage (Static Hosting)

```bash
cd frontend

# Build the frontend
npm run build

# Upload to Cloud Storage
gsutil -m rsync -r -d dist/ gs://YOUR_BUCKET_NAME/

# Set public access (if needed)
gsutil -m acl ch -r -u AllUsers:R gs://YOUR_BUCKET_NAME/
```

## Environment Variables

Make sure to set the following environment variables for production deployment:

### Required Secrets
- `GOOGLE_CLOUD_PROJECT`: Your GCP project ID
- `GCS_BUCKET_NAME`: Cloud Storage bucket for file uploads
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `JWT_SECRET`: Secret key for JWT token signing
- `CLOUDSQL_INSTANCE_CONNECTION_NAME`: Cloud SQL instance connection string

### Optional Secrets
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins
- `BODY_FEEDBACK_API_URL`: External API URL for body language analysis
- `SCRIPT_FEEDBACK_API_URL`: External API URL for script analysis

## Deployment Verification

After deployment, verify the service is working:

```bash
# Get the service URL
SERVICE_URL=$(gcloud run services describe preffy-backend --region us-west2 --format "value(status.url)")

# Test health endpoint
curl -f "$SERVICE_URL/actuator/health"

# Test API endpoint
curl -f "$SERVICE_URL/api/health"
```

## Rollback Process

If you need to rollback to a previous version:

```bash
# List revisions
gcloud run revisions list --service preffy-backend --region us-west2

# Rollback to a specific revision
gcloud run services update-traffic preffy-backend \
  --to-revisions REVISION_NAME=100 \
  --region us-west2
```

## Deployment Checklist

### Pre-deployment Verification
- [ ] Run all tests locally: `cd backend && ./gradlew test`
- [ ] Run frontend tests: `cd frontend && npm test`
- [ ] Build both applications successfully
- [ ] Review recent changes and commits
- [ ] Ensure database migrations are ready (if any)
- [ ] Check environment variables and secrets are configured

### Backend Deployment Verification
- [ ] Build passes: `./gradlew clean build`
- [ ] Docker image builds successfully  
- [ ] Environment variables are configured
- [ ] Health endpoint responds: `curl $SERVICE_URL/actuator/health`
- [ ] API endpoint responds: `curl $SERVICE_URL/api/health`
- [ ] Check Cloud Run logs for any issues

### Frontend Deployment Verification
- [ ] Frontend build completes without errors
- [ ] No console errors in browser
- [ ] API connections work correctly
- [ ] All pages load properly
- [ ] Test critical user flows

### Post-deployment Monitoring
- [ ] Monitor application logs for 15-30 minutes
- [ ] Check error rates and performance metrics
- [ ] Verify all features are working as expected
- [ ] Update team on deployment status

## Continuous Integration

## Continuous Integration

The GitHub Actions workflow (`build-and-test.yml`) now only performs:
- ✅ Building and testing backend
- ✅ Building and testing frontend  
- ✅ Code quality checks and linting
- ✅ Security scanning
- ❌ **No automatic deployment**

**Disabled Firebase Workflows**:
- ✅ `firebase-hosting-merge.yml` - Disabled auto-deploy on main branch pushes
- ✅ `firebase-hosting-pull-request.yml` - Disabled preview deployments on PRs

Manual deployment ensures:
- Better control over release timing
- Ability to review changes before deployment
- Reduced risk of unintended deployments
- Environment-specific deployment strategies
- Manual verification of critical changes

## Troubleshooting

### Common Issues
1. **Build Failures**: Check Java/Node versions and dependency conflicts
2. **Docker Issues**: Ensure Docker daemon is running with sufficient resources
3. **Permission Errors**: Verify Google Cloud and Firebase authentication
4. **Memory Issues**: Monitor Cloud Run memory usage and adjust limits

### Getting Help
- Check application logs first: `gcloud logging read "resource.type=cloud_run_revision"`
- Review deployment scripts for configuration issues
- Consult the logging guides: `backend/LOGGING_GUIDE.md`
- Contact development team with specific error messages

---

**Note**: Manual deployment provides better control and visibility. Always test deployments in a staging environment before deploying to production.
