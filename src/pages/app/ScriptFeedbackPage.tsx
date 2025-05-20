
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { mockProjects, mockVideos, mockScriptSegments, mockSuggestions } from '@/lib/mock-data';
import { Project, Video, ScriptSegment, Suggestion } from '@/lib/types';
import { AlertTriangle, ArrowLeft, Check, X, HelpCircle, MessageCircle, Mic2 } from 'lucide-react';

const ScriptFeedbackPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [video, setVideo] = useState<Video | null>(null);
  const [scriptSegments, setScriptSegments] = useState<ScriptSegment[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<'structure' | 'habits'>('structure');
  const [acceptedSuggestions, setAcceptedSuggestions] = useState<string[]>([]);
  const [rejectedSuggestions, setRejectedSuggestions] = useState<string[]>([]);

  // Fake filler word data
  const fillerWordStats = {
    um: { count: 12, timestamp: [17.5, 32.1, 56.8, 72.3, 89.5, 103.2, 125.7, 147.2, 168.9, 184.2, 205.5, 230.1] },
    like: { count: 8, timestamp: [25.3, 49.7, 78.2, 96.5, 142.8, 178.4, 211.6, 247.9] },
    basically: { count: 5, timestamp: [39.2, 85.7, 132.5, 189.3, 236.8] },
    actually: { count: 4, timestamp: [62.4, 114.7, 158.3, 217.5] },
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
        
        // Get script segments for this project
        const projectSegments = mockScriptSegments.filter(seg => seg.projectId === projectId);
        setScriptSegments(projectSegments);
        
        // Get suggestions for this project
        const projectSuggestions = mockSuggestions.filter(sug => sug.projectId === projectId);
        setSuggestions(projectSuggestions);
      }
      
      setIsLoading(false);
    }, 800);
  }, [projectId]);

  // Handle accepting a suggestion
  const acceptSuggestion = (suggestionId: string) => {
    setAcceptedSuggestions(prev => [...prev, suggestionId]);
    setRejectedSuggestions(prev => prev.filter(id => id !== suggestionId));
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
          <h1 className="text-2xl font-bold">Script Feedback</h1>
        </div>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="structure" onValueChange={(value) => setCurrentTab(value as 'structure' | 'habits')}>
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="structure">Structure & Content</TabsTrigger>
          <TabsTrigger value="habits">Speech Habits</TabsTrigger>
        </TabsList>
        
        <TabsContent value="structure" className="mt-6 space-y-6">
          {/* Original vs Improved Structure */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Original Structure */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Original Script</CardTitle>
                <CardDescription>Your presentation transcript</CardDescription>
              </CardHeader>
              <CardContent className="max-h-[500px] overflow-y-auto">
                <div className="space-y-4">
                  {scriptSegments.map(segment => (
                    <div key={segment.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="bg-gray-50">
                          {formatTime(segment.start)} - {formatTime(segment.end)}
                        </Badge>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          {segment.speechAct.charAt(0).toUpperCase() + segment.speechAct.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-gray-800">{segment.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Improved Structure */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Suggested Improvements</CardTitle>
                <CardDescription>AI-powered suggestions for clarity and impact</CardDescription>
              </CardHeader>
              <CardContent className="max-h-[500px] overflow-y-auto">
                <div className="space-y-4">
                  {suggestions.length > 0 ? (
                    suggestions.map(suggestion => (
                      <div 
                        key={suggestion.id} 
                        className={`border rounded-lg p-4 ${
                          acceptedSuggestions.includes(suggestion.id) ? 'border-green-300 bg-green-50' :
                          rejectedSuggestions.includes(suggestion.id) ? 'border-red-300 bg-red-50' : ''
                        }`}
                      >
                        <div className="mb-3">
                          <p className="text-gray-500 text-sm mb-2">Original:</p>
                          <p className="text-gray-800 bg-gray-50 p-2 rounded">{suggestion.beforeText}</p>
                        </div>
                        <div className="mb-3">
                          <p className="text-gray-500 text-sm mb-2">Suggestion:</p>
                          <p className="text-gray-800 bg-mint/10 p-2 rounded">{suggestion.afterText}</p>
                        </div>
                        
                        <Accordion type="single" collapsible>
                          <AccordionItem value="explanation">
                            <AccordionTrigger className="text-sm text-gray-600 flex items-center">
                              <HelpCircle className="h-4 w-4 mr-1" />
                              Why this matters
                            </AccordionTrigger>
                            <AccordionContent>
                              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                                {suggestion.rationale}
                              </p>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                        
                        <div className="flex justify-end mt-3 space-x-2">
                          {!acceptedSuggestions.includes(suggestion.id) && 
                           !rejectedSuggestions.includes(suggestion.id) && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600"
                                onClick={() => rejectSuggestion(suggestion.id)}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                              <Button
                                size="sm"
                                className="text-white"
                                onClick={() => acceptSuggestion(suggestion.id)}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Accept
                              </Button>
                            </>
                          )}
                          
                          {acceptedSuggestions.includes(suggestion.id) && (
                            <Badge className="bg-green-100 text-green-800">
                              <Check className="h-4 w-4 mr-1" />
                              Accepted
                            </Badge>
                          )}
                          
                          {rejectedSuggestions.includes(suggestion.id) && (
                            <Badge className="bg-red-100 text-red-800">
                              <X className="h-4 w-4 mr-1" />
                              Rejected
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No suggestions available</p>
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
              <CardTitle className="text-lg">Filler Word Analysis</CardTitle>
              <CardDescription>Identification of frequent filler words in your presentation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Stats Overview */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {Object.entries(fillerWordStats).map(([word, stats]) => (
                    <div key={word} className="border rounded-lg p-4 text-center">
                      <h3 className="font-bold text-xl text-gray-800">{stats.count}</h3>
                      <p className="text-gray-500">"{word}"</p>
                    </div>
                  ))}
                </div>
                
                {/* Recommendations */}
                <div className="bg-mint/10 rounded-lg p-4">
                  <h3 className="font-medium mb-2 flex items-center">
                    <Mic2 className="h-5 w-5 mr-2 text-mint" />
                    Recommendations
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-mint/20 flex items-center justify-center text-mint mr-2 mt-0.5 flex-shrink-0">1</div>
                      <p>Practice pausing instead of using filler words. A brief silence is more powerful than saying "um" or "like".</p>
                    </li>
                    <li className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-mint/20 flex items-center justify-center text-mint mr-2 mt-0.5 flex-shrink-0">2</div>
                      <p>Record yourself speaking and practice recognizing when you use filler words.</p>
                    </li>
                    <li className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-mint/20 flex items-center justify-center text-mint mr-2 mt-0.5 flex-shrink-0">3</div>
                      <p>Slow down your speech pace slightly to give yourself time to think of the next phrase.</p>
                    </li>
                  </ul>
                </div>
                
                {/* Timeline of Filler Words */}
                <div>
                  <h3 className="font-medium mb-3">Timeline of Filler Words</h3>
                  <div className="relative h-12 border rounded-lg overflow-hidden">
                    {video && Object.entries(fillerWordStats).map(([word, stats], wordIndex) => (
                      <div key={word} className="absolute top-0 w-full h-full">
                        {stats.timestamp.map((time, i) => (
                          <div 
                            key={`${word}-${i}`}
                            className="absolute h-full w-1.5 cursor-pointer hover:opacity-80"
                            style={{
                              left: `${(time / video.duration) * 100}%`,
                              backgroundColor: ['#09A484', '#EACD10', '#6366F1', '#EC4899'][wordIndex % 4],
                              opacity: 0.7
                            }}
                            title={`"${word}" at ${formatTime(time)}`}
                          ></div>
                        ))}
                      </div>
                    ))}
                    
                    {/* Legend */}
                    <div className="absolute -bottom-6 left-0 right-0 flex justify-center space-x-4 text-xs text-gray-500">
                      {Object.keys(fillerWordStats).map((word, i) => (
                        <div key={word} className="flex items-center">
                          <div 
                            className="w-3 h-3 mr-1 rounded-full" 
                            style={{ backgroundColor: ['#09A484', '#EACD10', '#6366F1', '#EC4899'][i % 4] }}
                          ></div>
                          "{word}"
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Quick Fixes */}
                <div>
                  <h3 className="font-medium mb-3">Common Replacements</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-red-500 font-medium">Instead of:</p>
                        <p>"So, um, what I'm trying to say is..."</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-green-600 font-medium">Try:</p>
                        <p>"What I mean is..."</p>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-red-500 font-medium">Instead of:</p>
                        <p>"We basically need to like focus on..."</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-green-600 font-medium">Try:</p>
                        <p>"We need to focus on..."</p>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-red-500 font-medium">Instead of:</p>
                        <p>"Actually, the data shows..."</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-green-600 font-medium">Try:</p>
                        <p>"The data shows..."</p>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-red-500 font-medium">Instead of:</p>
                        <p>"I think, um, we should..."</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-green-600 font-medium">Try:</p>
                        <p>"I believe we should..."</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScriptFeedbackPage;
