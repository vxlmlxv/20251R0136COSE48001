import { User, Project, Video, ScriptSegment, ScriptSection, BehaviorEvent, BadgeScore, Suggestion, PostureEvent } from './types';

// Demo credentials
export const DEMO_CREDENTIALS = {
  email: 'demo@preffy.com',
  password: 'demo123'
};

// Mock user data
export const mockUsers: User[] = [
  {
    id: 'demo-user',
    name: 'Demo User',
    email: 'demo@preffy.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    locale: 'en-US',
    plan: 'premium'
  },
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    locale: 'en-US',
    plan: 'premium'
  }
];

// Mock projects
export const mockProjects: Project[] = [
  {
    id: 'demo-project',
    userId: 'demo-user',
    title: 'Complete Sales Presentation Analysis - Demo',
    description: 'A comprehensive analysis of a quarterly sales presentation with detailed feedback and insights',
    audience: 'executive',
    formality: 'formal',
    domain: 'sales',
    status: 'completed',
    createdAt: '2025-06-15T14:30:00Z'
  },
  {
    id: 'project-1',
    userId: 'user-1',
    title: 'Annual Sales Presentation',
    description: 'Quarterly performance review for the sales team',
    audience: 'executive',
    formality: 'formal',
    domain: 'sales',
    status: 'completed',
    createdAt: '2025-05-10T14:30:00Z'
  },
  {
    id: 'project-2',
    userId: 'user-1',
    title: 'Product Demo',
    description: 'New feature demonstration for potential clients',
    audience: 'technical',
    formality: 'neutral',
    domain: 'product',
    status: 'processing',
    createdAt: '2025-05-15T09:45:00Z'
  },
  {
    id: 'project-3',
    userId: 'user-1',
    title: 'Team Introduction',
    description: 'Introducing new team members to the company',
    audience: 'general',
    formality: 'casual',
    domain: 'internal',
    status: 'created',
    createdAt: '2025-05-18T11:20:00Z'
  }
];

// Mock videos
export const mockVideos: Video[] = [
  {
    id: 'demo-video',
    projectId: 'demo-project',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: 596,
    resolution: {
      width: 1280,
      height: 720
    }
  },
  {
    id: 'video-1',
    projectId: 'project-1',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: 596,
    resolution: {
      width: 1280,
      height: 720
    }
  },
  {
    id: 'video-2',
    projectId: 'project-2',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    duration: 653,
    resolution: {
      width: 1280,
      height: 720
    }
  }
];

// Mock script segments
export const mockScriptSegments: ScriptSegment[] = [
  // Demo project segments with comprehensive analysis
  {
    id: 'demo-segment-1',
    projectId: 'demo-project',
    sectionName: 'Opening',
    start: 0,
    end: 15.5,
    text: 'Good morning everyone. Today I want to walk you through our exceptional Q2 sales performance.',
    speechAct: 'representatives'
  },
  {
    id: 'demo-segment-2',
    projectId: 'demo-project',
    sectionName: 'Opening',
    start: 15.5,
    end: 28.2,
    text: 'Did we meet our ambitious targets for the quarter? I\'m pleased to announce that we exceeded them.',
    speechAct: 'directives'
  },
  {
    id: 'demo-segment-3',
    projectId: 'demo-project',
    sectionName: 'Key Metrics',
    start: 28.2,
    end: 42.7,
    text: 'We exceeded our targets by 15%, which represents a significant improvement from last quarter.',
    speechAct: 'representatives'
  },
  {
    id: 'demo-segment-4',
    projectId: 'demo-project',
    sectionName: 'Key Metrics',
    start: 42.7,
    end: 55.1,
    text: 'Our conversion rate increased by 8% while customer acquisition costs decreased by 12%.',
    speechAct: 'representatives'
  },
  {
    id: 'demo-segment-5',
    projectId: 'demo-project',
    sectionName: 'Team Performance',
    start: 55.1,
    end: 68.8,
    text: 'I want to thank each team member for their dedication and exceptional work this quarter.',
    speechAct: 'expressives'
  },
  {
    id: 'demo-segment-6',
    projectId: 'demo-project',
    sectionName: 'Future Goals',
    start: 68.8,
    end: 82.5,
    text: 'For Q3, we will focus on expanding our market presence and improving customer retention.',
    speechAct: 'commissives'
  },
  {
    id: 'demo-segment-7',
    projectId: 'demo-project',
    sectionName: 'Closing',
    start: 82.5,
    end: 95.0,
    text: 'Thank you for your attention. Let\'s continue this momentum into the next quarter.',
    speechAct: 'expressives'
  },
  // Existing segments
  {
    id: 'segment-1',
    projectId: 'project-1',
    sectionName: 'Opening',
    start: 0,
    end: 15.5,
    text: 'Good morning everyone. Today I want to walk you through our sales performance for Q2.',
    speechAct: 'representatives'
  },
  {
    id: 'segment-2',
    projectId: 'project-1',
    sectionName: 'Opening',
    start: 15.5,
    end: 23.2,
    text: 'Did we meet our targets for the quarter?',
    speechAct: 'directives'
  },
  {
    id: 'segment-3',
    projectId: 'project-1',
    sectionName: 'Results',
    start: 23.2,
    end: 35.7,
    text: 'Yes, we exceeded our targets by 15%, which is a significant improvement from last quarter.',
    speechAct: 'representatives'
  }
];

