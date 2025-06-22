import { useEffect, useState, useCallback } from 'react';
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
  const [originalScriptSections, setOriginalScriptSections] = useState<ScriptSection[]>([]);
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

  // Helper function to get suggestion type text
  const getSuggestionTypeText = (type: string) => {
    switch (type) {
      case 'modify':
        return 'Modified';
      case 'delete':
        return 'Deleted';
      case 'keep':
        return 'Kept';
      default:
        return type;
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
        setScriptSections(projectSections);b
        setOriginalScriptSections(projectSections); // Store original for reset functionality
        
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
            sentences: ['[This section has been removed based on AI suggestion]']
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
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">Script Sections</CardTitle>
                    <CardDescription>Your presentation organized by topics</CardDescription>
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
                      Reset
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="max-h-[500px] overflow-y-auto">
                <div className="space-y-4">
                  {scriptSections.map(section => {
                    // Check if this section has been modified by accepted suggestions
                    const hasModifications = suggestions.some(s => 
                      s.sectionId === section.id && 
                      acceptedSuggestions.includes(s.id) && 
                      (s.type === 'modify' || s.type === 'delete')
                    );
                    
                    return (
                      <div 
                        key={section.id} 
                        className={`border rounded-lg p-4 transition-all duration-300 ${hasModifications ? 'border-mint bg-mint/5 shadow-md' : ''}`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              {section.title}
                            </Badge>
                            {hasModifications && (
                              <Badge variant="outline" className="bg-mint/20 text-mint border-mint">
                                <Zap className="h-3 w-3 mr-1" />
                                Modified
                              </Badge>
                            )}
                          </div>
                          <Badge variant="outline" className="bg-gray-50">
                            {formatTime(section.start)} - {formatTime(section.end)}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          {section.sentences.map((sentence, index) => (
                            <p 
                              key={index} 
                              className={`text-sm leading-relaxed ${
                                hasModifications ? 'text-gray-900 font-medium' : 'text-gray-800'
                              } ${
                                sentence.includes('[This section has been removed') ? 'text-red-600 italic' : ''
                              }`}
                            >
                              {sentence}
                            </p>
                          ))}
                        </div>
                      </div>
                    );
                  })}
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
                      const isProcessed = isAccepted || isRejected;
                      
                      return (
                        <div 
                          key={suggestion.id} 
                          className={`border rounded-lg transition-all duration-300 ${
                            isProcessed 
                              ? 'p-2 bg-gray-50 border-gray-200' 
                              : `p-4 ${getSuggestionColor(suggestion.type, isAccepted)}`
                          }`}
                        >
                          {/* Collapsed view for processed suggestions */}
                          {isProcessed ? (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {getSuggestionTypeIcon(suggestion.type)}
                                <span className="text-sm text-gray-600">
                                  {suggestion.type.charAt(0).toUpperCase() + suggestion.type.slice(1)} Suggestion
                                </span>
                                <span className="text-xs text-gray-500">• {sectionTitle}</span>
                                {isAccepted && (
                                  <Badge className="bg-green-100 text-green-800 text-xs">
                                    <Check className="h-3 w-3 mr-1" />
                                    Accepted
                                  </Badge>
                                )}
                                {isRejected && (
                                  <Badge className="bg-red-100 text-red-800 text-xs">
                                    <X className="h-3 w-3 mr-1" />
                                    Rejected
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
                                  className="bg-mint hover:bg-mint/90 text-white"
                                  onClick={() => acceptSuggestion(suggestion.id)}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Accept
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
                  <div className="relative">
                    {/* Timeline container with better visibility */}
                    <div className="relative h-16 border rounded-lg overflow-hidden bg-gray-50">
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
                              title={`"${word}" at ${formatTime(time)}`}
                            >
                              {/* Tooltip on hover */}
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                "{word}" at {formatTime(time)}
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                    
                    {/* Enhanced Legend with start/end timestamps */}
                    <div className="mt-8 mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Timeline Legend:</span>
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="mr-4">Start: {video ? formatTime(0) : '0:00'}</span>
                          <span>End: {video ? formatTime(video.duration) : '0:00'}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm">
                        {Object.entries(fillerWordStats).map(([word, stats], i) => (
                          <div key={word} className="flex items-center">
                            <div 
                              className="w-4 h-4 mr-2 rounded flex items-center justify-center shadow-sm" 
                              style={{ backgroundColor: getFillerWordColor(i) }}
                            >
                              <Mic2 className="w-2.5 h-2.5 text-white" />
                            </div>
                            <span className="font-medium">"{word}"</span>
                            <span className="ml-2 text-gray-500">({stats.count} times)</span>
                          </div>
                        ))}
                      </div>
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
