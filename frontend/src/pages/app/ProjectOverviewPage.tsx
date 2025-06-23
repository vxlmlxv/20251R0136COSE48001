
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { mockProjects, mockBadgeScores } from '@/lib/mock-data';
import { Project, Video, BadgeScore } from '@/lib/types';
import { Clock, Video as VideoIcon, AlertTriangle, CheckCircle, PlayCircle, Mic2 } from 'lucide-react';

const ProjectOverviewPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [video, setVideo] = useState<Video | null>(null);
  const [badgeScores, setBadgeScores] = useState<BadgeScore[]>([]);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [remainingTime, setRemainingTime] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data from API
    setTimeout(() => {
      // Find project by ID
      const foundProject = mockProjects.find(p => p.id === projectId);
      if (foundProject) {
        setProject(foundProject);
        
        // Find video for this project
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
        
        // Get badge scores for this project
        const projectBadgeScores = mockBadgeScores.filter(bs => bs.projectId === projectId);
        setBadgeScores(projectBadgeScores);
      }
      
      setIsLoading(false);
    }, 800);
    
    // If project is processing, simulate progress updates
    if (project?.status === 'processing') {
      const interval = setInterval(() => {
        setProcessingProgress(prev => {
          const newProgress = prev + Math.random() * 5;
          if (newProgress >= 100) {
            clearInterval(interval);
            
            // Update project status to 'analyzed' after processing is complete
            setProject(project => project ? { ...project, status: 'analyzed' } : null);
            
            return 100;
          }
          return newProgress;
        });
        
        // Update estimated remaining time
        const remainingPercentage = 100 - processingProgress;
        const remainingSeconds = Math.round(remainingPercentage / 5); // Assuming 5% per second
        setRemainingTime(`${remainingSeconds} seconds`);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [projectId, project?.status]);

  // Helper to get average badge score
  const getAverageBadgeScore = () => {
    if (badgeScores.length === 0) return 0;
    const total = badgeScores.reduce((sum, score) => sum + score.stars, 0);
    return Math.round((total / badgeScores.length) * 10) / 10;
  };

  // Helper to format video duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-24 bg-gray-200 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-48 bg-gray-200 rounded"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
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
    <div className="space-y-8">
      {/* Project Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{project.title}</h1>
          <p className="text-gray-500 mt-1">{project.description}</p>
        </div>
        <Badge 
          variant="outline"
          className={`
            ${project.status === 'created' ? 'bg-gray-100 text-gray-800' : ''}
            ${project.status === 'uploading' ? 'bg-blue-100 text-blue-800' : ''}
            ${project.status === 'processing' ? 'bg-yellow-100 text-yellow-800' : ''}
            ${project.status === 'analyzed' ? 'bg-purple-100 text-purple-800' : ''}
            ${project.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
          `}
        >
          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
        </Badge>
      </div>
      
      {/* Processing Progress (shown only during processing) */}
      {project.status === 'processing' && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock className="h-5 w-5 mr-2 text-yellow-500" />
              Analysis in Progress
            </CardTitle>
            <CardDescription>
              We're analyzing your presentation video. This may take a few minutes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing...</span>
                <span>{Math.round(processingProgress)}%</span>
              </div>
              <Progress value={processingProgress} className="h-2" />
              <p className="text-sm text-gray-500">
                Estimated time remaining: {remainingTime}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Video Preview & Project Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Video Preview */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <VideoIcon className="h-5 w-5 mr-2 text-blue-500" />
              Presentation Video
            </CardTitle>
          </CardHeader>
          <CardContent>
            {video ? (
              <div className="space-y-3">
                <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                  <video 
                    src={video.url} 
                    controls 
                    className="w-full h-full object-contain"
                    poster="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Duration: {formatDuration(video.duration)}</span>
                  <span>Resolution: {video.resolution.width}x{video.resolution.height}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No video available</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Project Info */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              Project Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Target Audience</h3>
                  <p className="mt-1">
                    {project.audience.charAt(0).toUpperCase() + project.audience.slice(1)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Formality</h3>
                  <p className="mt-1">
                    {project.formality.charAt(0).toUpperCase() + project.formality.slice(1)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Domain</h3>
                  <p className="mt-1">
                    {project.domain ? project.domain.charAt(0).toUpperCase() + project.domain.slice(1) : 'Not specified'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Created</h3>
                  <p className="mt-1">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              {/* Overall Score (visible once analysis is complete) */}
              {(project.status === 'analyzed' || project.status === 'completed') && (
                <div className="mt-6 border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Overall Assessment</h3>
                  <div className="flex items-center">
                    <div className="bg-mint/10 w-16 h-16 rounded-full flex items-center justify-center mr-4">
                      <span className="text-2xl font-bold text-mint">{getAverageBadgeScore()}</span>
                    </div>
                    <div>
                      <p className="font-medium">
                        {getAverageBadgeScore() >= 4 ? 'Excellent' : 
                         getAverageBadgeScore() >= 3 ? 'Good' : 
                         getAverageBadgeScore() >= 2 ? 'Average' : 'Needs Improvement'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Based on {badgeScores.length} assessment criteria
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Feedback Sections (visible once processing is complete) */}
      {(project.status === 'analyzed' || project.status === 'completed') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Body Language Feedback */}
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <PlayCircle className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">Body Language Feedback</h3>
                  <p className="text-gray-600 mb-4">
                    Analysis of your gestures, posture, and facial expressions.
                  </p>
                  <Link to={`/app/projects/${project.id}/body-feedback`}>
                    <Button variant="outline" className="w-full">View Details</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Script Feedback */}
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <Mic2 className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">Script Feedback</h3>
                  <p className="text-gray-600 mb-4">
                    Analysis of your speech, filler words, and message clarity.
                  </p>
                  <Link to={`/app/projects/${project.id}/script-feedback`}>
                    <Button variant="outline" className="w-full">View Details</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProjectOverviewPage;
