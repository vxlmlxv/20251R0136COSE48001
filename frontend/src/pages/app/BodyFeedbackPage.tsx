import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// Removed Tabs imports for unified view
import { mockProjects, mockVideos, mockBadgeScores, mockBehaviorEvents } from '@/lib/mock-data';
import { Project, Video, BadgeScore, BehaviorEvent } from '@/lib/types';
import { AlertTriangle, Star, ArrowLeft, Hand, Smile, Eye, Users, Zap, Target, Play } from 'lucide-react';

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

  // Helper function to get badge icon
  const getBadgeIcon = (badgeId: string) => {
    switch (badgeId) {
      case 'hand-gestures':
        return <Hand className="h-5 w-5 text-blue-600" />;
      case 'posture-alignment':
        return <Users className="h-5 w-5 text-green-600" />;
      case 'smile-consistency':
        return <Smile className="h-5 w-5 text-yellow-600" />;
      case 'eye-contact':
        return <Eye className="h-5 w-5 text-purple-600" />;
      default:
        return <Target className="h-5 w-5 text-gray-600" />;
    }
  };

  // Helper function to get feedback text for badges
  const getBadgeFeedback = (badgeId: string, stars: number) => {
    const feedbackMap: { [key: string]: { [key: number]: string } } = {
      'hand-gestures': {
        1: 'Hand movements appear stiff and unnatural.',
        2: 'Some gestures lack coordination and fluidity.',
        3: 'Decent hand gestures with room for improvement.',
        4: 'Natural and expressive hand movements.',
        5: 'Excellent, purposeful gestures that enhance communication.'
      },
      'posture-alignment': {
        1: 'Poor posture affecting overall presence.',
        2: 'Posture needs significant improvement for better impact.',
        3: 'Adequate posture with minor adjustments needed.',
        4: 'Good posture that projects confidence.',
        5: 'Perfect posture demonstrating strong presence.'
      },
      'smile-consistency': {
        1: 'Facial expressions appear forced or inconsistent.',
        2: 'Smiles need to be more natural and frequent.',
        3: 'Generally positive expressions with some variation.',
        4: 'Warm and genuine facial expressions throughout.',
        5: 'Exceptional facial expressiveness that engages viewers.'
      },
      'eye-contact': {
        1: 'Limited eye contact reducing connection with audience.',
        2: 'Eye contact could be more consistent and engaging.',
        3: 'Reasonable eye contact with room for improvement.',
        4: 'Strong eye contact that builds good rapport.',
        5: 'Outstanding eye contact creating powerful connections.'
      }
    };
    
    return feedbackMap[badgeId]?.[stars] || 'Performance assessment available.';
  };
  const getEventIcon = (type: string, category: string) => {
    if (type === 'gesture') {
      return <Hand className="h-4 w-4 text-white" />;
    } else if (type === 'posture') {
      return <Users className="h-4 w-4 text-white" />;
    } else if (type === 'facial') {
      if (category.includes('smile')) {
        return <Smile className="h-4 w-4 text-white" />;
      } else if (category.includes('eye')) {
        return <Eye className="h-4 w-4 text-white" />;
      }
      return <Smile className="h-4 w-4 text-white" />;
    }
    return <Zap className="h-4 w-4 text-white" />;
  };

  useEffect(() => {
    // Simulate loading data from API
    setTimeout(() => {
      // Find project by ID
      const foundProject = mockProjects.find(p => p.id === projectId);
      if (foundProject) {
        setProject(foundProject);
        
        // Find video for this project
        const foundVideo = mockVideos.find(v => v.projectId === projectId);
        if (foundVideo) {
          setVideo(foundVideo);
        }
        
        // Get badge scores for this project
        const projectBadgeScores = mockBadgeScores.filter(bs => bs.projectId === projectId);
        setBadgeScores(projectBadgeScores);
        
        // Get behavior events for this project
        const projectEvents = mockBehaviorEvents.filter(be => be.projectId === projectId);
        setBehaviorEvents(projectEvents);
      }
      
      setIsLoading(false);
    }, 800);
  }, [projectId]);

  // Helper: get color for an event based on its type/category
  const getEventMetricColor = (event: BehaviorEvent) => {
    if (event.type === 'gesture') return '#2563EB'; // blue-600
    if (event.type === 'posture') return '#16A34A'; // green-600
    if (event.type === 'facial') {
      if (event.category.includes('smile')) return '#CA8A04'; // yellow-600
      if (event.category.includes('eye')) return '#7C3AED'; // purple-600
    }
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
      <div className="flex items-center space-x-6">
        <Link to={`/app/projects/${projectId}/overview`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Overview
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Body Language Feedback</h1>
      </div>
      {/* Main content: video + metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Video Player + Timeline */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-4 relative">
              <div className="aspect-video bg-gray-100 rounded-md overflow-hidden relative">
                {video ? (
                  <>
                    <video
                      ref={ref => setVideoRef(ref)}
                      src={video.url}
                      controls
                      className="w-full h-full object-contain"
                      poster="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                      onTimeUpdate={e => setCurrentTime(e.currentTarget.currentTime)}
                    />
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-gray-500">No video available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
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
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            size={16}
                            className={
                              star <= badge.stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {getBadgeFeedback(badge.badgeId, badge.stars)}
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