// Mock script sections
export const mockScriptSections: ScriptSection[] = [
  {
    id: 'section-1',
    projectId: 'project-1',
    title: 'Opening & Introduction',
    start: 0,
    end: 35.7,
    sentences: [
      'Good morning everyone. Today I want to walk you through our sales performance for Q2.',
      'Did we meet our targets for the quarter?',
      'Yes, we exceeded our targets by 15%, which is a significant improvement from last quarter.'
    ]
  },
  {
    id: 'section-2',
    projectId: 'project-1',
    title: 'Key Metrics Overview',
    start: 35.7,
    end: 78.3,
    sentences: [
      'Let me share the key metrics that drove this performance.',
      'Our conversion rate increased by 8% compared to Q1.',
      'Customer acquisition costs decreased by 12%, showing improved efficiency.',
      'The average deal size grew by 22%, indicating we are attracting higher-value clients.'
    ]
  },
  {
    id: 'section-3',
    projectId: 'project-1',
    title: 'Regional Performance',
    start: 78.3,
    end: 125.8,
    sentences: [
      'Breaking down by region, we see interesting patterns.',
      'The North region led with 28% growth, followed by West with 19%.',
      'The East region showed steady progress at 14% growth.',
      'The South region, while showing 8% growth, has room for improvement.'
    ]
  },
  {
    id: 'section-4',
    projectId: 'project-1',
    title: 'Challenges & Solutions',
    start: 125.8,
    end: 168.5,
    sentences: [
      'Of course, we faced some challenges this quarter.',
      'Supply chain disruptions affected our delivery times.',
      'We addressed this by diversifying our supplier base.',
      'Additionally, we implemented new tracking systems for better visibility.'
    ]
  },
  {
    id: 'section-5',
    projectId: 'project-1',
    title: 'Future Outlook',
    start: 168.5,
    end: 210.0,
    sentences: [
      'Looking ahead to Q3, we have ambitious but achievable goals.',
      'We plan to launch two new product lines.',
      'Our marketing team is preparing campaigns targeting new demographics.',
      'With these initiatives, we project 25% growth for the next quarter.'
    ]
  }
];

