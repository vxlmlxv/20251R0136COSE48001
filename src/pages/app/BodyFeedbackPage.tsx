
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockProjects, mockVideos, mockBadgeScores, mockBehaviorEvents } from '@/lib/mock-data';
import { Project, Video, BadgeScore, BehaviorEvent } from '@/lib/types';
import { AlertTriangle, Star, ArrowLeft } from 'lucide-react';

const BodyFeedbackPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [video, setVideo] = useState<Video | null>(null);
  const [badgeScores, setBadgeScores] = useState<BadgeScore[]>([]);
  const [behaviorEvents, setBehaviorEvents] = useState<BehaviorEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<'gestures' | 'facial'>('gestures');
  const [currentTime, setCurrentTime] = useState(0);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);

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

  // Filter badges and events based on current tab
  const filteredBadges = badgeScores.filter(badge => {
    // This is just a mock implementation - in a real app you'd have a proper category system
    if (currentTab === 'gestures') {
      return ['hand-gestures', 'posture-alignment'].includes(badge.badgeId);
    } else {
      return ['smile-consistency', 'eye-contact'].includes(badge.badgeId);
    }
  });

  const filteredEvents = behaviorEvents.filter(event => {
    return currentTab === 'gestures' 
      ? event.type === 'gesture' || event.type === 'posture'
      : event.type === 'facial';
  });

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
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Link to={`/app/projects/${projectId}/overview`}>
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Overview
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Body Language Feedback</h1>
        </div>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="gestures" onValueChange={(value) => setCurrentTab(value as 'gestures' | 'facial')}>
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="gestures">Gestures & Posture</TabsTrigger>
          <TabsTrigger value="facial">Facial Expressions</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          {/* Video Player and Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Video Player */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-4">
                  <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                    {video ? (
                      <video 
                        ref={ref => setVideoRef(ref)}
                        src={video.url} 
                        controls 
                        className="w-full h-full object-contain"
                        poster="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                        onTimeUpdate={e => setCurrentTime(e.currentTarget.currentTime)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <p className="text-gray-500">No video available</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Badges Summary */}
            <div>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Performance Metrics</CardTitle>
                  <CardDescription>
                    {currentTab === 'gestures' 
                      ? 'Your gesture and posture evaluation'
                      : 'Your facial expression evaluation'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredBadges.length > 0 ? (
                      filteredBadges.map(badge => (
                        <div key={badge.badgeId} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium">
                              {badge.badgeId.split('-').map(word => 
                                word.charAt(0).toUpperCase() + word.slice(1)
                              ).join(' ')}
                            </h3>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map(star => (
                                <Star 
                                  key={star}
                                  size={16}
                                  className={star <= badge.stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">
                            {badge.stars >= 4 
                              ? 'Excellent performance in this area.'
                              : badge.stars >= 3
                              ? 'Good performance with some room for improvement.'
                              : badge.stars >= 2
                              ? 'Average performance. Consider working on this area.'
                              : 'This area needs significant improvement.'}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No metrics available for this category</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Event Timeline */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Key Moments</CardTitle>
              <CardDescription>
                Click on any moment to jump to that point in the video
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredEvents.length > 0 ? (
                <div className="space-y-4">
                  {/* Visual Timeline */}
                  <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden">
                    {video && (
                      <>
                        {/* Current time indicator */}
                        <div 
                          className="absolute top-0 h-full bg-mint/20"
                          style={{ width: `${(currentTime / video.duration) * 100}%` }}
                        ></div>
                        
                        {/* Event markers */}
                        {filteredEvents.map(event => (
                          <div 
                            key={event.id}
                            className={`absolute top-0 h-full ${
                              event.severity === 'high' ? 'bg-red-500' : 
                              event.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                            } cursor-pointer`}
                            style={{ 
                              left: `${(event.start / video.duration) * 100}%`,
                              width: `${((event.end - event.start) / video.duration) * 100}%`,
                              opacity: 0.6
                            }}
                            onClick={() => jumpToTime(event.start)}
                            title={`${event.category} (${formatTime(event.start)} - ${formatTime(event.end)})`}
                          ></div>
                        ))}
                      </>
                    )}
                  </div>
                  
                  {/* Event List */}
                  <div className="space-y-2 mt-4">
                    {filteredEvents.map(event => (
                      <div 
                        key={event.id}
                        className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => jumpToTime(event.start)}
                      >
                        <Badge
                          className={`mr-3 ${
                            event.severity === 'high' ? 'bg-red-100 text-red-800' : 
                            event.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {event.severity.charAt(0).toUpperCase() + event.severity.slice(1)}
                        </Badge>
                        <div className="flex-1">
                          <p className="font-medium">{event.category.split('-').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}</p>
                          <p className="text-sm text-gray-500">
                            {formatTime(event.start)} - {formatTime(event.end)}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          Watch
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No key moments detected in this category</p>
              )}
            </CardContent>
          </Card>
        </div>
      </Tabs>
    </div>
  );
};

export default BodyFeedbackPage;
