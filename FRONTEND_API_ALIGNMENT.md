# Frontend API Integration Summary

## Changes Made to Align Frontend with Backend API

### 1. Updated Type Definitions (`/lib/types.ts`)
- **User interface**: Added `username` field, made `locale` and `plan` optional
- **AuthResponse interface**: Added to handle login/register responses with token and user data
- **Project interface**: Updated enum values to match backend:
  - `audience`: Changed from lowercase to `'GENERAL' | 'TECHNICAL' | 'BUSINESS' | 'ACADEMIC'`
  - `formality`: Changed from lowercase to `'INFORMAL' | 'NEUTRAL' | 'FORMAL'`
  - `status`: Changed to `'CREATED' | 'PROCESSING' | 'COMPLETED'`
  - Added `videoUrl`, `updatedAt` fields
- **ScriptSegment interface**: Updated `speechAct` enum values to match backend
- **PostureEvent interface**: Added to match backend posture events structure
- **Suggestion interface**: Updated to match backend with `originalText` and `explanation` fields

### 2. Updated API Client (`/lib/api-client.ts`)
- **Authentication**: Changed to use `authToken` from localStorage instead of user ID
- **Configuration**: Added support for environment-based API URL configuration
- **Token Storage**: Updated to use proper JWT token storage keys

### 3. Updated Authentication Service (`/services/auth-service.ts`)
- **Login**: Returns `AuthResponse` instead of `User`
- **Register**: Added `username` parameter, returns `AuthResponse`
- **Endpoints**: Updated to match backend endpoints (`/auth/register` instead of `/auth/signup`)

### 4. Updated Feedback Service (`/services/feedback-service.ts`)
- **Posture Events**: Changed from `getBehaviorEvents` to `getPostureEvents`
- **Return Types**: Updated to match backend response structure

### 5. Updated Project Service (`/services/project-service.ts`)
- **Status Polling**: Updated to handle backend status format
- **Video Upload**: Simplified to match backend video upload structure

### 6. Updated Authentication Context (`/contexts/AuthContext.tsx`)
- **JWT Handling**: Proper token storage and retrieval
- **Registration**: Added username parameter to signup flow
- **Token Validation**: Check token validity on app initialization
- **Logout**: Made async to properly call backend logout endpoint

### 7. Updated UI Components
- **SignupPage**: Added username field to registration form
- **NewProjectPage**: Updated enum values for audience and formality
- **ProjectOverviewPage**: Updated status checks to use uppercase enum values
- **Navbar & AppLayout**: Updated logout calls to handle async logout

### 8. Added Configuration (`/lib/config.ts`)
- **API Endpoints**: Centralized endpoint definitions
- **Storage Keys**: Consistent key usage across the app
- **Environment Config**: Proper development/production API URL handling

### 9. Added Environment Files
- **Development**: `.env.development` with localhost API URL
- **Production**: API URL pointing to production backend

## Key Backend API Alignment Points

### Authentication Flow
1. **Registration**: `POST /api/auth/register` with username, email, password, fullName
2. **Login**: `POST /api/auth/login` with email, password
3. **Response**: Returns JWT token and user object
4. **Authorization**: Uses `Bearer {token}` header for authenticated requests

### Project Management
1. **Enum Values**: All enum values use uppercase (GENERAL, TECHNICAL, etc.)
2. **Status Flow**: CREATED → PROCESSING → COMPLETED
3. **Video Upload**: Sends metadata (fileName, fileSize, fileType) to backend

### Feedback Endpoints
1. **Script Segments**: `GET /projects/{id}/script-segments`
2. **Posture Events**: `GET /projects/{id}/posture-events`
3. **Suggestions**: `GET /projects/{id}/suggestions`
4. **Suggestion Actions**: `POST /projects/{id}/suggestions/{suggestionId}/{action}`

## Files Modified
- `/frontend/src/lib/types.ts`
- `/frontend/src/lib/api-client.ts`
- `/frontend/src/lib/config.ts` (new)
- `/frontend/src/services/auth-service.ts`
- `/frontend/src/services/feedback-service.ts`
- `/frontend/src/services/project-service.ts`
- `/frontend/src/contexts/AuthContext.tsx`
- `/frontend/src/pages/public/SignupPage.tsx`
- `/frontend/src/pages/app/NewProjectPage.tsx`
- `/frontend/src/pages/app/ProjectOverviewPage.tsx`
- `/frontend/src/components/layout/Navbar.tsx`
- `/frontend/src/components/layout/AppLayout.tsx`
- `/frontend/.env.development` (new)

## Next Steps
1. Test authentication flow with real backend
2. Verify project creation with proper enum values
3. Test video upload functionality
4. Validate feedback endpoints
5. Test suggestion accept/reject functionality

The frontend is now aligned with the backend API specification and should be able to communicate properly with the Spring Boot backend.
