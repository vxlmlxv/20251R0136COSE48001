import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { mockProjects, mockVideos, mockScriptSections, mockSuggestions } from '@/lib/mock-data';
import { Project, Video, ScriptSection, Suggestion } from '@/lib/types';
import { AlertTriangle, ArrowLeft, Check, X, HelpCircle, MessageCircle, Mic2, FileText, Repeat, BookOpen, Volume2, Target, Zap, TrendingUp, BarChart3, Eye, Heart, Brain, Smile } from 'lucide-react';

const ScriptFeedbackPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [video, setVideo] = useState<Video | null>(null);
  const [scriptSections, setScriptSections] = useState<ScriptSection[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<'structure' | 'expressions' | 'habits'>('structure');
  const [acceptedSuggestions, setAcceptedSuggestions] = useState<string[]>([]);
  const [rejectedSuggestions, setRejectedSuggestions] = useState<string[]>([]);

  // Enhanced script structure analysis
  const structureAnalysis = {
    overallScore: 8.2,
    strengths: [
      "Clear introduction that establishes context",
      "Logical flow between main topics",
      "Strong conclusion with actionable insights"
    ],
    improvements: [
      "Add more transition phrases between sections",
      "Include specific examples in section 2",
      "Strengthen the call-to-action"
    ],
    sections: [
      { name: "Introduction", score: 9.1, feedback: "Excellent hook and clear agenda setting" },
      { name: "Problem Statement", score: 8.5, feedback: "Well-defined but could use more specific data" },
      { name: "Solution Overview", score: 7.8, feedback: "Good structure, needs more concrete examples" },
      { name: "Implementation", score: 8.0, feedback: "Clear steps, consider adding timeline" },
      { name: "Conclusion", score: 8.5, feedback: "Strong summary, enhance call-to-action" }
    ]
  };

  // Sentence expression analysis
  const expressionAnalysis = {
    sentenceVariety: {
      score: 7.5,
      short: 45, // percentage
      medium: 35,
      long: 20,
      feedback: "Good variety. Consider adding more medium-length sentences for better flow."
    },
    emotionalTone: {
      confident: 65,
      enthusiastic: 25,
      cautious: 10,
      feedback: "Strong confident tone. Add more enthusiasm in key moments."
    },
    clarity: {
      score: 8.3,
      complexSentences: 12,
      jargonUse: 8,
      feedback: "Excellent clarity overall. Simplify 3 technical terms for broader audience."
    },
    engagement: {
      score: 7.8,
      questions: 4,
      statements: 28,
      imperatives: 6,
      feedback: "Good use of questions. Consider adding more direct calls to action."
    }
  };

  // Fake filler word data
  const fillerWordStats = {
    um: { count: 12, timestamp: [17.5, 32.1, 56.8, 72.3, 89.5, 103.2, 125.7, 147.2, 168.9, 184.2, 205.5, 230.1] },
    like: { count: 8, timestamp: [25.3, 49.7, 78.2, 96.5, 142.8, 178.4, 211.6, 247.9] },
    basically: { count: 5, timestamp: [39.2, 85.7, 132.5, 189.3, 236.8] },
    actually: { count: 4, timestamp: [62.4, 114.7, 158.3, 217.5] },
  };

  // Helper functions
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

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return 'text-green-600';
    if (score >= 7.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 8.5) return 'bg-green-100 text-green-800';
    if (score >= 7.0) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getFillerWordColor = (wordIndex: number) => {
    const colors = ['#09A484', '#EACD10', '#6366F1', '#EC4899'];
    return colors[wordIndex % colors.length];
  };

  // Event handlers
  useEffect(() => {
    setTimeout(() => {
      const foundProject = mockProjects.find(p => p.id === projectId);
      if (foundProject) {
        setProject(foundProject);
        
        const foundVideo = mockVideos.find(v => v.projectId === projectId);
        if (foundVideo) {
          setVideo(foundVideo);
        }
        
        const projectSections = mockScriptSections.filter(sec => sec.projectId === projectId);
        setScriptSections(projectSections);
        
        const projectSuggestions = mockSuggestions.filter(sug => sug.projectId === projectId);
        setSuggestions(projectSuggestions);
        
        const keepSuggestions = projectSuggestions.filter(sug => sug.type === 'keep').map(sug => sug.id);
        setAcceptedSuggestions(keepSuggestions);
      }
      
      setIsLoading(false);
    }, 800);
  }, [projectId]);

  const acceptSuggestion = (suggestionId: string) => {
    const isAlreadyAccepted = acceptedSuggestions.includes(suggestionId);
    if (isAlreadyAccepted) {
      setAcceptedSuggestions(prev => prev.filter(id => id !== suggestionId));
    } else {
      setAcceptedSuggestions(prev => [...prev, suggestionId]);
      setRejectedSuggestions(prev => prev.filter(id => id !== suggestionId));
    }
  };

  const rejectSuggestion = (suggestionId: string) => {
    setRejectedSuggestions(prev => [...prev, suggestionId]);
    setAcceptedSuggestions(prev => prev.filter(id => id !== suggestionId));
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
        <div className="h-48 bg-gray-200 rounded"></div>
      </div>
    );
  }

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
      <Tabs defaultValue="structure" onValueChange={(value) => setCurrentTab(value as 'structure' | 'expressions' | 'habits')}>
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Link to={`/app/projects/${projectId}/overview`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Overview
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Script Analysis</h1>
              <p className="text-gray-600">AI-powered feedback for your presentation script</p>
            </div>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <TabsList className="grid grid-cols-3 max-w-2xl">
          <TabsTrigger value="structure" className="px-6">
            <FileText className="mr-2 h-4 w-4" />
            Structure & Flow
          </TabsTrigger>
          <TabsTrigger value="expressions" className="px-6">
            <Brain className="mr-2 h-4 w-4" />
            Expression Analysis
          </TabsTrigger>
          <TabsTrigger value="habits" className="px-6">
            <Mic2 className="mr-2 h-4 w-4" />
            Speech Habits
          </TabsTrigger>
        </TabsList>
        
        {/* Structure & Flow Tab */}
        <TabsContent value="structure" className="mt-6 space-y-6">
          {/* Overall Structure Score */}
          <Card className="border-l-4 border-l-mint">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Overall Structure Score</CardTitle>
                  <CardDescription>How well your presentation flows and connects</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-mint">{structureAnalysis.overallScore}/10</div>
                  <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strengths */}
                <div>
                  <h4 className="font-semibold text-green-700 mb-3 flex items-center">
                    <Check className="h-4 w-4 mr-2" />
                    Key Strengths
                  </h4>
                  <ul className="space-y-2">
                    {structureAnalysis.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <div className="h-2 w-2 rounded-full bg-green-500 mt-2 mr-3 flex-shrink-0"></div>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Improvements */}
                <div>
                  <h4 className="font-semibold text-yellow-700 mb-3 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Areas for Improvement
                  </h4>
                  <ul className="space-y-2">
                    {structureAnalysis.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <div className="h-2 w-2 rounded-full bg-yellow-500 mt-2 mr-3 flex-shrink-0"></div>
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-mint" />
                Section-by-Section Analysis
              </CardTitle>
              <CardDescription>Detailed breakdown of each presentation section</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {structureAnalysis.sections.map((section, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{section.name}</h4>
                      <Badge className={getScoreBadgeColor(section.score)}>
                        {section.score}/10
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{section.feedback}</p>
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-mint h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(section.score / 10) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-mint" />
                AI Improvement Suggestions
              </CardTitle>
              <CardDescription>Specific recommendations to enhance your script</CardDescription>
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
                            <p className="text-gray-800 text-sm leading-relaxed p-3 rounded border-l-4 border-l-mint bg-white">
                              {suggestion.suggestedText}
                            </p>
                          </div>
                        )}
                        
                        <Accordion type="single" collapsible>
                          <AccordionItem value="explanation">
                            <AccordionTrigger className="text-sm text-gray-600 flex items-center">
                              <HelpCircle className="h-4 w-4 mr-1" />
                              Why this suggestion?
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
        </TabsContent>
        
        {/* Expression Analysis Tab */}
        <TabsContent value="expressions" className="mt-6 space-y-6">
          {/* Sentence Structure Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-mint" />
                  Sentence Variety
                </CardTitle>
                <CardDescription>Balance of short, medium, and long sentences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Overall Score</span>
                    <Badge className={getScoreBadgeColor(expressionAnalysis.sentenceVariety.score)}>
                      {expressionAnalysis.sentenceVariety.score}/10
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Short (1-8 words)</span>
                      <span className="text-sm font-medium">{expressionAnalysis.sentenceVariety.short}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${expressionAnalysis.sentenceVariety.short}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Medium (9-18 words)</span>
                      <span className="text-sm font-medium">{expressionAnalysis.sentenceVariety.medium}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: `${expressionAnalysis.sentenceVariety.medium}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Long (19+ words)</span>
                      <span className="text-sm font-medium">{expressionAnalysis.sentenceVariety.long}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${expressionAnalysis.sentenceVariety.long}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">{expressionAnalysis.sentenceVariety.feedback}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-mint" />
                  Emotional Tone
                </CardTitle>
                <CardDescription>How your message comes across emotionally</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        Confident
                      </span>
                      <span className="text-sm font-medium">{expressionAnalysis.emotionalTone.confident}%</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                        Enthusiastic
                      </span>
                      <span className="text-sm font-medium">{expressionAnalysis.emotionalTone.enthusiastic}%</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm flex items-center">
                        <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                        Cautious
                      </span>
                      <span className="text-sm font-medium">{expressionAnalysis.emotionalTone.cautious}%</span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-4 relative">
                    <div 
                      className="bg-green-500 h-4 rounded-l-full absolute left-0"
                      style={{ width: `${expressionAnalysis.emotionalTone.confident}%` }}
                    ></div>
                    <div 
                      className="bg-yellow-500 h-4 absolute"
                      style={{ 
                        left: `${expressionAnalysis.emotionalTone.confident}%`,
                        width: `${expressionAnalysis.emotionalTone.enthusiastic}%` 
                      }}
                    ></div>
                    <div 
                      className="bg-gray-500 h-4 rounded-r-full absolute right-0"
                      style={{ width: `${expressionAnalysis.emotionalTone.cautious}%` }}
                    ></div>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">{expressionAnalysis.emotionalTone.feedback}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Clarity and Engagement */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-mint" />
                  Clarity Score
                </CardTitle>
                <CardDescription>How easy your content is to understand</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Overall Clarity</span>
                    <Badge className={getScoreBadgeColor(expressionAnalysis.clarity.score)}>
                      {expressionAnalysis.clarity.score}/10
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Complex Sentences</span>
                      <span className="text-sm font-medium">{expressionAnalysis.clarity.complexSentences}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Technical Terms</span>
                      <span className="text-sm font-medium">{expressionAnalysis.clarity.jargonUse}</span>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-800">{expressionAnalysis.clarity.feedback}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Smile className="h-5 w-5 mr-2 text-mint" />
                  Engagement Level
                </CardTitle>
                <CardDescription>How well you connect with your audience</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Engagement Score</span>
                    <Badge className={getScoreBadgeColor(expressionAnalysis.engagement.score)}>
                      {expressionAnalysis.engagement.score}/10
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Questions Asked</span>
                      <span className="text-sm font-medium">{expressionAnalysis.engagement.questions}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Direct Statements</span>
                      <span className="text-sm font-medium">{expressionAnalysis.engagement.statements}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Call to Actions</span>
                      <span className="text-sm font-medium">{expressionAnalysis.engagement.imperatives}</span>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-sm text-yellow-800">{expressionAnalysis.engagement.feedback}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Speech Habits Tab */}
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
