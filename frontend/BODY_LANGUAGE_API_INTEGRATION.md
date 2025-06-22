# Body Language Analysis API Integration

## Overview
This document describes the integration of the body language feedback API (http://moonsvr.com:8000/analysis/action) into the Preffy Video Flow application.

## Implementation Details

### 1. API Service Layer
**File:** `/frontend/src/services/body-language-service.ts`

- **analyzeBodyLanguage(videoUrl: string)**: Main function to analyze body language from a video URL
- **checkBodyLanguageServiceHealth()**: Health check function to verify API availability
- Uses proper error handling and timeout management

### 2. Type Definitions
**File:** `/frontend/src/lib/types.ts`

Added new interfaces:
- `BodyLanguageAnalysisRequest`: Request payload structure
- `BodyLanguageAnalysisResponse`: Complete API response structure
- Updated `BehaviorEvent`: Added start/end fields for timeline compatibility

### 3. Frontend Integration

#### State Management
Both English and Korean versions include:
- `analysisResult`: Stores the complete API response
- `isAnalyzing`: Loading state for analysis in progress
- `analysisError`: Error state for failed requests
- `serviceAvailable`: API service health status

#### UI Components

**Service Status Indicator:**
- Green dot: Service online
- Red dot: Service offline  
- Yellow dot: Checking status

**Analysis Button:**
- Triggers API call to analyze body language
- Shows loading state with spinner
- Disabled when service is offline or no video available
- Changes text to "Re-analyze" after first successful analysis

**Status Cards:**
- Error card (red): Shows analysis errors
- Success card (green): Shows completion status and AI recommendations

#### Data Transformation
The `transformAnalysisToLocalData()` function converts API response to local data structures:

**Gesture Analysis:**
- Maps `gesture_quality_score` to 1-5 star rating
- Creates behavior events for each gesture with 2-second duration

**Posture Analysis:**
- Maps `average_posture_score` to 1-5 star rating
- Creates behavior events for each posture event with 3-second duration

**Facial Expression Analysis:**
- Maps `smile_consistency` and `eye_contact_score` to separate badges
- Creates behavior events for each expression with 1-second duration

### 4. User Experience Flow

1. **Page Load**: 
   - Service health check runs automatically
   - Shows current service status
   - Loads mock data initially

2. **Analysis Trigger**:
   - User clicks "Analyze Body Language" button
   - System validates video availability
   - Shows loading state with progress message
   - Makes API call to moonsvr.com:8000

3. **Results Display**:
   - Success: Updates badges, timeline, and behavior events
   - Shows overall score and AI recommendations
   - Error: Displays error message with fallback to mock data

4. **Re-analysis**:
   - Button changes to "Re-analyze" after first completion
   - Can refresh service status manually

### 5. Bilingual Support

**English Version** (`BodyFeedbackPage.tsx`):
- "Analyze Body Language" / "Re-analyze"
- "Service Online/Offline"
- "Analysis Started/Complete/Failed"

**Korean Version** (`BodyFeedbackPageKo.tsx`):
- "바디랭귀지 분석" / "재분석"
- "서비스 온라인/오프라인"
- "분석 시작/완료/실패"

### 6. Error Handling

- **Network Issues**: Graceful fallback to mock data
- **Invalid Response**: Error display with retry option
- **Service Unavailable**: Clear status indication
- **Missing Video**: User-friendly validation message

### 7. Performance Considerations

- **Timeout Management**: 5-second health check timeout
- **Loading States**: Proper UI feedback during analysis
- **Memory Management**: Cleanup of old analysis results
- **Background Processing**: Non-blocking API calls

## API Integration Flow

```
User Action → Service Health Check → Video Validation → API Call → Data Transformation → UI Update
```

## Usage Instructions

1. Navigate to any project's body feedback page
2. Check service status indicator (should be green for online)
3. Click "Analyze Body Language" button
4. Wait for analysis completion (several minutes)
5. Review updated metrics, timeline, and AI recommendations
6. Use "Re-analyze" for updated results if needed

## Testing

The implementation includes:
- Mock data fallback for offline testing
- Service health monitoring
- Error state handling
- Loading state management
- Bilingual support verification

## Future Enhancements

Potential improvements:
- Progress bar for long-running analysis
- Batch analysis for multiple videos
- Export analysis results
- Historical analysis comparison
- Real-time analysis streaming
