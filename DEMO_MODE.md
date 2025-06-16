# Demo Mode Implementation

This document describes the demo mode functionality added to the Preffy Video Flow application.

## Overview

Demo mode allows users to explore the application with sample data without requiring a backend server. Users can log in with demo credentials and view a comprehensive, fully analyzed project.

## Demo Credentials

- **Email**: `demo@preffy.com`
- **Password**: `demo123`

## Features

### Authentication
- Demo login with predefined credentials
- Demo user profile with sample data
- Automatic demo mode activation/deactivation

### Projects
- Demo project with comprehensive analysis results
- Demo video with metadata
- Full project viewing capabilities
- Blocked create/update/delete operations in demo mode

### Analysis Results
- Sample script segments with speech act analysis
- Posture events and detected actions
- Behavior events (gesture, facial, posture)
- Badge scores for various communication aspects
- Improvement suggestions with detailed feedback

### UI Indicators
- Demo mode banner in navigation bar
- Visual indication when in demo mode
- Appropriate error messages for blocked operations

## Implementation Details

### Services with Demo Mode Support

1. **Auth Service** (`auth-service.ts`)
   - Demo login validation
   - Demo user profile retrieval
   - Demo mode storage management

2. **Project Service** (`project-service.ts`)
   - Demo project and video data
   - Analysis results for demo project
   - Blocked operations in demo mode

3. **Feedback Service** (`feedback-service.ts`)
   - Demo script segments
   - Demo posture events
   - Demo badge scores and suggestions
   - Blocked suggestion modifications

### Mock Data Structure

The demo mode uses comprehensive mock data including:

- **Demo User**: Sample user profile with "Demo User" name
- **Demo Project**: "Demo Project" with complete metadata
- **Demo Video**: Sample video with proper metadata
- **Script Segments**: Multiple segments with various speech acts
- **Behavior Events**: Gesture, facial, and posture events
- **Badge Scores**: Scores for communication aspects
- **Suggestions**: Improvement suggestions with types and explanations

### Storage

Demo mode uses localStorage keys:
- `demo-mode`: Boolean flag for demo mode status
- `authToken`: Demo authentication token
- `prefUser`: Demo user data

## Usage

1. Navigate to the login page
2. Enter demo credentials (`demo@preffy.com` / `demo123`)
3. Application automatically enables demo mode
4. Browse the demo project and analysis results
5. Logout to exit demo mode

## Limitations

- Cannot create, update, or delete projects in demo mode
- Cannot upload videos in demo mode
- Cannot modify suggestions in demo mode
- Registration is disabled in demo mode
- All data is static and resets on logout

## Files Modified

- `frontend/src/lib/mock-data.ts` - Demo data and credentials
- `frontend/src/lib/config.ts` - Demo mode utility function
- `frontend/src/services/auth-service.ts` - Demo authentication
- `frontend/src/services/project-service.ts` - Demo project handling
- `frontend/src/services/feedback-service.ts` - Demo feedback data
- `frontend/src/components/layout/Navbar.tsx` - Demo mode indicator

## Testing

To test demo mode:
1. Start the frontend development server
2. Navigate to the login page
3. Use demo credentials to log in
4. Verify demo mode banner appears
5. Explore the demo project and analysis results
6. Attempt blocked operations to verify error handling
