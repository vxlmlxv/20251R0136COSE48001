# Preffy Local Development Setup

This guide will help you run the entire Preffy application locally without deploying to Google Cloud Run.

## Quick Start

### Option 1: One-Command Start (Recommended)
```bash
npm run dev:all
```

This will automatically:
- Start MySQL, Redis, and FastAPI in Docker containers
- Start the Spring Boot backend
- Start the React frontend
- Wait for all services to be ready

### Option 2: Manual Step-by-Step

1. **Start Database Services**
   ```bash
   npm run dev:services
   ```

2. **Start Backend and Frontend**
   ```bash
   npm run dev
   ```

## Services Overview

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:8081 | React application |
| Backend API | http://localhost:8080 | Spring Boot REST API |
| FastAPI | http://localhost:8000 | AI analysis service |
| MySQL | localhost:3306 | Database |
| phpMyAdmin | http://localhost:8085 | Database management |
| Redis | localhost:6379 | Caching & sessions |
| Swagger UI | http://localhost:8080/swagger-ui.html | API documentation |

## Database Access

- **Username**: preffyuser
- **Password**: preffypass123
- **Database**: preffydb
- **phpMyAdmin**: http://localhost:8085 (use above credentials)

## Features Available Locally

✅ **User Authentication**
- Sign up new users
- Login/logout
- JWT token management
- User profile management

✅ **Project Management**
- Create video projects
- Upload videos
- View project status
- Update project details

✅ **Video Analysis**
- AI-powered speech analysis
- Posture detection
- Improvement suggestions
- Real-time progress tracking

✅ **API Integration**
- Full REST API functionality
- File upload handling
- WebSocket support (if implemented)
- CORS configured for local development

## Configuration Files

- `backend/src/main/resources/application-local.properties` - Backend local config
- `frontend/.env.local` - Frontend environment variables
- `backend/docker-compose.yml` - Docker services configuration

## Useful Commands

### Development
```bash
# Start all services
npm run dev:all

# Start only database services
npm run dev:db

# Start backend and frontend only
npm run dev

# View logs
npm run logs:backend
npm run logs:db
```

### Maintenance
```bash
# Stop all services
npm run stop

# Reset database (removes all data)
npm run reset:db

# Clean and reinstall everything
npm run clean:all
```

### Testing
```bash
# Run backend tests
npm run test:backend

# Build everything
npm run build
```

## Troubleshooting

### Port Conflicts
If you get port conflicts, check what's using the ports:
```bash
lsof -i :8080  # Backend
lsof -i :8081  # Frontend
lsof -i :3306  # MySQL
lsof -i :8000  # FastAPI
```

### Database Issues
```bash
# Reset database completely
npm run reset:db

# Check database logs
npm run logs:db
```

### Backend Issues
```bash
# Check backend logs
npm run logs:backend

# Clean and rebuild
npm run clean
npm run build:backend
```

### Frontend Issues
```bash
# Reinstall dependencies
cd frontend
rm -rf node_modules
npm install

# Check environment variables
cat .env.local
```

## Development Workflow

1. **Start Services**: `npm run dev:all`
2. **Make Changes**: Edit code in your IDE
3. **Test Features**:
   - Create user account at http://localhost:8081
   - Upload a video
   - Check analysis results
   - Verify API responses
4. **Monitor Logs**: Use log commands to debug issues
5. **Stop Services**: Press Ctrl+C or `npm run stop`

## API Testing

You can test the API using:
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **curl** commands
- **Postman** or similar tools

Example curl command:
```bash
# Health check
curl http://localhost:8080/api/health

# Register user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123","fullName":"Test User"}'
```

## Next Steps

Once your local development is working:
1. All features should work end-to-end
2. You can develop new features locally
3. Test API integrations thoroughly
4. Deploy when ready using existing deployment scripts

## Need Help?

- Check service logs: `npm run logs:backend` or `npm run logs:db`
- Verify all services are running: `docker ps`
- Check network connectivity between services
- Ensure all environment variables are set correctly
