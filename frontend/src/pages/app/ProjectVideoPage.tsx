import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VideoUpload } from '@/components/ui/VideoUpload';
import { ArrowLeft, Play, Loader2, RefreshCw, AlertTriangle, Star, Hand, Eye, Target, TrendingDown, User, ArrowRight } from 'lucide-react';
import { projectService, videoService, initializeTestData } from '@/services/data-service';
import { analyzeBodyLanguage, checkBodyLanguageServiceHealth } from '@/services/body-language-proxy';
import { Video, BodyLanguageAnalysisResponse, BadgeScore, BehaviorEvent } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import { mockBadgeScores, mockBehaviorEvents } from '@/lib/mock-data';

const ProjectVideoPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<BodyLanguageAnalysisResponse | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [serviceAvailable, setServiceAvailable] = useState<boolean | null>(null);
  const [badgeScores, setBadgeScores] = useState<BadgeScore[]>([]);
  const [behaviorEvents, setBehaviorEvents] = useState<BehaviorEvent[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  useEffect(() => {
    const initData = async () => {
      try {
        await initializeTestData();
        await loadProjectVideos();
        await checkServiceHealth();
      } catch (error) {
        console.error('Failed to initialize data:', error);
        toast({
          title: "Initialization Error",
          description: "Failed to initialize project data.",
          variant: "destructive",
        });
      }
    };

    const loadProjectVideos = async () => {
      if (!projectId) return;
      
      try {
        setIsLoading(true);
        const projectVideos = await projectService.getProjectVideos(projectId);
        setVideos(projectVideos);
        
        if (projectVideos.length > 0) {
          setSelectedVideo(projectVideos[0]);
        }
      } catch (error) {
        console.error('Failed to load videos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const checkServiceHealth = async () => {
      try {
        const isHealthy = await checkBodyLanguageServiceHealth();
        setServiceAvailable(isHealthy);
      } catch (error) {
        console.error('Service health check failed:', error);
        setServiceAvailable(false);
      }
    };

    initData();
  }, [projectId]);

  const handleUploadSuccess = async (uploadedVideo: {
    id: number;
    projectId: string;
    storageUrl: string;
    duration: number;
    width: number;
    height: number;
  }) => {
    // Convert uploaded video to our Video type
    const newVideo: Video = {
      id: uploadedVideo.id.toString(),
      projectId: uploadedVideo.projectId,
      url: uploadedVideo.storageUrl,
      duration: uploadedVideo.duration,
      resolution: {
        width: uploadedVideo.width || 1280,
        height: uploadedVideo.height || 720,
      },
    };

    setVideos(prev => [...prev, newVideo]);
    setSelectedVideo(newVideo);
    
    toast({
      title: "Video Ready",
      description: "Your video is now ready for body language analysis.",
    });
  };

  const performBodyLanguageAnalysis = async () => {
    if (!selectedVideo) {
      toast({
        title: "No Video Selected",
        description: "Please select or upload a video for analysis.",
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

      const result = await analyzeBodyLanguage(selectedVideo.url, projectId!);
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
        stars: Math.min(5, Math.max(1, Math.round(result.results.eye_contact_analysis.eye_contact_score / 20))) as 1 | 2 | 3 | 4 | 5,
        totalEvents: result.results.eye_contact_analysis.eye_contact_events?.length || 0,
      });
    }

    if (result.results.body_stability_analysis) {
      newBadgeScores.push({
        badgeId: 'body-stability',
        projectId: projectId!,
        stars: Math.min(5, Math.max(1, Math.round(result.results.body_stability_analysis.body_stability_score / 20))) as 1 | 2 | 3 | 4 | 5,
        totalEvents: result.results.body_stability_analysis.body_stability_events?.length || 0,
      });
    }

    if (result.results.head_posture_analysis) {
      newBadgeScores.push({
        badgeId: 'head-posture',
        projectId: projectId!,
        stars: Math.min(5, Math.max(1, Math.round(result.results.head_posture_analysis.head_posture_score / 20))) as 1 | 2 | 3 | 4 | 5,
        totalEvents: result.results.head_posture_analysis.head_posture_events?.length || 0,
      });
    }

    if (result.results.self_touching_analysis) {
      newBadgeScores.push({
        badgeId: 'self-touching',
        projectId: projectId!,
        stars: Math.min(5, Math.max(1, Math.round(result.results.self_touching_analysis.self_touching_score / 20))) as 1 | 2 | 3 | 4 | 5,
        totalEvents: result.results.self_touching_analysis.self_touching_events?.length || 0,
      });
    }

    if (result.results.facing_away_analysis) {
      newBadgeScores.push({
        badgeId: 'facing-away',
        projectId: projectId!,
        stars: Math.min(5, Math.max(1, Math.round(result.results.facing_away_analysis.facing_away_score / 20))) as 1 | 2 | 3 | 4 | 5,
        totalEvents: result.results.facing_away_analysis.facing_away_events?.length || 0,
      });
    }

    // Use mock data as fallback for demo
    setBadgeScores(newBadgeScores.length > 0 ? newBadgeScores : mockBadgeScores);
    setBehaviorEvents(newBehaviorEvents.length > 0 ? newBehaviorEvents : mockBehaviorEvents);
  };

  // Helper functions for badge display
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

  const getBadgeFeedback = (badgeId: string, stars: number) => {
    const feedbackMap: { [key: string]: { [key: number]: string } } = {
      'eye-contact': {
        1: 'Practice making more eye contact with your audience.',
        2: 'Your eye contact is developing. Try to engage more with viewers.',
        3: 'Good eye contact! You connect well with your audience.',
        4: 'Excellent eye contact. You maintain strong audience engagement.',
        5: 'Perfect eye contact! You create strong connection with viewers.',
      },
      'body-stability': {
        1: 'Focus on maintaining stable body positioning throughout your presentation.',
        2: 'Your body stability shows improvement but needs more consistency.',
        3: 'Good body stability! You appear confident and grounded.',
        4: 'Excellent body control. You project strong, stable presence.',
        5: 'Perfect body stability! You command attention with your poised stance.',
      },
      'head-posture': {
        1: 'Work on maintaining natural and consistent head positioning.',
        2: 'Your head posture needs attention for better professional appearance.',
        3: 'Good head posture! You appear engaged and attentive.',
        4: 'Excellent head positioning. You project confidence and focus.',
        5: 'Perfect head posture! Your positioning enhances your professional presence.',
      },
      'self-touching': {
        1: 'Try to minimize face and head touching behaviors during presentation.',
        2: 'Occasional self-touching detected. Work on maintaining composed gestures.',
        3: 'Good self-control! Minimal distracting behaviors observed.',
        4: 'Excellent gesture control. You maintain professional composure.',
        5: 'Perfect self-control! No distracting behaviors detected.',
      },
      'facing-away': {
        1: 'Maintain consistent audience engagement by facing forward more often.',
        2: 'Your audience engagement shows improvement but needs more consistency.',
        3: 'Good audience facing! You maintain reasonable connection with viewers.',
        4: 'Excellent audience engagement. You consistently face your audience.',
        5: 'Perfect audience connection! You maintain strong visual engagement throughout.',
      },
    };

    return feedbackMap[badgeId]?.[stars] || 'Keep practicing to improve this skill.';
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/app/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Body Language Analysis</h1>
          <p className="text-gray-600">Project ID: {projectId}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - Video Upload & Player */}
        <div className="space-y-6">
          {/* Video Upload */}
          {!selectedVideo && (
            <VideoUpload 
              projectId={projectId!} 
              onUploadSuccess={handleUploadSuccess}
            />
          )}

          {/* Video Player */}
          {selectedVideo && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Video Player
                </CardTitle>
                <CardDescription>
                  Current video ready for analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <video
                  ref={setVideoRef}
                  src={selectedVideo.url}
                  controls
                  className="w-full rounded-lg"
                  onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                >
                  Your browser does not support the video tag.
                </video>
                
                <div className="mt-4 flex gap-2">
                  <Button 
                    onClick={performBodyLanguageAnalysis}
                    disabled={isAnalyzing || !serviceAvailable}
                    className="flex-1"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        {analysisResult ? 'Re-analyze' : 'Analyze Body Language'}
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => setSelectedVideo(null)}
                  >
                    Upload New Video
                  </Button>
                </div>

                {/* Service Status */}
                <div className="mt-4">
                  <div className={`text-sm flex items-center gap-2 ${
                    serviceAvailable === null ? 'text-gray-500' : 
                    serviceAvailable ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      serviceAvailable === null ? 'bg-gray-400' :
                      serviceAvailable ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    Body Language Service: {
                      serviceAvailable === null ? 'Checking...' :
                      serviceAvailable ? 'Available' : 'Unavailable'
                    }
                  </div>
                </div>

                {/* Analysis Error */}
                {analysisError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-800">Analysis Failed</p>
                        <p className="text-xs text-red-600 mt-1">{analysisError}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Analysis Results */}
        <div className="space-y-6">
          {/* Badge Scores */}
          {badgeScores.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Performance Badges</CardTitle>
                <CardDescription>
                  Your body language skills assessment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {badgeScores.map((badge) => (
                  <div key={badge.badgeId} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {getBadgeIcon(badge.badgeId)}
                        <span className="font-medium capitalize">
                          {badge.badgeId.replace('-', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= badge.stars 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {getBadgeFeedback(badge.badgeId, badge.stars)}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Video List */}
          {videos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Project Videos</CardTitle>
                <CardDescription>
                  All videos uploaded to this project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {videos.map((video) => (
                    <div 
                      key={video.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedVideo?.id === video.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedVideo(video)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Video {video.id}</p>
                          <p className="text-sm text-gray-600">
                            {video.duration}s • {video.resolution.width}x{video.resolution.height}
                          </p>
                        </div>
                        {selectedVideo?.id === video.id && (
                          <Badge variant="default">Current</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectVideoPage;