// Mock behavior events
export const mockBehaviorEvents: BehaviorEvent[] = [
  // Demo project events with comprehensive analysis
  {
    id: 'demo-event-1',
    projectId: 'demo-project',
    start: 5.2,
    end: 7.8,
    type: 'gesture',
    category: 'confident-hand-gesture',
    severity: 'low'
  },
  {
    id: 'demo-event-2',
    projectId: 'demo-project',
    start: 12.1,
    end: 14.5,
    type: 'facial',
    category: 'engaging-smile',
    severity: 'low'
  },
  {
    id: 'demo-event-3',
    projectId: 'demo-project',
    start: 25.3,
    end: 27.0,
    type: 'posture',
    category: 'upright-confident',
    severity: 'low'
  },
  {
    id: 'demo-event-4',
    projectId: 'demo-project',
    start: 38.7,
    end: 40.2,
    type: 'gesture',
    category: 'descriptive-gestures',
    severity: 'low'
  },
  {
    id: 'demo-event-5',
    projectId: 'demo-project',
    start: 51.5,
    end: 53.8,
    type: 'facial',
    category: 'eye-contact-strong',
    severity: 'low'
  },
  {
    id: 'demo-event-6',
    projectId: 'demo-project',
    start: 67.2,
    end: 69.1,
    type: 'gesture',
    category: 'open-palm-gesture',
    severity: 'low'
  },
  {
    id: 'demo-event-7',
    projectId: 'demo-project',
    start: 78.5,
    end: 80.3,
    type: 'posture',
    category: 'forward-lean-engaged',
    severity: 'low'
  },
  // Existing events
  {
    id: 'event-1',
    projectId: 'project-1',
    start: 10.2,
    end: 12.5,
    type: 'gesture',
    category: 'arms-crossed',
    severity: 'medium'
  },
  {
    id: 'event-2',
    projectId: 'project-1',
    start: 18.7,
    end: 21.3,
    type: 'facial',
    category: 'lack-of-smile',
    severity: 'low'
  },
  {
    id: 'event-3',
    projectId: 'project-1',
    start: 28.5,
    end: 31.0,
    type: 'posture',
    category: 'slouching',
    severity: 'high'
  },
  // Additional gesture events
  {
    id: 'event-4',
    projectId: 'project-1',
    start: 45.2,
    end: 47.8,
    type: 'gesture',
    category: 'pointing-excessive',
    severity: 'medium'
  },
  {
    id: 'event-5',
    projectId: 'project-1',
    start: 62.1,
    end: 64.5,
    type: 'posture',
    category: 'head-tilt',
    severity: 'low'
  },
  {
    id: 'event-6',
    projectId: 'project-1',
    start: 78.3,
    end: 81.2,
    type: 'gesture',
    category: 'hands-in-pockets',
    severity: 'high'
  },
  // Additional facial expression events
  {
    id: 'event-7',
    projectId: 'project-1',
    start: 95.7,
    end: 98.1,
    type: 'facial',
    category: 'eye-contact-poor',
    severity: 'medium'
  },
  {
    id: 'event-8',
    projectId: 'project-1',
    start: 112.4,
    end: 115.0,
    type: 'facial',
    category: 'expression-flat',
    severity: 'high'
  },
  // Additional gesture/posture events
  {
    id: 'event-9',
    projectId: 'project-1',
    start: 128.6,
    end: 131.2,
    type: 'gesture',
    category: 'fidgeting',
    severity: 'medium'
  },
  {
    id: 'event-10',
    projectId: 'project-1',
    start: 145.8,
    end: 148.4,
    type: 'posture',
    category: 'leaning-back',
    severity: 'low'
  },
  {
    id: 'event-11',
    projectId: 'project-1',
    start: 162.3,
    end: 165.1,
    type: 'gesture',
    category: 'repetitive-hand-gestures',
    severity: 'high'
  },
  // Additional facial expression events
  {
    id: 'event-12',
    projectId: 'project-1',
    start: 178.9,
    end: 181.5,
    type: 'facial',
    category: 'forced-smile',
    severity: 'medium'
  },
  {
    id: 'event-13',
    projectId: 'project-1',
    start: 195.2,
    end: 197.8,
    type: 'facial',
    category: 'looking-away',
    severity: 'high'
  }
];

// Mock badge scores
export const mockBadgeScores: BadgeScore[] = [
  // Demo project scores - excellent performance
  {
    badgeId: 'smile-consistency',
    projectId: 'demo-project',
    stars: 5,
    totalEvents: 3
  },
  {
    badgeId: 'posture-alignment',
    projectId: 'demo-project',
    stars: 5,
    totalEvents: 1
  },
  {
    badgeId: 'hand-gestures',
    projectId: 'demo-project',
    stars: 4,
    totalEvents: 2
  },
  {
    badgeId: 'eye-contact',
    projectId: 'demo-project',
    stars: 5,
    totalEvents: 1
  },
  {
    badgeId: 'voice-projection',
    projectId: 'demo-project',
    stars: 4,
    totalEvents: 0
  },
  {
    badgeId: 'confidence-level',
    projectId: 'demo-project',
    stars: 5,
    totalEvents: 0
  },
  // Existing project scores
  {
    badgeId: 'smile-consistency',
    projectId: 'project-1',
    stars: 3,
    totalEvents: 8
  },
  {
    badgeId: 'posture-alignment',
    projectId: 'project-1',
    stars: 2,
    totalEvents: 12
  },
  {
    badgeId: 'hand-gestures',
    projectId: 'project-1',
    stars: 4,
    totalEvents: 5
  },
  {
    badgeId: 'eye-contact',
    projectId: 'project-1',
    stars: 5,
    totalEvents: 2
  }
];

