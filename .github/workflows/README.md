# Backend CI/CD Workflows

This directory contains GitHub Actions workflows for the Preffy Video Flow backend service.

## Workflows

### 1. Backend CI/CD (`backend.yml`)
**Triggers:**
- Push to `main` or `develop` branches (when backend files change)
- Pull requests to `main` or `develop` branches (when backend files change)

**Jobs:**
- **Test & Validate**: Runs unit tests and generates test reports
- **Build Application**: Builds the JAR file and uploads artifacts
- **Build Docker Image**: Creates Docker image (only on main branch push)
- **Security & Quality Checks**: Runs dependency vulnerability checks

### 2. Backend Deployment (`backend-deploy.yml`)
**Triggers:**
- Successful completion of Backend CI/CD workflow on main branch
- Manual dispatch with environment selection

**Jobs:**
- **Deploy to Staging**: Automatically deploys after successful CI/CD
- **Deploy to Production**: Manual deployment to production environment

### 3. Backend Maintenance (`backend-maintenance.yml`)
**Triggers:**
- Scheduled: Every Monday at 9 AM UTC
- Manual dispatch

**Jobs:**
- **Dependency Check**: Checks for dependency updates and security vulnerabilities
- **Code Quality Analysis**: Runs code quality checks
- **Cleanup**: Removes old artifacts (older than 30 days)

## Environment Variables

The workflows use the following environment variables:
- `JAVA_VERSION`: Java version (set to '22')
- `GRADLE_OPTS`: Gradle optimization options

## Artifacts

The workflows generate the following artifacts:
- `test-results-{run_number}`: Test execution results and reports
- `backend-jar-{run_number}`: Built JAR files
- `backend-docker-{run_number}`: Docker image archive
- `security-reports-{run_number}`: Security vulnerability reports
- `dependency-reports-{run_number}`: Dependency update reports
- `quality-reports-{run_number}`: Code quality analysis reports

## Security Features

- Non-root user in Docker container
- Container security optimizations
- Dependency vulnerability scanning
- Automated cleanup of old artifacts
- Environment-based deployments with approval gates

## Build Optimizations

- Gradle build caching
- Docker layer caching
- Multi-stage Docker builds
- Optimized JVM settings for containers
- Parallel Gradle execution where possible

## Manual Deployment

To manually deploy to production:
1. Go to GitHub Actions tab
2. Select "Backend Deployment" workflow
3. Click "Run workflow"
4. Select "production" environment
5. Confirm deployment

## Monitoring

Each workflow includes:
- Detailed logging with `--info` flag
- Health checks for deployed applications
- Artifact retention policies
- Test result uploads for analysis
