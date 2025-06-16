# Google Cloud Run Deployment Setup

This guide will help you deploy your Swagger UI to Google Cloud Run for a permanent public URL.

## 📋 Prerequisites

### 1. Install Google Cloud CLI

**On macOS (recommended method):**
```bash
# Using Homebrew
brew install --cask google-cloud-sdk

# Or using the installer
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

**Alternative methods:**
- Download from: https://cloud.google.com/sdk/docs/install
- Use the interactive installer: `curl https://sdk.cloud.google.com | bash`

### 2. Verify Installation
```bash
gcloud --version
```

### 3. Authenticate with Google Cloud
```bash
# Login to your Google account
gcloud auth login

# Set your project (or create one at console.cloud.google.com)
gcloud config set project YOUR_PROJECT_ID
```

### 4. Enable Billing
- Go to [Google Cloud Console](https://console.cloud.google.com)
- Enable billing for your project (required for Cloud Run)
- Cloud Run has a generous free tier: 2 million requests/month

## 🚀 Deployment Commands

### Option 1: Automated Deployment (Recommended)
```bash
# Deploy with our custom script
./deploy-cloud-run.sh
```

### Option 2: Manual Deployment
```bash
# Set your project ID
export GOOGLE_CLOUD_PROJECT="your-project-id"

# Deploy directly
./deploy-cloud-run.sh
```

### Option 3: Custom Configuration
```bash
# Deploy with custom settings
REGION="europe-west1" SERVICE_NAME="my-api-docs" ./deploy-cloud-run.sh
```

## 🌐 What You'll Get

- **Public HTTPS URL**: `https://preffy-api-docs-[hash]-uc.a.run.app`
- **Automatic scaling**: Scales to zero when not in use (no cost when idle)
- **SSL/TLS**: Automatically provided
- **Global CDN**: Fast loading worldwide
- **Custom domains**: Can add your own domain later

## 💰 Pricing

Google Cloud Run pricing:
- **Free tier**: 2 million requests/month, 360,000 GB-seconds/month
- **Pay-per-use**: Only pay when someone accesses your documentation
- **Estimated cost**: $0-5/month for typical API documentation usage

## 🔧 Post-Deployment

After deployment, you can:

### View your service:
```bash
gcloud run services list
```

### Update your documentation:
```bash
# Make changes to swagger.yaml, then redeploy
./deploy-cloud-run.sh
```

### View logs:
```bash
gcloud run services logs tail preffy-api-docs --region=us-central1
```

### Custom domain (optional):
```bash
gcloud run domain-mappings create --service=preffy-api-docs --domain=docs.yoursite.com
```

## 🚨 Troubleshooting

### Common Issues:

1. **"gcloud command not found"**
   - Install Google Cloud CLI (see step 1 above)

2. **"Project not set"**
   ```bash
   gcloud config set project YOUR_PROJECT_ID
   ```

3. **"Billing not enabled"**
   - Enable billing in Google Cloud Console

4. **"API not enabled"**
   - The script automatically enables required APIs

5. **"Authentication required"**
   ```bash
   gcloud auth login
   ```

## 📞 Next Steps

1. Install Google Cloud CLI (see above)
2. Run `./deploy-cloud-run.sh`
3. Share your public HTTPS URL with others!

Your Swagger UI will be accessible to anyone on the internet with the provided URL.
