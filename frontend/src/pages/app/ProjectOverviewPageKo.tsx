import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { projectService } from '@/services/project-service';
import { projectService as dataProjectService } from '@/services/data-service';
import { mockBadgeScores } from '@/lib/mock-data';
import { Project, Video, BadgeScore } from '@/lib/types';
import { Clock, Video as VideoIcon, AlertTriangle, CheckCircle, PlayCircle, Mic2 } from 'lucide-react';

const ProjectOverviewPageKo = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [video, setVideo] = useState<Video | null>(null);
  const [badgeScores, setBadgeScores] = useState<BadgeScore[]>([]);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [remainingTime, setRemainingTime] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProjectData = async () => {
      if (!projectId) return;
      
      try {
        setIsLoading(true);
        
        // Load project data from API
        const foundProject = await projectService.getProjectById(projectId);
        setProject(foundProject);
        
        // Load videos for this project
        try {
          const projectVideos = await dataProjectService.getProjectVideos(projectId);
          if (projectVideos.length > 0) {
            setVideo(projectVideos[0]); // Use the first video
          } else {
            // If no videos found, create a demo video entry for display
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
          }
        } catch (videoError) {
          console.log('No videos found for project, using demo video');
          // Fallback to demo video if API call fails
          const demoVideo: Video = {
            id: `${projectId}-demo`,
            projectId: projectId!,
            url: '/demo-videos/demo.mp4',
            duration: 596,
            resolution: {
              width: 1280,
              height: 720,
            },
          };
          setVideo(demoVideo);
        }
        
        // Get badge scores for this project (using mock data for now)
        const projectBadgeScores = mockBadgeScores.filter(bs => bs.projectId === projectId);
        setBadgeScores(projectBadgeScores);
        
      } catch (error) {
        console.error('Failed to load project data:', error);
        setProject(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjectData();
  }, [projectId]);

  // Processing progress effect - separate useEffect for processing simulation
  useEffect(() => {
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
        setRemainingTime(`${remainingSeconds}초`);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [projectId, project?.status, processingProgress]);

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

  // Helper to get Korean audience name
  const getAudienceKo = (audience: string) => {
    switch (audience) {
      case 'general': return '일반';
      case 'technical': return '기술적';
      case 'executive': return '경영진';
      case 'academic': return '학술';
      default: return audience;
    }
  };

  // Helper to get Korean formality name
  const getFormalityKo = (formality: string) => {
    switch (formality) {
      case 'casual': return '캐주얼';
      case 'neutral': return '중립';
      case 'formal': return '격식';
      default: return formality;
    }
  };

  // Helper to get Korean status name
  const getStatusKo = (status: string) => {
    switch (status) {
      case 'created': return '생성됨';
      case 'uploading': return '업로드 중';
      case 'processing': return '처리 중';
      case 'analyzed': return '분석 완료';
      case 'completed': return '완료됨';
      default: return status;
    }
  };

  // Helper to get assessment text in Korean
  const getAssessmentKo = (score: number) => {
    if (score >= 4) return '우수';
    if (score >= 3) return '좋음';
    if (score >= 2) return '보통';
    return '개선 필요';
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
          {getStatusKo(project.status)}
        </Badge>
      </div>
      
      {/* Processing Progress (shown only during processing) */}
      {project.status === 'processing' && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock className="h-5 w-5 mr-2 text-yellow-500" />
              분석 진행 중
            </CardTitle>
            <CardDescription>
              프레젠테이션 비디오를 분석하고 있습니다. 몇 분 정도 소요될 수 있습니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>처리 중...</span>
                <span>{Math.round(processingProgress)}%</span>
              </div>
              <Progress value={processingProgress} className="h-2" />
              <p className="text-sm text-gray-500">
                예상 남은 시간: {remainingTime}
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
              프레젠테이션 동영상
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
                  <span>재생 시간: {formatDuration(video.duration)}</span>
                  <span>해상도: {video.resolution.width}x{video.resolution.height}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">동영상이 없습니다</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Project Info */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              프로젝트 요약
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">대상 청중</h3>
                  <p className="mt-1">
                    {project.audience ? getAudienceKo(project.audience) : '일반'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">격식성</h3>
                  <p className="mt-1">
                    {project.formality ? getFormalityKo(project.formality) : '중립'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">분야</h3>
                  <p className="mt-1">
                    {project.domain || '지정되지 않음'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">생성일</h3>
                  <p className="mt-1">
                    {new Date(project.createdAt).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              </div>
              
              {/* Project Status Information */}
              {(project.status === 'created' || project.status === 'uploading') && (
                <div className="mt-6 border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">프로젝트 상태</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="space-y-2">
                        <h4 className="font-medium text-blue-900">프로젝트 설정 완료</h4>
                        <p className="text-sm text-blue-700">
                          프로젝트가 성공적으로 생성되었고 동영상이 업로드되었습니다.
                        </p>
                        <div className="text-sm text-blue-700">
                          <p className="font-medium">설정된 옵션:</p>
                          <ul className="list-disc list-inside space-y-1 mt-1">
                            <li>대상 청중: {project.audience ? getAudienceKo(project.audience) : '일반'}</li>
                            <li>격식성: {project.formality ? getFormalityKo(project.formality) : '중립'}</li>
                            {project.domain && <li>분야: {project.domain}</li>}
                          </ul>
                        </div>
                        <p className="text-sm text-blue-700 mt-2">
                          분석이 시작되면 이 페이지에서 피드백을 확인할 수 있습니다.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Overall Score (visible once analysis is complete) */}
              {(project.status === 'analyzed' || project.status === 'completed') && (
                <div className="mt-6 border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">전체 평가</h3>
                  <div className="flex items-center mb-4">
                    <div className="bg-mint/10 w-16 h-16 rounded-full flex items-center justify-center mr-4">
                      <span className="text-2xl font-bold text-mint">{getAverageBadgeScore()}</span>
                    </div>
                    <div>
                      <p className="font-medium">
                        {getAssessmentKo(getAverageBadgeScore())}
                      </p>
                      <p className="text-sm text-gray-500">
                        {badgeScores.length}개 평가 기준 기반
                      </p>
                    </div>
                  </div>
                  
                  {/* Feedback Buttons */}
                  <div className="grid grid-cols-1 gap-3">
                    {/* Body Language Feedback */}
                    <Link to={`/app/projects/${project.id}/body-feedback`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-start">
                            <div className="bg-purple-100 p-2 rounded-full mr-3">
                              <PlayCircle className="h-4 w-4 text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-base mb-1">바디 랭귀지 피드백</h4>
                              <p className="text-gray-600 text-xs mb-2">
                                제스처, 자세, 표정 분석
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                    
                    {/* Script Feedback */}
                    <Link to={`/app/projects/${project.id}/script-feedback`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-start">
                            <div className="bg-blue-100 p-2 rounded-full mr-3">
                              <Mic2 className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-base mb-1">스크립트 피드백</h4>
                              <p className="text-gray-600 text-xs mb-2">
                                음성, 명확성 분석
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectOverviewPageKo;
