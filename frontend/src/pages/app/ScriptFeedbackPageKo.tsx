import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { VideoPlayerWithThumbnails } from '@/components/ui/VideoPlayerWithThumbnails';
import { mockProjects, mockVideos, mockScriptSections, mockSuggestions } from '@/lib/mock-data';
import { Project, Video, ScriptSection, Suggestion } from '@/lib/types';
import { AlertTriangle, ArrowLeft, Check, X, HelpCircle, MessageCircle, Mic2, Repeat, Zap } from 'lucide-react';

const ScriptFeedbackPageKo = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [video, setVideo] = useState<Video | null>(null);
  const [scriptSections, setScriptSections] = useState<ScriptSection[]>([]);
  const [originalScriptSections, setOriginalScriptSections] = useState<ScriptSection[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<'structure' | 'habits'>('structure');
  const [acceptedSuggestions, setAcceptedSuggestions] = useState<string[]>([]);
  const [rejectedSuggestions, setRejectedSuggestions] = useState<string[]>([]);

  // Fake filler word data with Korean examples
  const fillerWordStats = {
    '음': { count: 12, timestamp: [17.5, 32.1, 56.8, 72.3, 89.5, 103.2, 125.7, 147.2, 168.9, 184.2, 205.5, 230.1] },
    '그': { count: 8, timestamp: [25.3, 49.7, 78.2, 96.5, 142.8, 178.4, 211.6, 247.9] },
    '근데': { count: 5, timestamp: [39.2, 85.7, 132.5, 189.3, 236.8] },
    '이제': { count: 4, timestamp: [62.4, 114.7, 158.3, 217.5] },
  };

  // Helper function to get suggestion colors based on category for modify type
  const getSuggestionCategoryColor = (category?: string) => {
    switch (category) {
      case 'audience-formality':
        return 'border-purple-300 bg-purple-50';
      case 'delivery':
        return 'border-blue-300 bg-blue-50';
      case 'clarity':
        return 'border-green-300 bg-green-50';
      default:
        return 'border-yellow-300 bg-yellow-50';
    }
  };

  // Helper function to get suggestion category color for badges
  const getSuggestionCategoryBadgeColor = (category?: string) => {
    switch (category) {
      case 'audience-formality':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivery':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'clarity':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  // Helper function to get suggestion category name in Korean
  const getSuggestionCategoryKo = (category?: string) => {
    switch (category) {
      case 'audience-formality':
        return '청중 및 격식';
      case 'delivery':
        return '전달 방식';
      case 'clarity':
        return '명확성';
      default:
        return '수정';
    }
  };

  // Helper function to get suggestion type icon (for modify only)
  const getSuggestionTypeIcon = () => {
    return <MessageCircle className="h-5 w-5 text-yellow-600" />;
  };

  // Helper function to get filler word color
  const getFillerWordColor = (wordIndex: number) => {
    const colors = ['#09A484', '#EACD10', '#6366F1', '#EC4899']; // mint, yellow, blue, pink
    return colors[wordIndex % colors.length];
  };

  useEffect(() => {
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
          duration: 53, // Demo video actual duration in seconds (0:53)
          resolution: {
            width: 1280,
            height: 720,
          },
        };
        setVideo(demoVideo);
        
        // Get script sections for this project
        const projectSections = mockScriptSections.filter(sec => sec.projectId === projectId);
        setScriptSections(projectSections);
        setOriginalScriptSections(projectSections); // Store original for reset functionality
        
        // Get suggestions for this project (only modify type)
        const projectSuggestions = mockSuggestions.filter(sug => sug.projectId === projectId && sug.type === 'modify');
        setSuggestions(projectSuggestions);
      }
      
      setIsLoading(false);
    }, 800);
  }, [projectId]);

  // Function to apply accepted suggestions to script sections
  const applyAcceptedSuggestions = useCallback(() => {
    const updatedSections = originalScriptSections.map(section => {
      // Find accepted suggestions for this section
      const sectionSuggestions = suggestions.filter(s => 
        s.sectionId === section.id && acceptedSuggestions.includes(s.id)
      );
      
      // If no accepted suggestions for this section, return original
      if (sectionSuggestions.length === 0) {
        return section;
      }
      
      // Apply suggestions based on type
      let updatedSection = { ...section };
      
      sectionSuggestions.forEach(suggestion => {
        if (suggestion.type === 'modify' && suggestion.suggestedText) {
          // For modify suggestions, replace the sentences with the suggested text
          updatedSection = {
            ...updatedSection,
            sentences: [suggestion.suggestedText]
          };
        } else if (suggestion.type === 'delete') {
          // For delete suggestions, mark section as deleted or remove content
          updatedSection = {
            ...updatedSection,
            sentences: ['[이 섹션은 AI 제안에 따라 제거되었습니다]']
          };
        }
        // 'keep' suggestions don't change the content
      });
      
      return updatedSection;
    });
    
    setScriptSections(updatedSections);
  }, [originalScriptSections, suggestions, acceptedSuggestions]);

  // Apply suggestions whenever acceptedSuggestions changes
  useEffect(() => {
    if (originalScriptSections.length > 0) {
      applyAcceptedSuggestions();
    }
  }, [applyAcceptedSuggestions, originalScriptSections]);

  // Handle accepting a suggestion (make it reselectable)
  const acceptSuggestion = (suggestionId: string) => {
    const isAlreadyAccepted = acceptedSuggestions.includes(suggestionId);
    if (isAlreadyAccepted) {
      // If already accepted, remove from accepted
      setAcceptedSuggestions(prev => prev.filter(id => id !== suggestionId));
    } else {
      // If not accepted, add to accepted and remove from rejected
      setAcceptedSuggestions(prev => [...prev, suggestionId]);
      setRejectedSuggestions(prev => prev.filter(id => id !== suggestionId));
    }
  };

  // Handle rejecting a suggestion
  const rejectSuggestion = (suggestionId: string) => {
    setRejectedSuggestions(prev => [...prev, suggestionId]);
    setAcceptedSuggestions(prev => prev.filter(id => id !== suggestionId));
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
        <div className="h-64 bg-gray-200 rounded"></div>
        <div className="h-48 bg-gray-200 rounded"></div>
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
    <div className="space-y-6">
      {/* Tabs wrapper */}
      <Tabs defaultValue="structure" onValueChange={(value) => setCurrentTab(value as 'structure' | 'habits')}>
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Link to={`/app/projects/${projectId}/overview`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                개요로 돌아가기
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">스크립트 피드백</h1>
            {/* Tabs next to title */}
            <TabsList className="grid grid-cols-2 max-w-md">
              <TabsTrigger value="structure" className="px-4">
                AI 피드백
              </TabsTrigger>
              <TabsTrigger value="habits" className="px-4">
                음성 습관
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
        
        <TabsContent value="structure" className="mt-6 space-y-6">

          {/* Script Sections and Suggestions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Script Sentences and Suggestions */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">프레젠테이션 대본</CardTitle>
                    <CardDescription>AI가 추출한 발표 스크립트입니다.</CardDescription>
                  </div>
                  {acceptedSuggestions.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setScriptSections(originalScriptSections);
                        setAcceptedSuggestions([]);
                        setRejectedSuggestions([]);
                      }}
                      className="text-xs"
                    >
                      <Repeat className="h-3 w-3 mr-1" />
                      초기화
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="max-h-[700px] overflow-y-auto">
                <div className="space-y-3">
                  {scriptSections.map(section => 
                    section.sentences.map((sentence, sentenceIndex) => {
                      // Check if this sentence has been modified by accepted suggestions
                      const hasModifications = suggestions.some(s => 
                        s.sectionId === section.id && 
                        acceptedSuggestions.includes(s.id) && 
                        s.type === 'modify'
                      );
                      
                      // Calculate start time for this sentence
                      // Assuming each sentence is evenly distributed within the section's time range
                      const sectionDuration = section.endTime - section.startTime;
                      const sentenceStart = section.startTime + (sentenceIndex * sectionDuration / section.sentences.length);
                      
                      return (
                        <div 
                          key={`${section.id}-${sentenceIndex}`} 
                          className={`border rounded-lg p-4 transition-all duration-300 ${
                            hasModifications ? 'border-mint bg-mint/5 shadow-md' : 'border-gray-200'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <Badge variant="outline" className="bg-gray-50 text-gray-600 text-xs">
                              {formatTime(sentenceStart)}
                            </Badge>
                            {hasModifications && (
                              <Badge variant="outline" className="bg-mint/20 text-mint border-mint text-xs">
                                <Zap className="h-3 w-3 mr-1" />
                                수정됨
                              </Badge>
                            )}
                          </div>
                          <p className={`text-sm leading-relaxed ${
                            hasModifications ? 'text-gray-900 font-medium' : 'text-gray-800'
                          } ${
                            sentence.includes('[이 섹션은') ? 'text-red-600 italic' : ''
                          }`}>
                            {sentence}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* AI Suggestions - Only Modify Type */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">AI 수정 제안사항</CardTitle>
                <CardDescription>발표 개선을 위한 수정 추천</CardDescription>
              </CardHeader>
              <CardContent className="max-h-[700px] overflow-y-auto">
                <div className="space-y-4">
                  {/* Filter to only show modify suggestions */}
                  {suggestions.filter(s => s.type === 'modify').length > 0 ? (
                    suggestions.filter(s => s.type === 'modify').map(suggestion => {
                      const isAccepted = acceptedSuggestions.includes(suggestion.id);
                      const isRejected = rejectedSuggestions.includes(suggestion.id);
                      const isProcessed = isAccepted || isRejected;
                      
                      return (
                        <div 
                          key={suggestion.id} 
                          className={`border rounded-lg transition-all duration-300 ${
                            isProcessed 
                              ? 'p-4 bg-gray-50 border-gray-200' 
                              : `p-4 ${getSuggestionCategoryColor(suggestion.category)}`
                          }`}
                        >
                          {/* Collapsed view for processed suggestions */}
                          {isProcessed ? (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <MessageCircle className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-600">
                                  {getSuggestionCategoryKo(suggestion.category)} 제안
                                </span>
                                {isAccepted && (
                                  <Badge className="bg-green-100 text-green-800 text-xs">
                                    <Check className="h-3 w-3 mr-1" />
                                    수락됨
                                  </Badge>
                                )}
                                {isRejected && (
                                  <Badge className="bg-red-100 text-red-800 text-xs">
                                    <X className="h-3 w-3 mr-1" />
                                    거부됨
                                  </Badge>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-500 hover:text-gray-700 h-6 w-6 p-0"
                                onClick={() => {
                                  if (isAccepted) {
                                    setAcceptedSuggestions(prev => prev.filter(id => id !== suggestion.id));
                                  } else if (isRejected) {
                                    setRejectedSuggestions(prev => prev.filter(id => id !== suggestion.id));
                                  }
                                }}
                              >
                                <Repeat className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            /* Expanded view for pending suggestions */
                            <>
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-2">
                                  <MessageCircle className="h-5 w-5 text-gray-600" />
                                  <span className="text-sm font-medium text-gray-700">수정 제안</span>
                                </div>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${getSuggestionCategoryBadgeColor(suggestion.category)}`}
                                >
                                  {getSuggestionCategoryKo(suggestion.category)}
                                </Badge>
                              </div>
                              
                              {suggestion.suggestedText && (
                                <div className="mb-3">
                                  <p className="text-gray-500 text-sm mb-2">제안 내용:</p>
                                  <p className="text-gray-800 text-sm leading-relaxed p-3 rounded border-l-4 border-l-mint w-full">
                                    {suggestion.suggestedText}
                                  </p>
                                </div>
                              )}
                              
                              <Accordion type="single" collapsible>
                                <AccordionItem value="explanation">
                                  <AccordionTrigger className="text-sm text-gray-600 flex items-center">
                                    <HelpCircle className="h-4 w-4 mr-1" />
                                    이유 보기
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                                      {suggestion.rationale}
                                    </p>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                              
                              <div className="flex justify-end mt-3 space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600"
                                  onClick={() => rejectSuggestion(suggestion.id)}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  거부
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-mint hover:bg-mint/90 text-white"
                                  onClick={() => acceptSuggestion(suggestion.id)}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  수락
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8">
                      <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">수정 제안사항이 없습니다</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

        </TabsContent>
        
        <TabsContent value="habits" className="mt-6 space-y-6">
          {/* Speech Habits Analysis */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">불필요한 어구 분석</CardTitle>
              <CardDescription>발표에서 자주 사용된 불필요한 어구 식별</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Stats Overview */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {Object.entries(fillerWordStats).map(([word, stats], index) => (
                    <div key={word} className="border rounded-lg p-4 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Mic2 className="h-5 w-5" style={{ color: getFillerWordColor(index) }} />
                      </div>
                      <h3 className="font-bold text-xl text-gray-800">{stats.count}</h3>
                      <p className="text-gray-500">"{word}"</p>
                    </div>
                  ))}
                </div>
                
                {/* Timeline of Filler Words */}
                <div>
                  <h3 className="font-medium mb-3">불필요한 어구 타임라인</h3>
                  <div className="relative">
                    {/* Timeline container with better visibility */}
                    <div className="relative h-16 border rounded-lg overflow-hidden bg-gray-50 mb-6">
                      {/* Timestamp markers */}
                      <div className="absolute top-0 left-0 right-0 h-full">
                        {video && [0, video.duration / 4, video.duration / 2, (3 * video.duration) / 4, video.duration].map((time, index) => (
                          <div
                            key={index}
                            className="absolute top-0 h-full w-px bg-gray-300"
                            style={{ left: `${(time / video.duration) * 100}%` }}
                          >
                            <div className="absolute -bottom-6 -translate-x-1/2 text-xs text-gray-500 font-mono">
                              {formatTime(time)}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Filler word markers */}
                      {video && Object.entries(fillerWordStats).map(([word, stats], wordIndex) => (
                        <div key={word} className="absolute top-2 w-full h-12">
                          {stats.timestamp.map((time, i) => (
                            <div 
                              key={`${word}-${i}`}
                              className="absolute h-12 w-2 cursor-pointer hover:opacity-100 transition-opacity rounded-sm shadow-sm"
                              style={{
                                left: `${(time / video.duration) * 100}%`,
                                backgroundColor: getFillerWordColor(wordIndex),
                                opacity: 0.8,
                                transform: 'translateX(-50%)'
                              }}
                              title={`"${word}" 시간: ${formatTime(time)}`}
                            >
                              {/* Tooltip on hover */}
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                "{word}" 시간: {formatTime(time)}
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                    
                    {/* Timeline labels */}
                    <div className="flex justify-between text-xs text-gray-500 font-mono px-1">
                      <span>00:00</span>
                      <span>02:35</span>
                    </div>
                  </div>
                </div>
                
                {/* Recommendations */}
                <div className="bg-mint/10 rounded-lg p-4">
                  <h3 className="font-medium mb-2 flex items-center">
                    <Mic2 className="h-5 w-5 mr-2 text-mint" />
                    추천사항
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-mint/20 flex items-center justify-center text-mint mr-2 mt-0.5 flex-shrink-0">1</div>
                      <p>불필요한 음성적 잉여 표현 대신 잠시 멈추는 연습을 해보세요. 짧은 침묵은 "음", "어"와 같은 습관어보다 훨씬 더 강력한 인상을 줄 수 있답니다.</p>
                    </li>
                    <li className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-mint/20 flex items-center justify-center text-mint mr-2 mt-0.5 flex-shrink-0">2</div>
                      <p>자신의 말하는 모습을 녹화하여 군더더기 말을 사용하는 때를 인식하는 연습을 하세요.</p>
                    </li>
                    <li className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-mint/20 flex items-center justify-center text-mint mr-2 mt-0.5 flex-shrink-0">3</div>
                      <p>말하는 속도를 약간 늦춰서 다음 문구를 생각할 시간을 확보하세요.</p>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScriptFeedbackPageKo;
