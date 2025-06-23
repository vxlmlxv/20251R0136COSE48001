import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VideoPlayerWithThumbnails } from '@/components/ui/VideoPlayerWithThumbnails';
// Removed Tabs imports for unified view
import { mockProjects, mockBadgeScores, mockBehaviorEvents } from '@/lib/mock-data';
import { Project, Video, BadgeScore, BehaviorEvent, BodyLanguageAnalysisResponse } from '@/lib/types';
import { analyzeBodyLanguage, checkBodyLanguageServiceHealth } from '@/services/body-language-service';
import { toast } from '@/hooks/use-toast';
import { AlertTriangle, ArrowLeft, Eye, TrendingDown, User, Hand, ArrowRight, Zap, Target, Play, Loader2, RefreshCw } from 'lucide-react';

const BodyFeedbackPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [video, setVideo] = useState<Video | null>(null);
  const [badgeScores, setBadgeScores] = useState<BadgeScore[]>([]);
  const [behaviorEvents, setBehaviorEvents] = useState<BehaviorEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Selected event for thumbnail dimming
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  
  // API Integration state
  const [analysisResult, setAnalysisResult] = useState<BodyLanguageAnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [serviceAvailable, setServiceAvailable] = useState<boolean | null>(null);

  // Helper function to get badge icon
  const getBadgeIcon = (badgeId: string) => {
    switch (badgeId) {
      case 'eye-contact':
        return <Eye className="h-5 w-5 text-blue-600" />;
      case 'body-stability':
        return <TrendingDown className="h-5 w-5 text-green-600" />;
      case 'head-posture':
        return <User className="h-5 w-5 text-yellow-600" />;
      case 'self-touching':
        return <Hand className="h-5 w-5 text-purple-600" />;
      case 'facing-away':
        return <ArrowRight className="h-5 w-5 text-red-600" />;
      default:
        return <Target className="h-5 w-5 text-gray-600" />;
    }
  };

  // Helper function to get feedback text for badges - single description per criteria
  const getBadgeFeedback = (badgeId: string, totalEvents: number) => {
    const feedbackMap: { [key: string]: string } = {
      'eye-contact': 'Eye contact is crucial for building connection with your audience. Maintain direct eye contact with the camera or audience to project confidence. Looking down or away frequently can indicate nervousness or lack of confidence.',
      'body-stability': 'Stable body posture projects professionalism and trustworthiness. Excessive swaying or movement can reveal nervousness, so focus on maintaining calm and controlled posture throughout your presentation.',
      'head-posture': 'Natural head positioning demonstrates your professionalism as a presenter. Rather than frequent tilting or unnatural movements, maintain consistent and stable head posture for better impact.',
      'self-touching': 'Touching your face or head during presentations can indicate nervousness or anxiety. Practice conscious control of hand movements and use natural gestures to project more confidence.',
      'facing-away': 'Facing your audience is fundamental to communication and connection. Instead of turning away or looking sideways, always maintain a forward-facing position toward your audience or camera to create strong engagement.'
    };
    
    return feedbackMap[badgeId] || 'Feedback available for presentation skill improvement.';
  };
  const getEventIcon = (type: string, category: string) => {
    if (type === 'eye-contact') {
      return <Eye className="h-4 w-4 text-white" />;
    } else if (type === 'body-stability') {
      return <TrendingDown className="h-4 w-4 text-white" />;
    } else if (type === 'head-posture') {
      return <User className="h-4 w-4 text-white" />;
    } else if (type === 'self-touching') {
      return <Hand className="h-4 w-4 text-white" />;
    } else if (type === 'facing-away') {
      return <ArrowRight className="h-4 w-4 text-white" />;
    }
    return <Zap className="h-4 w-4 text-white" />;
  };

  // API Integration functions
  const checkServiceHealth = async () => {
    try {
      const isAvailable = await checkBodyLanguageServiceHealth();
      setServiceAvailable(isAvailable);
      if (!isAvailable) {
        toast({
          title: "Service Unavailable",
          description: "Body language analysis service is currently unavailable. Using mock data.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Health check failed:', error);
      setServiceAvailable(false);
    }
  };

  const performBodyLanguageAnalysis = async () => {
    if (!video) {
      toast({
        title: "No Video Found",
        description: "Please ensure a video is uploaded for this project.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      toast({
        title: "Analysis Started",
        description: "Body language analysis is in progress. This may take 3-5 minutes for video processing.",
      });

      const result = await analyzeBodyLanguage(video.url, projectId!);
      setAnalysisResult(result);
      
      // Transform API response to our local state format
      if (result.results) {
        transformAnalysisToLocalData(result);
      }

      toast({
        title: "Analysis Complete",
        description: "Body language analysis has been completed successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze body language';
      setAnalysisError(errorMessage);
      
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Transform API response to local badge scores and behavior events
  const transformAnalysisToLocalData = (result: BodyLanguageAnalysisResponse) => {
    const newBadgeScores: BadgeScore[] = [];
    const newBehaviorEvents: BehaviorEvent[] = [];

    if (result.results.eye_contact_analysis) {
      newBadgeScores.push({
        badgeId: 'eye-contact',
        projectId: projectId!,
        stars: Math.round(result.results.eye_contact_analysis.eye_contact_score / 20) as 1 | 2 | 3 | 4 | 5,
        totalEvents: result.results.eye_contact_analysis.eye_contact_events.length,
      });

      result.results.eye_contact_analysis.eye_contact_events.forEach((event, index) => {
        newBehaviorEvents.push({
          id: `eye-contact-${index}`,
          projectId: projectId!,
          timestamp: event.timestamp,
          start: event.timestamp,
          end: event.timestamp + 2, // Assume 2-second duration
          type: 'eye-contact',
          category: event.type,
          confidence: event.confidence,
          description: event.description,
          severity: event.confidence > 0.8 ? 'high' : event.confidence > 0.5 ? 'medium' : 'low',
        });
      });
    }

    if (result.results.body_stability_analysis) {
      newBadgeScores.push({
        badgeId: 'body-stability',
        projectId: projectId!,
        stars: Math.round(result.results.body_stability_analysis.body_stability_score / 20) as 1 | 2 | 3 | 4 | 5,
        totalEvents: result.results.body_stability_analysis.body_stability_events.length,
      });

      result.results.body_stability_analysis.body_stability_events.forEach((event, index) => {
        newBehaviorEvents.push({
          id: `body-stability-${index}`,
          projectId: projectId!,
          timestamp: event.timestamp,
          start: event.timestamp,
          end: event.timestamp + 3, // Assume 3-second duration
          type: 'body-stability',
          category: event.stability_type,
          confidence: event.confidence,
          description: event.description,
          severity: event.confidence > 0.8 ? 'high' : event.confidence > 0.5 ? 'medium' : 'low',
        });
      });
    }

    if (result.results.head_posture_analysis) {
      newBadgeScores.push({
        badgeId: 'head-posture',
        projectId: projectId!,
        stars: Math.round(result.results.head_posture_analysis.head_posture_score / 20) as 1 | 2 | 3 | 4 | 5,
        totalEvents: result.results.head_posture_analysis.head_posture_events.length,
      });

      result.results.head_posture_analysis.head_posture_events.forEach((event, index) => {
        newBehaviorEvents.push({
          id: `head-posture-${index}`,
          projectId: projectId!,
          timestamp: event.timestamp,
          start: event.timestamp,
          end: event.timestamp + 1, // Assume 1-second duration
          type: 'head-posture',
          category: event.posture_type,
          confidence: event.confidence,
          description: event.description,
          severity: event.confidence > 0.8 ? 'high' : event.confidence > 0.5 ? 'medium' : 'low',
        });
      });
    }

    if (result.results.self_touching_analysis) {
      newBadgeScores.push({
        badgeId: 'self-touching',
        projectId: projectId!,
        stars: Math.round(result.results.self_touching_analysis.self_touching_score / 20) as 1 | 2 | 3 | 4 | 5,
        totalEvents: result.results.self_touching_analysis.self_touching_events.length,
      });

      result.results.self_touching_analysis.self_touching_events.forEach((event, index) => {
        newBehaviorEvents.push({
          id: `self-touching-${index}`,
          projectId: projectId!,
          timestamp: event.timestamp,
          start: event.timestamp,
          end: event.timestamp + 1, // Assume 1-second duration
          type: 'self-touching',
          category: event.touching_type,
          confidence: event.confidence,
          description: event.description,
          severity: event.confidence > 0.8 ? 'high' : event.confidence > 0.5 ? 'medium' : 'low',
        });
      });
    }

    if (result.results.facing_away_analysis) {
      newBadgeScores.push({
        badgeId: 'facing-away',
        projectId: projectId!,
        stars: Math.round(result.results.facing_away_analysis.facing_away_score / 20) as 1 | 2 | 3 | 4 | 5,
        totalEvents: result.results.facing_away_analysis.facing_away_events.length,
      });

      result.results.facing_away_analysis.facing_away_events.forEach((event, index) => {
        newBehaviorEvents.push({
          id: `facing-away-${index}`,
          projectId: projectId!,
          timestamp: event.timestamp,
          start: event.timestamp,
          end: event.timestamp + 2, // Assume 2-second duration
          type: 'facing-away',
          category: event.facing_type,
          confidence: event.confidence,
          description: event.description,
          severity: event.confidence > 0.8 ? 'high' : event.confidence > 0.5 ? 'medium' : 'low',
        });
      });
    }

    setBadgeScores(newBadgeScores);
    setBehaviorEvents(newBehaviorEvents);
  };

  useEffect(() => {
    // Check service health first
    checkServiceHealth();
    
    // Simulate loading data from API
    setTimeout(() => {
      // Find project by ID
      const foundProject = mockProjects.find(p => p.id === projectId);
      if (foundProject) {
        setProject(foundProject);
        
        // Use demo.mp4 for all projects
        const demoVideo: Video = {
          id: `${projectId}-demo`,
          projectId: projectId!,
          url: '/demo-videos/demo.mp4',
          duration: 596, // Demo video duration in seconds
          resolution: {
            width: 1280,
            height: 720,
          },
        };
        setVideo(demoVideo);
        
        // Get badge scores for this project (initially from mock data)
        const projectBadgeScores = mockBadgeScores.filter(bs => bs.projectId === projectId);
        setBadgeScores(projectBadgeScores);
        
        // Get behavior events for this project (initially from mock data)
        const projectEvents = mockBehaviorEvents.filter(be => be.projectId === projectId);
        setBehaviorEvents(projectEvents);
      }
      
      setIsLoading(false);
    }, 800);
  }, [projectId]);

  // Helper: get color for an event based on its type/category
  const getEventMetricColor = (event: BehaviorEvent) => {
    if (event.type === 'eye-contact') return '#2563EB'; // blue-600
    if (event.type === 'body-stability') return '#16A34A'; // green-600
    if (event.type === 'head-posture') return '#CA8A04'; // yellow-600
    if (event.type === 'self-touching') return '#7C3AED'; // purple-600
    if (event.type === 'facing-away') return '#DC2626'; // red-600
    return '#64748B'; // gray-500
  };

  // Jump to specific time in video
  const jumpToTime = (time: number) => {
    if (videoRef) {
      videoRef.currentTime = time;
      videoRef.play();
    }
    setCurrentTime(time);
  };

  // Format time (mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-48 bg-gray-200 rounded"></div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Render error state if project not found
  if (!project) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Project Not Found</h2>
        <p className="text-gray-600 mb-8">
          The project you are looking for does not exist or has been removed.
        </p>
        <Link to="/app/dashboard">
          <Button>Return to Dashboard</Button>
        </Link>
      </div>
    );
  }
  
  // Show all metrics and key moments in unified view
  const filteredBadges = badgeScores;
  const filteredEvents = behaviorEvents;
  return (
    <div className="space-y-6">
      {/* Unified Body Language Feedback */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <Link to={`/app/projects/${projectId}/overview`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Overview
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Body Language Feedback</h1>
        </div>
        
        {/* Analysis Controls */}
        <div className="flex items-center space-x-4">
          {/* Service Status Indicator */}
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              serviceAvailable === true ? 'bg-green-500' :
              serviceAvailable === false ? 'bg-red-500' : 'bg-yellow-500'
            }`} />
            <span className="text-sm text-gray-600">
              {serviceAvailable === true ? 'Service Online' :
               serviceAvailable === false ? 'Service Offline' : 'Checking...'}
            </span>
          </div>
          
          {/* Analysis Button */}
          <Button
            onClick={performBodyLanguageAnalysis}
            disabled={isAnalyzing || !video || serviceAvailable === false}
            className="bg-mint hover:bg-mint/90"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                {analysisResult ? 'Re-analyze' : 'Analyze Body Language'}
              </>
            )}
          </Button>
          
          {/* Refresh Service Status */}
          <Button
            variant="outline"
            size="sm"
            onClick={checkServiceHealth}
            disabled={isAnalyzing}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Analysis Status */}
      {analysisError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <p className="text-red-700">{analysisError}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {analysisResult && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-green-600" />
              <p className="text-green-700">
                Analysis completed! Overall score: {Math.round(analysisResult.results.overall_score)}%
              </p>
            </div>
            {analysisResult.results.recommendations && analysisResult.results.recommendations.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium text-green-800 mb-2">AI Recommendations:</p>
                <ul className="text-sm text-green-700 space-y-1">
                  {analysisResult.results.recommendations.map((rec, index) => (
                    <li key={index}>• {rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      {/* Main content: video + metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Video Player + Timeline */}
        <div className="lg:col-span-2">
          {video && (
            <VideoPlayerWithThumbnails
              src={video.url}
              keyMoments={behaviorEvents.map(event => ({
                id: event.id,
                timestamp: event.timestamp,
                title: event.category,
                type: event.type
              }))}
              autoGenerateThumbnails={true}
              thumbnailCount={15}
              onTimeUpdate={setCurrentTime}
            />
          )}
        </div>
        {/* Performance Metrics */}
        <div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Performance Metrics</CardTitle>
              <CardDescription>Overall gesture, posture & facial evaluation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredBadges.map(badge => (
                  <div key={badge.badgeId} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center space-x-3">
                        {getBadgeIcon(badge.badgeId)}
                        <h3 className="font-medium">
                          {badge.badgeId
                            .split('-')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ')}
                        </h3>
                      </div>
                      <div className="bg-gray-100 px-3 py-1 rounded-full">
                        <span className="text-sm font-medium text-gray-700">
                          {badge.totalEvents} times detected
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {getBadgeFeedback(badge.badgeId, badge.totalEvents)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Key Moments Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Key Moments</h2>
        
        {/* Key Moments Timeline Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="relative h-12 bg-gray-100 rounded-lg overflow-hidden">
              {/* Timeline background */}
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-4 bg-gray-200 rounded-full"></div>
              </div>
              
              {/* Playhead indicator */}
              {video && (
                <div
                  className="absolute top-0 h-full w-0.5 bg-mint z-20"
                  style={{ left: `${(currentTime / video.duration) * 100}%` }}
                />
              )}
              
              {/* Event markers on timeline */}
              {video && filteredEvents.map(event => (
                <div
                  key={event.id}
                  className="absolute top-1/2 transform -translate-y-1/2 h-8 cursor-pointer rounded-md flex items-center justify-center transition-all duration-200 hover:h-10 z-10"
                  style={{
                    left: `${(event.start / video.duration) * 100}%`,
                    width: `${Math.max(((event.end - event.start) / video.duration) * 100, 2)}%`,
                    backgroundColor: getEventMetricColor(event),
                    opacity: selectedEventId && selectedEventId !== event.id ? 0.6 : 1
                  }}
                  onClick={() => { jumpToTime(event.start); setSelectedEventId(event.id); }}
                  title={`${event.category} (${formatTime(event.start)} - ${formatTime(event.end)})`}
                >
                  {getEventIcon(event.type, event.category)}
                </div>
              ))}
              
              {/* Time labels */}
              {video && (
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 px-1">
                  <span>0:00</span>
                  <span>{formatTime(video.duration)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Video Thumbnails Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {filteredEvents.map(event => (
          <div
            key={event.id}
            className={`group cursor-pointer transition-all duration-200 ${
              selectedEventId === event.id ? 'opacity-100' : 'opacity-75 hover:opacity-100'
            }`}
            onClick={() => { jumpToTime(event.start); setSelectedEventId(event.id); }}
          >
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border hover:border-mint/50 transition-colors transform scale-90">
              {/* Video Thumbnail */}
              <img
                src={`https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80&t=${event.start}`}
                alt={`Video frame at ${formatTime(event.start)}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
              {/* Play overlay */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                  <Play className="w-4 h-4 text-black ml-0.5" />
                </div>
              </div>
              {/* Event type icon with metric color */}
              <div className="absolute top-2 left-2 rounded-full p-1.5" style={{ backgroundColor: getEventMetricColor(event) }}>
                {getEventIcon(event.type, event.category)}
              </div>
              {/* Timestamp */}
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {formatTime(event.start)}
              </div>
            </div>
            {/* Thumbnail info */}
            <div className="mt-2">
              <p className="font-medium text-xs truncate">
                {`${event.category} (${formatTime(event.start)})`}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      </div>
    </div>
  );
};

export default BodyFeedbackPage;
