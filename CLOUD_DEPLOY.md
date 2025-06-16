# Railway Deployment
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/swagger-ui?referralCode=preffy)

## Quick Cloud Deployment to Railway

1. Click the "Deploy on Railway" button above
2. Connect your GitHub account
3. Fork this repository
4. Railway will automatically deploy your Swagger UI
5. Get your public URL from Railway dashboard

## Alternative: Manual Railway Deployment

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up
```

## Render Deployment

1. Go to [render.com](https://render.com)
2. Connect your GitHub repository
3. Create a new Web Service
4. Use these settings:
   - **Build Command**: `docker build -f Dockerfile.swagger -t swagger-ui .`
   - **Start Command**: `docker run -p $PORT:8080 swagger-ui`
   - **Environment**: Docker

## Heroku Deployment

```bash
# Install Heroku CLI and login
heroku login

# Create app
heroku create your-app-name

# Set stack to container
heroku stack:set container -a your-app-name

# Create heroku.yml
echo "build:
  docker:
    web: Dockerfile.swagger" > heroku.yml

# Deploy
git add .
git commit -m "Deploy Swagger UI"
git push heroku main
```

## Docker Hub + Cloud Run

```bash
# Build and push to Docker Hub
docker build -f Dockerfile.swagger -t your-username/preffy-api-docs .
docker push your-username/preffy-api-docs

# Deploy to Google Cloud Run
gcloud run deploy preffy-api-docs \
  --image your-username/preffy-api-docs \
  --port 8080 \
  --allow-unauthenticated \
  --region us-central1
```
