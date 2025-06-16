
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { projectService } from '@/services/project-service';
import { feedbackService } from '@/services/feedback-service';
import { Project, Video, BadgeScore } from '@/lib/types';
import { Clock, Video as VideoIcon, AlertTriangle, CheckCircle, PlayCircle, Mic2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ProjectOverviewPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [video, setVideo] = useState<Video | null>(null);
  const [badgeScores, setBadgeScores] = useState<BadgeScore[]>([]);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [remainingTime, setRemainingTime] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadProjectData = async () => {
      if (!projectId) return;
      
      try {
        setIsLoading(true);
        
        // Load project details
        const projectData = await projectService.getProjectById(projectId);
        setProject(projectData);
        
        // Load video if available
        if (projectData.videoUrl) {
          try {
            const videoData = await projectService.getProjectVideo(projectId);
            setVideo(videoData);
          } catch (error) {
            // Video might not be available yet
            console.log('Video not available yet');
          }
        }
        
        // Load badge scores if project is completed
        if (projectData.status === 'completed') {
          try {
            const scores = await feedbackService.getBadgeScores(projectId);
            setBadgeScores(scores);
          } catch (error) {
            console.error('Failed to load badge scores:', error);
          }
        }
        
      } catch (error) {
        console.error('Failed to load project:', error);
        toast({
          title: 'Error',
          description: 'Failed to load project data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProjectData();
    
    // Set up polling for processing status
    let interval: NodeJS.Timeout;
    if (project?.status === 'processing') {
      interval = setInterval(async () => {
        try {
          const updatedProject = await projectService.getProjectById(projectId!);
          setProject(updatedProject);
          
          // Update progress simulation
          setProcessingProgress(prev => {
            const newProgress = Math.min(prev + Math.random() * 5, 95);
            const remainingPercentage = 100 - newProgress;
            const remainingSeconds = Math.round(remainingPercentage / 5);
            setRemainingTime(`${remainingSeconds} seconds`);
            return newProgress;
          });
          
          // Stop polling if completed
          if (updatedProject.status === 'completed') {
            setProcessingProgress(100);
            clearInterval(interval);
          }
        } catch (error) {
          console.error('Failed to update project status:', error);
        }
      }, 2000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [projectId, project?.status, toast]);

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
            ${project.status === 'processing' ? 'bg-yellow-100 text-yellow-800' : ''}
            ${project.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
          `}
        >
          {project.status.charAt(0).toUpperCase() + project.status.slice(1).toLowerCase()}
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
                    {project.audience.charAt(0).toUpperCase() + project.audience.slice(1).toLowerCase()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Formality</h3>
                  <p className="mt-1">
                    {project.formality.charAt(0).toUpperCase() + project.formality.slice(1).toLowerCase()}
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
              {project.status === 'completed' && (
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
      {project.status === 'completed' && (
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