// Mock suggestions
export const mockSuggestions: Suggestion[] = [
  // Demo project suggestions - showing excellent performance with minimal needed changes
  {
    id: 'demo-suggestion-1',
    projectId: 'demo-project',
    sectionId: 'demo-section-1',
    type: 'modify',
    suggestedText: 'Good morning, everyone. I am delighted to walk you through our truly exceptional Q2 sales performance today.',
    originalText: 'Good morning everyone. Today I want to walk you through our exceptional Q2 sales performance.',
    explanation: 'Adding "delighted" conveys more enthusiasm and replacing "want" with "am delighted" creates stronger emotional connection.'
  },
  {
    id: 'demo-suggestion-2',
    projectId: 'demo-project',
    sectionId: 'demo-section-2',
    type: 'add',
    suggestedText: 'These results reflect not just our team\'s hard work, but also our strategic approach to market challenges.',
    explanation: 'Adding context about the strategic approach reinforces leadership competence and team recognition.'
  },
  {
    id: 'demo-suggestion-3',
    projectId: 'demo-project',
    sectionId: 'demo-section-3',
    type: 'modify',
    suggestedText: 'Let me thank each and every team member for their extraordinary dedication and innovative thinking this quarter.',
    originalText: 'I want to thank each team member for their dedication and exceptional work this quarter.',
    explanation: 'Using "extraordinary" and adding "innovative thinking" emphasizes both effort and smart work.'
  },
  // Existing project suggestions
  {
    id: 'suggestion-1',
    projectId: 'project-1',
    sectionId: 'section-1',
    type: 'modify',
    suggestedText: 'Good morning, team. I am excited to share our outstanding Q2 sales performance with you today. We not only met our targets but exceeded them by 15%, which represents a significant improvement from last quarter.',
    explanation: 'Using positive emotional language and combining related statements creates a stronger, more confident opening.'
  },
  {
    id: 'suggestion-2',
    projectId: 'project-1',
    sectionId: 'section-2',
    type: 'modify',
    suggestedText: 'Let me highlight the key metrics that drove this exceptional performance. Our conversion rate increased by 8% compared to Q1, while customer acquisition costs decreased by 12%, demonstrating improved efficiency. Most notably, the average deal size grew by 22%, indicating we are successfully attracting higher-value clients.',
    explanation: 'Restructuring for better flow and emphasizing the positive outcomes with stronger connecting words.'
  },
  {
    id: 'suggestion-4',
    projectId: 'project-1',
    sectionId: 'section-4',
    type: 'modify',
    suggestedText: 'While we achieved great success, we also navigated some challenges effectively. Supply chain disruptions initially affected our delivery times, but we proactively addressed this by diversifying our supplier base and implementing new tracking systems for better visibility.',
    explanation: 'Reframing challenges as opportunities demonstrates problem-solving capability and maintains positive momentum.'
  },
  {
    id: 'suggestion-5',
    projectId: 'project-1',
    sectionId: 'section-5',
    type: 'remove',
    explanation: 'The future outlook section, while informative, may be too detailed for this quarterly review. Consider moving these points to a separate strategic planning discussion.'
  }
];

// Mock posture events data
export const mockPostureEvents: PostureEvent = {
  projectId: 'demo-project',
  totalBadPostures: 15,
  totalDurationSeconds: 45,
  detectedActions: [
    {
      actionName: 'Head Turn',
      periods: [
        {
          startFrame: 150,
          endFrame: 300,
          durationSeconds: 5
        },
        {
          startFrame: 800,
          endFrame: 1200,
          durationSeconds: 13.3
        }
      ],
      summary: {
        totalDurationSeconds: 18.3,
        occurrenceCount: 2
      }
    },
    {
      actionName: 'Looking Away',
      periods: [
        {
          startFrame: 450,
          endFrame: 750,
          durationSeconds: 10
        },
        {
          startFrame: 1500,
          endFrame: 2000,
          durationSeconds: 16.7
        }
      ],
      summary: {
        totalDurationSeconds: 26.7,
        occurrenceCount: 2
      }
    }
  ]
};
