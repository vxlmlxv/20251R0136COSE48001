import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { mockProjects, mockVideos, mockScriptSections, mockSuggestions } from '@/lib/mock-data';
import { Project, Video, ScriptSection, Suggestion } from '@/lib/types';
import { AlertTriangle, ArrowLeft, Check, X, HelpCircle, MessageCircle, Mic2, FileText, Repeat, BookOpen, Volume2, Target, Zap } from 'lucide-react';

const ScriptFeedbackPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [video, setVideo] = useState<Video | null>(null);
  const [scriptSections, setScriptSections] = useState<ScriptSection[]>([]);
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

  // Helper function to get suggestion colors based on type
  const getSuggestionColor = (type: string, isAccepted: boolean) => {
    if (isAccepted) return 'border-green-300 bg-green-50';
    
    switch (type) {
      case 'modify':
        return 'border-yellow-300 bg-yellow-50';
      case 'delete':
        return 'border-red-300 bg-red-50';
      case 'keep':
        return 'border-green-300 bg-green-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  // Helper function to get suggestion icon based on type
  const getSuggestionTypeIcon = (type: string) => {
    switch (type) {
      case 'modify':
        return <MessageCircle className="h-5 w-5 text-yellow-600" />;
      case 'delete':
        return <X className="h-5 w-5 text-red-600" />;
      case 'keep':
        return <Check className="h-5 w-5 text-green-600" />;
      default:
        return <Target className="h-5 w-5 text-gray-600" />;
    }
  };

  // Helper function to get filler word icon
  const getFillerWordIcon = (word: string) => {
    return <Mic2 className="h-4 w-4 text-orange-600" />;
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
        
        // Find video for this project
        const foundVideo = mockVideos.find(v => v.projectId === projectId);
        if (foundVideo) {
          setVideo(foundVideo);
        }
        
        // Get script sections for this project
        const projectSections = mockScriptSections.filter(sec => sec.projectId === projectId);
        setScriptSections(projectSections);
        
        // Get suggestions for this project
        const projectSuggestions = mockSuggestions.filter(sug => sug.projectId === projectId);
        setSuggestions(projectSuggestions);
        
        // Initialize "keep" suggestions as accepted by default
        const keepSuggestions = projectSuggestions.filter(sug => sug.type === 'keep').map(sug => sug.id);
        setAcceptedSuggestions(keepSuggestions);
      }
      
      setIsLoading(false);
    }, 800);
  }, [projectId]);

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
      {/* Tabs wrapper */}
      <Tabs defaultValue="structure" onValueChange={(value) => setCurrentTab(value as 'structure' | 'habits')}>
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Link to={`/app/projects/${projectId}/overview`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Overview
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Script Feedback</h1>
            {/* Tabs next to title */}
            <TabsList className="grid grid-cols-2 max-w-md">
              <TabsTrigger value="structure" className="px-4">
                Structure & Content
              </TabsTrigger>
              <TabsTrigger value="habits" className="px-4">
                Speech Habits
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
        
        <TabsContent value="structure" className="mt-6 space-y-6">
          {/* Script Sections and Suggestions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Original Script Sections */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Original Script Sections</CardTitle>
                <CardDescription>Your presentation organized by topics</CardDescription>
              </CardHeader>
              <CardContent className="max-h-[500px] overflow-y-auto">
                <div className="space-y-4">
                  {scriptSections.map(section => (
                    <div key={section.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          {section.title}
                        </Badge>
                        <Badge variant="outline" className="bg-gray-50">
                          {formatTime(section.start)} - {formatTime(section.end)}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {section.sentences.map((sentence, index) => (
                          <p key={index} className="text-gray-800 text-sm leading-relaxed">
                            {sentence}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* AI Suggestions */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">AI Suggestions</CardTitle>
                <CardDescription>Section-based recommendations for improvement</CardDescription>
              </CardHeader>
              <CardContent className="max-h-[500px] overflow-y-auto">
                <div className="space-y-4">
                  {suggestions.length > 0 ? (
                    suggestions.map(suggestion => {
                      const isAccepted = acceptedSuggestions.includes(suggestion.id);
                      const isRejected = rejectedSuggestions.includes(suggestion.id);
                      const sectionTitle = scriptSections.find(s => s.id === suggestion.sectionId)?.title || 'Unknown Section';
                      
                      return (
                        <div 
                          key={suggestion.id} 
                          className={`border rounded-lg p-4 ${getSuggestionColor(suggestion.type, isAccepted)}`}
                        >
                          <div className="flex items-center space-x-2 mb-3">
                            {getSuggestionTypeIcon(suggestion.type)}
                            <span className="text-sm font-medium text-gray-700">
                              {suggestion.type.charAt(0).toUpperCase() + suggestion.type.slice(1)} Suggestion
                            </span>
                            <span className="text-xs text-blue-600 font-bold">• {sectionTitle}</span>
                          </div>
                          
                          {suggestion.suggestedText && (
                            <div className="mb-3">
                              <p className="text-gray-500 text-sm mb-2">Suggested content:</p>
                              <p className="text-gray-800 text-sm leading-relaxed p-3 rounded border-l-4 border-l-mint w-full">
                                {suggestion.suggestedText}
                              </p>
                            </div>
                          )}
                          
                          <Accordion type="single" collapsible>
                            <AccordionItem value="explanation">
                              <AccordionTrigger className="text-sm text-gray-600 flex items-center">
                                <HelpCircle className="h-4 w-4 mr-1" />
                                See why
                              </AccordionTrigger>
                              <AccordionContent>
                                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                                  {suggestion.rationale}
                                </p>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                          
                          <div className="flex justify-end mt-3 space-x-2">
                            {!isRejected && (
                              <>
                                {!isAccepted && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600"
                                    onClick={() => rejectSuggestion(suggestion.id)}
                                  >
                                    <X className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  className={isAccepted ? "bg-green-600 hover:bg-green-700 text-white" : "bg-mint hover:bg-mint/90 text-white"}
                                  onClick={() => acceptSuggestion(suggestion.id)}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  {isAccepted ? 'Accepted' : 'Accept'}
                                </Button>
                              </>
                            )}
                            
                            {isRejected && (
                              <Badge className="bg-red-100 text-red-800">
                                <X className="h-4 w-4 mr-1" />
                                Rejected
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })
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
                              backgroundColor: getFillerWordColor(wordIndex),
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
                            className="w-3 h-3 mr-1 rounded-full flex items-center justify-center" 
                            style={{ backgroundColor: getFillerWordColor(i) }}
                          >
                            <Mic2 className="w-2 h-2 text-white" />
                          </div>
                          "{word}"
                        </div>
                      ))}
                    </div>
                  </div>
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
