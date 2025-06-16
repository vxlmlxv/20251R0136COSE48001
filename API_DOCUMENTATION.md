# Preffy Video Flow API Documentation

## Overview

The Preffy Video Flow API is a comprehensive REST API built with Spring Boot that provides video analysis and feedback capabilities for presentation improvement. This API allows users to upload videos, receive AI-powered analysis, and get actionable feedback to improve their presentation skills.

## API Specification Files

- **[swagger.yaml](./swagger.yaml)** - OpenAPI 3.0 specification in YAML format
- **[swagger.json](./swagger.json)** - OpenAPI 3.0 specification in JSON format

## Base URLs

- **Development**: `http://localhost:8080`
- **Production**: `https://api.preffyvideoflow.com`

## Authentication

The API uses JWT (JSON Web Token) authentication. Include the token in the Authorization header for protected endpoints:

```
Authorization: Bearer <your-jwt-token>
```

### Getting Started

1. **Register**: `POST /api/auth/register`
2. **Login**: `POST /api/auth/login` (returns JWT token)
3. **Use protected endpoints** with the JWT token

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - User logout

### Projects
- `GET /api/projects` - Get all user projects
- `POST /api/projects` - Create new project
- `GET /api/projects/{id}` - Get specific project
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

### Analysis & Feedback
- `GET /api/projects/{projectId}/script-segments` - Get speech analysis
- `GET /api/projects/{projectId}/posture-events` - Get posture analysis
- `GET /api/projects/{projectId}/suggestions` - Get improvement suggestions
- `POST /api/projects/{projectId}/suggestions/{suggestionId}/{action}` - Accept/reject suggestions
- `POST /api/projects/{projectId}/video` - Upload video
- `GET /api/projects/{projectId}/analysis` - Get complete analysis
- `GET /api/projects/{projectId}/status` - Get processing status

## Data Models

### Core Entities

#### Project
- **Status**: `CREATED`, `PROCESSING`, `COMPLETED`
- **Audience**: `GENERAL`, `TECHNICAL`, `BUSINESS`, `ACADEMIC`
- **Formality**: `INFORMAL`, `NEUTRAL`, `FORMAL`

#### Script Segment
- Contains transcribed text with timing information
- **Speech Acts**: `representatives`, `directives`, `commissives`, `expressives`, `declaratives`
- Includes section names for better organization

#### Posture Event
- Detects and analyzes posture-related behaviors
- Provides detailed timing and occurrence statistics
- Includes detected actions with frame-level precision

#### Suggestions
- AI-generated improvement recommendations
- **Types**: `modify`, `add`, `remove`
- Includes original text, suggested changes, and explanations

### Response Formats

All API responses follow a consistent JSON format with appropriate HTTP status codes:

- **200**: Success
- **201**: Created
- **204**: No Content (successful deletion)
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **409**: Conflict

## Example Usage

### 1. Register and Login

```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securePassword123",
    "fullName": "John Doe"
  }'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

### 2. Create Project

```bash
curl -X POST http://localhost:8080/api/projects \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Presentation",
    "description": "A presentation about our new product",
    "audience": "GENERAL",
    "formality": "NEUTRAL",
    "domain": "technology"
  }'
```

### 3. Get Analysis Results

```bash
# Get script segments
curl -X GET http://localhost:8080/api/projects/1/script-segments \
  -H "Authorization: Bearer <your-jwt-token>"

# Get posture events
curl -X GET http://localhost:8080/api/projects/1/posture-events \
  -H "Authorization: Bearer <your-jwt-token>"

# Get suggestions
curl -X GET http://localhost:8080/api/projects/1/suggestions \
  -H "Authorization: Bearer <your-jwt-token>"
```

## Data Relationships

```
User
├── Projects
    ├── Script Segments (with section names and speech acts)
    ├── Posture Events
    │   └── Detected Actions
    │       ├── Action Periods (frame-based timing)
    │       └── Action Summary (statistics)
    ├── Suggestions (with explanations and original text)
    └── Videos
```

## Technology Stack

- **Framework**: Spring Boot 3.x
- **Security**: JWT with Spring Security
- **Database**: JPA/Hibernate
- **Documentation**: OpenAPI 3.0 (Swagger)
- **Build Tool**: Gradle

## Schema Validation

All request bodies are validated using Jakarta Bean Validation:
- Required fields are enforced
- Email format validation
- Password minimum length requirements
- Enum value validation

## Error Handling

The API provides consistent error responses with detailed messages:

```json
{
  "error": "Validation failed",
  "message": "Email format is invalid",
  "timestamp": "2025-06-15T15:30:00.000000",
  "status": 400
}
```

## Rate Limiting

Production environment includes rate limiting to ensure fair usage and system stability.

## CORS Support

The API supports Cross-Origin Resource Sharing (CORS) for web applications.

## Viewing the API Documentation

### Option 1: Swagger UI (Recommended)
Access the interactive API documentation at:
- Development: `http://localhost:8080/swagger-ui.html`
- Production: `https://api.preffyvideoflow.com/swagger-ui.html`

### Option 2: OpenAPI Specification Files
- Use [swagger.yaml](./swagger.yaml) with any OpenAPI-compatible tool
- Import [swagger.json](./swagger.json) into Postman, Insomnia, or similar tools

### Option 3: Online Swagger Editor
1. Go to [editor.swagger.io](https://editor.swagger.io/)
2. Copy and paste the contents of `swagger.yaml`
3. View interactive documentation and generate client code

## Client Generation

Use the OpenAPI specification to generate client libraries in various languages:

```bash
# Generate JavaScript client
npx @openapitools/openapi-generator-cli generate \
  -i swagger.yaml \
  -g javascript \
  -o ./generated-client

# Generate Python client
npx @openapitools/openapi-generator-cli generate \
  -i swagger.yaml \
  -g python \
  -o ./generated-client
```

## Support

For API support and questions:
- Email: support@preffy.com
- Documentation: This README and OpenAPI specification
- Source Code: Available in this repository
