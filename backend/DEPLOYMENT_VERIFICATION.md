# Backend and Database Deployment Verification Guide

## 1. Quick Status Check Commands

Run these commands one by one to check your deployment status:

### Check Authentication and Project
```bash
gcloud auth list
gcloud config get-value project
```

### Check Required APIs
```bash
gcloud services list --enabled --filter="name:cloudbuild"
gcloud services list --enabled --filter="name:run"
gcloud services list --enabled --filter="name:sqladmin"
gcloud services list --enabled --filter="name:artifactregistry"
```

### Check Cloud SQL Database
```bash
gcloud sql instances list
gcloud sql instances describe preffy-mysql  # If exists
```

### Check Cloud Run Service
```bash
gcloud run services list
gcloud run services list --region=us-west2
gcloud run services list --region=us-central1
```

### Check Artifact Registry
```bash
gcloud artifacts repositories list
```

## 2. Enable Required APIs (if not enabled)

```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable storage.googleapis.com
```

## 3. Set Up Database (if not exists)

```bash
cd backend
./setup-cloud-sql.sh preffy-video-platform us-west2
```

## 4. Deploy Backend (if not deployed)

```bash
cd backend
./deploy-cloud-run.sh preffy-video-platform us-west2
```

## 5. Test Deployed Service

Once deployed, test the endpoints:

```bash
# Get service URL
SERVICE_URL=$(gcloud run services describe preffy-backend --region=us-west2 --format="value(status.url)")

# Test health endpoint
curl -v "$SERVICE_URL/actuator/health"

# Test API endpoint
curl -v "$SERVICE_URL/api/health"
```

## 6. Check Logs for Issues

```bash
# Recent logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=preffy-backend" --limit=20

# Error logs only
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=preffy-backend AND severity>=ERROR" --limit=10
```

## 7. Database Connection Verification

If the service is deployed but having database issues:

```bash
# Check Cloud SQL instance status
gcloud sql instances describe preffy-mysql

# Check database exists
gcloud sql databases list --instance=preffy-mysql

# Check users
gcloud sql users list --instance=preffy-mysql
```

## Common Issues and Solutions

### Issue 1: APIs Not Enabled
**Solution**: Run the enable commands in step 2

### Issue 2: Cloud SQL Instance Not Found
**Solution**: Run the setup-cloud-sql.sh script

### Issue 3: Service Not Deployed
**Solution**: Run the deploy-cloud-run.sh script

### Issue 4: Database Connection Errors
**Symptoms**: Service starts but returns 500 errors
**Solution**: 
- Check environment variables are set
- Verify Cloud SQL instance is running
- Check service account permissions

### Issue 5: Health Endpoint Returns 503
**Symptoms**: Service URL accessible but health check fails
**Solution**:
- Check application logs
- Verify database connectivity
- Check resource limits (memory/CPU)

## Environment Variables Required

Ensure these are set in Cloud Run:
- `SPRING_PROFILES_ACTIVE=production`
- `DB_PASSWORD` (your database password)
- `JWT_SECRET` (your JWT secret)
- `GCS_BUCKET_NAME` (your storage bucket)
- `CLOUDSQL_INSTANCE_CONNECTION_NAME` (auto-set by deployment script)

## Next Steps After Verification

1. **If everything is working**: Your backend is deployed and connected
2. **If database issues**: Check Cloud SQL configuration and connectivity
3. **If service issues**: Check logs and resource allocation
4. **If not deployed**: Follow the deployment steps above

Run the quick status check commands first to see what's already set up!
