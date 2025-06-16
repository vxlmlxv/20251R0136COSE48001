# Preffy Video Flow Backend

A Spring Boot backend application for the Preffy video presentation analysis platform.

## Features

- **User Authentication**: JWT-based authentication and authorization
- **Project Management**: CRUD operations for video projects
- **Video Analysis**: Endpoints for retrieving analysis results including:
  - Script segments with timing and speech act classification
  - Behavioral events (gestures, facial expressions, posture)
  - Performance badge scores
  - AI-generated improvement suggestions
- **File Upload**: Video file upload handling
- **API Documentation**: Comprehensive Swagger/OpenAPI documentation

## Technology Stack

- **Java 22** - Latest Java LTS
- **Spring Boot 3.5.0** - Main framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Database access
- **H2 Database** - In-memory database for development
- **JWT** - JSON Web Tokens for authentication
- **Swagger/OpenAPI 3** - API documentation
- **Gradle** - Build tool

## Getting Started

### Prerequisites

- Java 22 or higher
- Gradle 8.0 or higher (or use the included Gradle wrapper)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd preffy-video-flow/backend
   ```

2. **Build the project**
   ```bash
   ./gradlew build
   ```

3. **Run the application**
   ```bash
   ./gradlew bootRun
   ```

   The application will start on `http://localhost:8080`

### Sample Data

The application automatically initializes with sample data including:
- Demo user account (`demo@preffy.com` / `password123`)
- Sample project with analysis results
- Script segments, behavior events, badge scores, and suggestions

## API Documentation

Once the application is running, you can access:

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs
- **H2 Console**: http://localhost:8080/h2-console (development only)

### Authentication

Most endpoints require JWT authentication. To authenticate:

1. **Register a new account**:
   ```bash
   POST /api/auth/register
   {
     "username": "testuser",
     "email": "test@example.com", 
     "password": "password123",
     "fullName": "Test User"
   }
   ```

2. **Login** (or use demo account):
   ```bash
   POST /api/auth/login
   {
     "email": "demo@preffy.com",
     "password": "password123"
   }
   ```

3. **Use the returned JWT token** in the Authorization header:
   ```
   Authorization: Bearer <your-jwt-token>
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Projects
- `GET /api/projects` - Get all user projects
- `GET /api/projects/{id}` - Get project by ID
- `POST /api/projects` - Create new project
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

### Analysis & Feedback
- `GET /api/projects/{id}/script-segments` - Get script analysis
- `GET /api/projects/{id}/behavior-events` - Get behavior events
- `GET /api/projects/{id}/badge-scores` - Get performance badges
- `GET /api/projects/{id}/suggestions` - Get improvement suggestions
- `POST /api/projects/{id}/suggestions/{suggestionId}/{action}` - Accept/reject suggestion
- `POST /api/projects/{id}/video` - Upload video file
- `GET /api/projects/{id}/analysis` - Get complete analysis
- `GET /api/projects/{id}/status` - Get project status

## Database Schema

### Core Entities
- **User**: User accounts with authentication details
- **Project**: Video projects with metadata
- **Video**: Video file information
- **ScriptSegment**: Analyzed speech segments
- **BehaviorEvent**: Detected behavioral events
- **BadgeScore**: Performance ratings
- **Suggestion**: AI-generated improvements

## Configuration

Key configuration properties in `application.properties`:

```properties
# Database (H2 in-memory for development)
spring.datasource.url=jdbc:h2:mem:preffydb

# JWT Configuration
app.jwtSecret=your-secret-key
app.jwtExpirationInMs=604800000

# File Upload
spring.servlet.multipart.max-file-size=50MB

# Swagger
springdoc.swagger-ui.path=/swagger-ui.html
```

## Development

### Running Tests
```bash
./gradlew test
```

### Building for Production
```bash
./gradlew build -Pprod
```

### Database Console
Access the H2 database console at http://localhost:8080/h2-console with:
- JDBC URL: `jdbc:h2:mem:preffydb`
- Username: `sa`
- Password: (empty)

## Frontend Integration

This backend is designed to work with the React frontend located in the `../frontend` directory. The API endpoints match the service calls defined in the frontend codebase.

### CORS Configuration
CORS is configured to allow requests from any origin during development. Update the `@CrossOrigin` annotations in controllers for production use.

## Deployment

For production deployment:

1. **Update database configuration** to use PostgreSQL or MySQL
2. **Configure proper JWT secret** and security settings
3. **Set up file storage** for video uploads (AWS S3, etc.)
4. **Enable HTTPS** and update CORS settings
5. **Configure logging** and monitoring

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
