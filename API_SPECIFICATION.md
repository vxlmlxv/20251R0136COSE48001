
# Preffy Video Flow API Specification

## Overview
The Preffy Video Flow API is a RESTful service that provides AI-powered video presentation feedback. This API allows users to upload videos, analyze presentations, and receive detailed feedback on script content, body language, and overall presentation quality.

## Base URL
- Development: `http://localhost:8080/api`
- Production: `https://api.preffyvideoflow.com/api`

## Authentication
All endpoints (except health check and auth endpoints) require Bearer token authentication.

**Header Format:**
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Feature Categories

### 1. Authentication & User Management

#### POST /auth/register
**Description:** Register a new user account
**Input Data:**
```json
{
  "username": "string (required, 3-50 chars)",
  "email": "string (required, valid email)",
  "password": "string (required, min 8 chars)",
  "fullName": "string (required)"
}
```
**Output Data:**
```json
{
  "accessToken": "string",
  "tokenType": "Bearer",
  "user": {
    "id": "number",
    "username": "string",
    "email": "string",
    "fullName": "string",
    "role": "USER|ADMIN",
    "plan": "FREE|PREMIUM|ENTERPRISE",
    "createdAt": "string (ISO date)"
  }
}
```

#### POST /auth/login
**Description:** Authenticate user and receive access token
**Input Data:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```
**Output Data:** Same as register

#### POST /auth/logout
**Description:** Invalidate current session token
**Input Data:** None (token in header)
**Output Data:**
```json
{
  "message": "Successfully logged out"
}
```

### 2. Project Management

#### GET /projects
**Description:** Get all projects for authenticated user
**Input Data:** Query parameters (optional):
- `status`: Filter by project status
- `limit`: Number of results (default: 20)
- `offset`: Pagination offset (default: 0)

**Output Data:**
```json
[
  {
    "id": "number",
    "title": "string",
    "description": "string",
    "audience": "GENERAL|TECHNICAL|BUSINESS|ACADEMIC",
    "formality": "CASUAL|NEUTRAL|FORMAL",
    "domain": "string",
    "status": "CREATED|UPLOADING|PROCESSING|ANALYZED|COMPLETED",
    "createdAt": "string (ISO date)",
    "updatedAt": "string (ISO date)"
  }
]
```

#### POST /projects
**Description:** Create a new project
**Input Data:**
```json
{
  "title": "string (required, max 255 chars)",
  "description": "string (optional)",
  "audience": "GENERAL|TECHNICAL|BUSINESS|ACADEMIC",
  "formality": "CASUAL|NEUTRAL|FORMAL",
  "domain": "string (optional)"
}
```
**Output Data:** Single project object (same structure as GET)

#### GET /projects/{id}
**Description:** Get specific project details
**Input Data:** Path parameter: `id` (project ID)
**Output Data:** Single project object with additional details:
```json
{
  "id": "number",
  "title": "string",
  "description": "string",
  "audience": "string",
  "formality": "string",
  "domain": "string",
  "status": "string",
  "videoPath": "string (nullable)",
  "createdAt": "string",
  "updatedAt": "string",
  "analysisProgress": "number (0-100)"
}
```

#### PUT /projects/{id}
**Description:** Update project details
**Input Data:** Same as POST /projects (all fields optional)
**Output Data:** Updated project object

#### DELETE /projects/{id}
**Description:** Delete a project and all associated data
**Input Data:** Path parameter: `id`
**Output Data:**
```json
{
  "message": "Project deleted successfully"
}
```

### 3. Video Upload & Processing

#### POST /projects/{id}/video
**Description:** Upload video file for analysis
**Input Data:** 
- Path parameter: `id` (project ID)
- Form data: `file` (video file, max 500MB)
- Supported formats: MP4, AVI, MOV, WebM

**Output Data:**
```json
{
  "videoId": "string",
  "url": "string",
  "duration": "number (seconds)",
  "resolution": {
    "width": "number",
    "height": "number"
  },
  "fileSize": "number (bytes)",
  "status": "UPLOADED"
}
```

#### GET /projects/{id}/status
**Description:** Get real-time project processing status
**Input Data:** Path parameter: `id`
**Output Data:**
```json
{
  "status": "CREATED|UPLOADING|PROCESSING|ANALYZED|COMPLETED",
  "progress": "number (0-100)",
  "currentStep": "string",
  "estimatedTimeRemaining": "number (seconds, nullable)"
}
```

### 4. Script Analysis

#### GET /projects/{id}/script-segments
**Description:** Get analyzed script segments with timestamps
**Input Data:** Path parameter: `id`
**Output Data:**
```json
[
  {
    "id": "string",
    "start": "number (seconds)",
    "end": "number (seconds)",
    "text": "string",
    "speechAct": "STATEMENT|QUESTION|COMMAND|EMPHASIS",
    "confidence": "number (0-1)",
    "wordsPerMinute": "number",
    "fillerWords": "number",
    "clarity": "number (0-100)"
  }
]
```

#### GET /projects/{id}/script-sections
**Description:** Get script organized into logical sections
**Input Data:** Path parameter: `id`
**Output Data:**
```json
[
  {
    "id": "string",
    "title": "string",
    "start": "number",
    "end": "number",
    "sentences": ["string"],
    "keyPoints": ["string"],
    "transitionQuality": "number (0-100)"
  }
]
```

### 5. Behavior Analysis

#### GET /projects/{id}/behavior-events
**Description:** Get detected behavior events (gestures, facial expressions, posture)
**Input Data:** 
- Path parameter: `id`
- Query parameter: `type` (optional): "gesture|facial|posture"

**Output Data:**
```json
[
  {
    "id": "string",
    "start": "number",
    "end": "number",
    "type": "GESTURE|FACIAL|POSTURE",
    "category": "string",
    "severity": "LOW|MEDIUM|HIGH",
    "description": "string",
    "recommendation": "string",
    "confidence": "number (0-1)"
  }
]
```

### 6. Performance Scoring

#### GET /projects/{id}/badge-scores
**Description:** Get performance scores across different presentation aspects
**Input Data:** Path parameter: `id`
**Output Data:**
```json
[
  {
    "badgeId": "string",
    "name": "string",
    "category": "DELIVERY|CONTENT|ENGAGEMENT|TECHNICAL",
    "stars": "number (1-5)",
    "score": "number (0-100)",
    "totalEvents": "number",
    "feedback": "string",
    "improvements": ["string"]
  }
]
```

### 7. AI Suggestions

#### GET /projects/{id}/suggestions
**Description:** Get AI-generated improvement suggestions
**Input Data:** Path parameter: `id`
**Output Data:**
```json
[
  {
    "id": "string",
    "sectionId": "string",
    "type": "MODIFY|DELETE|KEEP|ADD",
    "priority": "HIGH|MEDIUM|LOW",
    "category": "CONTENT|DELIVERY|STRUCTURE",
    "originalText": "string (nullable)",
    "suggestedText": "string (nullable)",
    "rationale": "string",
    "impact": "string",
    "status": "PENDING|ACCEPTED|REJECTED"
  }
]
```

#### POST /projects/{id}/suggestions/{suggestionId}/accept
**Description:** Accept an AI suggestion
**Input Data:** Path parameters: `id`, `suggestionId`
**Output Data:**
```json
{
  "status": "ACCEPTED",
  "appliedAt": "string (ISO date)"
}
```

#### POST /projects/{id}/suggestions/{suggestionId}/reject
**Description:** Reject an AI suggestion
**Input Data:** Path parameters: `id`, `suggestionId`
**Output Data:**
```json
{
  "status": "REJECTED",
  "rejectedAt": "string (ISO date)"
}
```

### 8. Health & Monitoring

#### GET /health
**Description:** Check API service health
**Input Data:** None
**Output Data:**
```json
{
  "status": "UP",
  "service": "Preffy Video Flow API",
  "timestamp": "string (ISO date)",
  "version": "string"
}
```

---

## Error Responses

All endpoints may return the following error formats:

### 400 Bad Request
```json
{
  "error": "VALIDATION_ERROR",
  "message": "Request validation failed",
  "details": [
    {
      "field": "string",
      "message": "string"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "UNAUTHORIZED",
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "FORBIDDEN", 
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "error": "NOT_FOUND",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "INTERNAL_ERROR",
  "message": "An internal server error occurred"
}
```

---

## Rate Limiting

- Free tier: 100 requests per hour
- Premium tier: 1000 requests per hour  
- Enterprise tier: Unlimited

Rate limit headers are included in all responses:
- `X-RateLimit-Limit`: Requests allowed per hour
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Timestamp when limit resets
