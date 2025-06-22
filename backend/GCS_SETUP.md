# Google Cloud Storage Setup

This document explains how to set up Google Cloud Storage for the Preffy Video Flow application.

## Prerequisites

1. Google Cloud Platform account
2. A GCP project created
3. Billing enabled for the project

## Step 1: Create a GCS Bucket

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to Cloud Storage > Buckets
3. Click "Create Bucket"
4. Choose a globally unique bucket name (e.g., `preffy-video-storage-your-suffix`)
5. Select a region close to your users
6. Choose "Standard" storage class
7. Set access control to "Uniform"
8. Create the bucket

## Step 2: Create Service Account

1. Navigate to IAM & Admin > Service Accounts
2. Click "Create Service Account"
3. Give it a name like "preffy-video-storage"
4. Add roles:
   - Storage Object Admin (for full access to objects)
   - Storage Legacy Bucket Reader (for bucket access)
5. Create and download the JSON key file
6. Place the JSON file in `backend/src/main/resources/` directory
7. Rename it to `gcp-service-account.json`

## Step 3: Configure Application

Update `application.properties`:

```properties
# Change storage type to GCS
app.storage.type=gcs

# Update GCS configuration
app.storage.gcs.bucket=your-bucket-name
app.storage.gcs.project-id=your-project-id
```

## Step 4: Environment Variables (Production)

For production, use environment variables instead of embedding credentials:

```bash
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
export GCP_PROJECT_ID=your-project-id
export GCS_BUCKET_NAME=your-bucket-name
```

## Step 5: Test the Integration

1. Start the backend server
2. Upload a video through the frontend
3. Check if the video appears in your GCS bucket
4. Verify the FastAPI service can access the public URL

## Troubleshooting

- **Authentication Error**: Make sure the service account JSON is correctly placed and has proper permissions
- **Bucket Not Found**: Verify the bucket name in configuration matches the actual bucket
- **Access Denied**: Check that the service account has the required Storage roles
- **Billing**: Ensure billing is enabled for your GCP project

## Cost Considerations

- Standard storage: $0.020 per GB per month
- Network egress charges may apply for video streaming
- Consider using Nearline or Coldline storage for archival videos

## Security Notes

- Never commit service account JSON files to version control
- Use IAM roles with minimal required permissions
- Consider using signed URLs with expiration times
- Enable audit logging for security monitoring
