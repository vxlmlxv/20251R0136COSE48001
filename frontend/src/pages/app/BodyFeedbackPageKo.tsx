import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VideoPlayerWithThumbnails } from '@/components/ui/VideoPlayerWithThumbnails';
import { VideoThumbnailGenerator, Thumbnail } from '@/lib/thumbnail-generator';
import { mockProjects, mockBadgeScores, mockBehaviorEvents } from '@/lib/mock-data';
import { Project, Video, BadgeScore, BehaviorEvent, BodyLanguageAnalysisResponse } from '@/lib/types';
import { analyzeBodyLanguage, checkBodyLanguageServiceHealth } from '@/services/body-language-service';
import { toast } from '@/hooks/use-toast';
import { AlertTriangle, ArrowLeft, Eye, TrendingDown, User, Hand, ArrowRight, Zap, Target, Play, Loader2, RefreshCw, Download } from 'lucide-react';

const BodyFeedbackPageKo = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [video, setVideo] = useState<Video | null>(null);
  const [badgeScores, setBadgeScores] = useState<BadgeScore[]>([]);
  const [behaviorEvents, setBehaviorEvents] = useState<BehaviorEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  
  // Thumbnail generation state
  const thumbnailGeneratorRef = useRef<VideoThumbnailGenerator | null>(null);
  const [eventThumbnails, setEventThumbnails] = useState<Map<string, Thumbnail>>(new Map());
  const [isGeneratingThumbnails, setIsGeneratingThumbnails] = useState(false);
  
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

  // Korean feedback messages - single description per criteria
  const getBadgeFeedback = (badgeId: string, totalEvents: number) => {
    const feedbackMap: { [key: string]: string } = {
      'eye-contact': '시선 처리는 청중과의 연결을 만드는 중요한 요소입니다.',
      'body-stability': '안정적인 몸의 자세는 전문적이고 신뢰할 수 있는 인상을 줍니다.',
      'head-posture': '고개를 자주 기울이거나 움직이는 것보다는 일관되고 안정적인 자세를 유지하는 것이 좋습니다.',
      'self-touching': '발표 중 얼굴이나 머리를 만지는 행동은 긴장감이나 불안감을 나타낼 수 있습니다.',
      'facing-away': '돌아서거나 옆을 보는 것보다는 항상 청중 또는 카메라를 향해 정면을 유지하여 강한 연결감을 만들어보세요.'
    };
    
    return feedbackMap[badgeId] || '발표 기술 향상을 위한 피드백입니다.';
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

  // Korean badge name mapping
  const getBadgeName = (badgeId: string) => {
    const nameMap: { [key: string]: string } = {
      'eye-contact': '시선 처리',
      'body-stability': '몸 안정성',
      'head-posture': '고개 자세',
      'self-touching': '얼굴 혹은 머리 만지기',
      'facing-away': '뒤돌아서기'
    };
    return nameMap[badgeId] || badgeId;
  };

  // API Integration functions
  const checkServiceHealth = async () => {
    try {
      const isHealthy = await checkBodyLanguageServiceHealth();
      setServiceAvailable(isHealthy);
    } catch (error) {
      console.error('Health check failed:', error);
      setServiceAvailable(false);
    }
  };

  const performBodyLanguageAnalysis = async () => {
    if (!video) {
      toast({
        title: "분석 실패",
        description: "비디오를 찾을 수 없습니다.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const result = await analyzeBodyLanguage(video.url, projectId!);
      setAnalysisResult(result);
      
      if (result.results) {
        transformAnalysisToLocalData(result);
      }

      toast({
        title: "분석 완료",
        description: "바디 랭귀지 분석이 성공적으로 완료되었습니다.",
        variant: "default",
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      const errorMessage = error instanceof Error ? error.message : '바디 랭귀지 분석에 실패했습니다';
      setAnalysisError(errorMessage);
      
      toast({
        title: "분석 실패",
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
          end: event.timestamp + 2,
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
          end: event.timestamp + 3,
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
          end: event.timestamp + 1,
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
          end: event.timestamp + 1,
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
          end: event.timestamp + 2,
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
    checkServiceHealth();
    
    setTimeout(() => {
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
        
        const projectBadgeScores = mockBadgeScores.filter(bs => bs.projectId === projectId);
        setBadgeScores(projectBadgeScores);
        
        const projectBehaviorEvents = mockBehaviorEvents.filter(be => be.projectId === projectId);
        setBehaviorEvents(projectBehaviorEvents);
      }
      
      setIsLoading(false);
    }, 1000);
  }, [projectId]);

  // Initialize thumbnail generator and generate thumbnails for events
  useEffect(() => {
    thumbnailGeneratorRef.current = new VideoThumbnailGenerator();
    
    return () => {
      thumbnailGeneratorRef.current?.dispose();
    };
  }, []);

  // Generate thumbnails when video and behavior events are loaded
  useEffect(() => {
    const generateEventThumbnails = async () => {
      if (!video || !behaviorEvents.length || !thumbnailGeneratorRef.current) return;
      
      setIsGeneratingThumbnails(true);
      
      try {
        const eventThumbnailsMap = await thumbnailGeneratorRef.current.generateEventThumbnails(
          video.url,
          behaviorEvents.map(event => ({ id: event.id, timestamp: event.timestamp })),
          { width: 160, height: 90 }
        );
        setEventThumbnails(eventThumbnailsMap);
      } catch (error) {
        console.error('Failed to generate event thumbnails:', error);
      } finally {
        setIsGeneratingThumbnails(false);
      }
    };

    if (video && behaviorEvents.length > 0) {
      generateEventThumbnails();
    }
  }, [video, behaviorEvents]);

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
    setCurrentTime(time);
    setSelectedEventId(behaviorEvents.find(e => Math.abs(e.timestamp - time) < 1)?.id || null);
    
    // If we have access to the video ref from VideoPlayerWithThumbnails, use it
    if (videoRef) {
      videoRef.currentTime = time;
      videoRef.play();
    }
  };

  // Format time (mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Download individual thumbnail
  const downloadThumbnail = async (event: BehaviorEvent, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering jump to time
    
    const thumbnail = eventThumbnails.get(event.id);
    if (!thumbnail) {
      // Generate thumbnail if not available
      if (!thumbnailGeneratorRef.current || !video) return;
      
      try {
        const generatedThumbnail = await thumbnailGeneratorRef.current.generateThumbnail(
          video.url,
          event.timestamp,
          { width: 1920, height: 1080, quality: 0.9, format: 'png' }
        );
        
        const link = document.createElement('a');
        link.href = generatedThumbnail.dataUrl;
        link.download = `${event.category}-${Math.floor(event.timestamp)}s.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Failed to download thumbnail:', error);
      }
    } else {
      const link = document.createElement('a');
      link.href = thumbnail.dataUrl;
      link.download = `${event.category}-${Math.floor(event.timestamp)}s.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Export all key moments as ZIP
  const exportAllKeyMoments = async () => {
    if (!thumbnailGeneratorRef.current || !video || filteredEvents.length === 0) return;
    
    try {
      const JSZip = (await import('jszip')).default;
      const zipFile = new JSZip();
      
      for (const event of filteredEvents) {
        let thumbnail = eventThumbnails.get(event.id);
        
        // Generate thumbnail if not available
        if (!thumbnail) {
          thumbnail = await thumbnailGeneratorRef.current.generateThumbnail(
            video.url,
            event.timestamp,
            { width: 1920, height: 1080, quality: 0.9, format: 'png' }
          );
        }
        
        // Convert data URL to blob
        const response = await fetch(thumbnail.dataUrl);
        const blob = await response.blob();
        
        zipFile.file(`${event.category}-${Math.floor(event.timestamp)}s.png`, blob);
      }
      
      const zipBlob = await zipFile.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = `key-moments-thumbnails-${project?.title || 'project'}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Failed to export all key moments:', error);
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-48 bg-gray-200 rounded"></div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="h-24 bg-gray-200 rounded"></div>
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
        <h2 className="text-2xl font-semibold mb-2">프로젝트를 찾을 수 없습니다</h2>
        <p className="text-gray-600 mb-8">
          찾고 있는 프로젝트가 존재하지 않거나 삭제되었습니다.
        </p>
        <Link to="/app/dashboard">
          <Button>대시보드로 돌아가기</Button>
        </Link>
      </div>
    );
  }
  
  const filteredBadges = badgeScores;
  const filteredEvents = behaviorEvents;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <Link to={`/app/projects/${projectId}/overview`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              개요로 돌아가기
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">바디 랭귀지 피드백</h1>
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
              {serviceAvailable === true ? '서비스 온라인' :
               serviceAvailable === false ? '서비스 오프라인' : '확인 중...'}
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
                분석 중...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                {analysisResult ? '재분석' : '바디 랭귀지 분석'}
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

      {/* Status Cards */}
      {analysisError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-3" />
              <div>
                <h3 className="font-medium text-red-800">분석 오류</h3>
                <p className="text-sm text-red-600">{analysisError}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {analysisResult && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Zap className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <h3 className="font-medium text-green-800">분석 완료</h3>
                  <p className="text-sm text-green-600">
                    전체 점수: {analysisResult.results.overall_score}/100
                  </p>
                </div>
              </div>
              {analysisResult.results.recommendations.length > 0 && (
                <div className="text-right">
                  <p className="text-sm text-green-600">
                    AI 추천사항 {analysisResult.results.recommendations.length}개
                  </p>
                </div>
              )}
            </div>
            {analysisResult.results.recommendations.length > 0 && (
              <div className="mt-3 pt-3 border-t border-green-200">
                <h4 className="text-sm font-medium text-green-800 mb-2">AI 추천사항:</h4>
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Video Section - Now takes 3/5 of the space */}
        <div className="lg:col-span-3">
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
              onVideoRef={setVideoRef}
            />
          )}
        </div>

        {/* Performance Metrics - Now takes 2/5 of the space */}
        <div className="lg:col-span-2">
          <Card className="h-fit">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">성과 지표</CardTitle>
              <CardDescription>바디 랭귀지 종합 평가</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredBadges.map(badge => (
                  <div key={badge.badgeId} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center space-x-3">
                        {getBadgeIcon(badge.badgeId)}
                        <h3 className="font-medium">
                          {getBadgeName(badge.badgeId)}
                        </h3>
                      </div>
                      <div className="bg-gray-100 px-3 py-1 rounded-full">
                        <span className="text-sm font-medium text-gray-700">
                          {badge.totalEvents}회 감지
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
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">주요 순간</h2>

        </div>
        
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
          {filteredEvents.map(event => {
            const thumbnail = eventThumbnails.get(event.id);
            
            return (
              <div
                key={event.id}
                className={`group cursor-pointer transition-all duration-200 ${
                  selectedEventId === event.id ? 'opacity-100 ring-2 ring-mint' : 'opacity-75 hover:opacity-100'
                }`}
                onClick={() => { jumpToTime(event.start); setSelectedEventId(event.id); }}
              >
                <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border hover:border-mint/50 transition-colors">
                  {/* Video Thumbnail */}
                  {thumbnail ? (
                    <img
                      src={thumbnail.dataUrl}
                      alt={`${formatTime(event.start)}의 동영상 프레임`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : isGeneratingThumbnails ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-mint"></div>
                    </div>
                  ) : (
                    <img
                      src={`https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80&t=${event.start}`}
                      alt={`${formatTime(event.start)}의 동영상 프레임`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  )}
                  
                  {/* Play overlay */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <div className="flex space-x-2">
                      <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                        <Play className="w-4 h-4 text-black ml-0.5" />
                      </div>
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
            );
          })}
        </div>

        {filteredEvents.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">주요 순간이 없습니다</h3>
              <p className="text-gray-600">
                이 비디오에서는 개선이 필요한 바디 랭귀지 순간이 감지되지 않았습니다.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BodyFeedbackPageKo;
