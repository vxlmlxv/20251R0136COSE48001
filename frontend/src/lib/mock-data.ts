
import { User, Project, Video, ScriptSegment, ScriptSection, BehaviorEvent, BadgeScore, Suggestion } from './types';

// Mock user data
export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    username: 'johndoe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    locale: 'en-US',
    plan: 'pro'
  },
  {
    id: 'demo-user',
    name: 'Demo User',
    email: 'demo@preffy.com',
    username: 'demouser',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    locale: 'en-US',
    plan: 'demo'
  }
];

// Mock projects
export const mockProjects: Project[] = [
  {
    id: 'project-1',
    userId: 'user-1',
    title: 'Annual Sales Presentation',
    description: 'Quarterly performance review for the sales team',
    audience: 'executive',
    formality: 'formal',
    domain: 'sales',
    status: 'COMPLETED',
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
    status: 'PROCESSING',
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
    status: 'CREATED',
    createdAt: '2025-05-18T11:20:00Z'
  },
  // Demo project for demo mode
  {
    id: 'demo-project',
    userId: 'demo-user',
    title: 'Product Demo Presentation',
    description: 'Complete demo project showing all features and analysis results',
    audience: 'BUSINESS',
    formality: 'NEUTRAL',
    domain: 'product-demo',
    status: 'COMPLETED',
    videoUrl: '/demo-videos/demo.mp4',
    createdAt: '2025-06-01T10:00:00Z',
    updatedAt: '2025-06-01T10:30:00Z'
  }
];

// Mock videos
export const mockVideos: Video[] = [
  {
    id: 'video-1',
    projectId: 'project-1',
    url: '/demo-videos/demo.mp4',
    duration: 30, // Our demo video is 30 seconds
    thumbnail: '/demo-videos/demo-thumbnail.jpg',
    resolution: {
      width: 1280,
      height: 720
    }
  },
  {
    id: 'video-2',
    projectId: 'project-2',
    url: '/demo-videos/demo.mp4',
    duration: 30, // Our demo video is 30 seconds
    thumbnail: '/demo-videos/demo-thumbnail.jpg',
    resolution: {
      width: 1280,
      height: 720
    }
  },
  // Demo video for demo project
  {
    id: 'demo-video',
    projectId: 'demo-project',
    url: '/demo-videos/demo.mp4',
    duration: 30,
    thumbnail: '/demo-videos/demo-thumbnail.jpg',
    resolution: {
      width: 1280,
      height: 720
    }
  }
];

// Mock script segments
export const mockScriptSegments: ScriptSegment[] = [
  {
    id: 'segment-1',
    projectId: 'project-1',
    start: 0,
    end: 15.5,
    text: 'Good morning everyone. Today I want to walk you through our sales performance for Q2.',
    speechAct: 'statement'
  },
  {
    id: 'segment-2',
    projectId: 'project-1',
    start: 15.5,
    end: 23.2,
    text: 'Did we meet our targets for the quarter?',
    speechAct: 'question'
  },
  {
    id: 'segment-3',
    projectId: 'project-1',
    start: 23.2,
    end: 35.7,
    text: 'Yes, we exceeded our targets by 15%, which is a significant improvement from last quarter.',
    speechAct: 'emphasis'
  },
  // Demo project script segments
  {
    id: 'demo-segment-1',
    projectId: 'demo-project',
    sectionName: 'Introduction',
    start: 0,
    end: 8,
    text: 'Hello everyone, welcome to our product demo. Today I will show you the amazing features of our new platform.',
    speechAct: 'statement'
  },
  {
    id: 'demo-segment-2',
    projectId: 'demo-project',
    sectionName: 'Features',
    start: 8,
    end: 18,
    text: 'Let me walk you through the key capabilities. First, we have real-time collaboration tools.',
    speechAct: 'statement'
  },
  {
    id: 'demo-segment-3',
    projectId: 'demo-project',
    sectionName: 'Benefits',
    start: 18,
    end: 25,
    text: 'This will revolutionize how your team works together.',
    speechAct: 'emphasis'
  },
  {
    id: 'demo-segment-4',
    projectId: 'demo-project',
    sectionName: 'Closing',
    start: 25,
    end: 30,
    text: 'Thank you for your attention. Any questions?',
    speechAct: 'question'
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
  {
    id: 'event-1',
    projectId: 'project-1',
    start: 0.2,
    end: 1.3,
    type: 'gesture',
    category: 'arms-crossed',
    severity: 'medium'
  },
  {
    id: 'event-2',
    projectId: 'project-1',
    start: 5.2,
    end: 6.2,
    type: 'facial',
    category: 'lack-of-smile',
    severity: 'low'
  },
  {
    id: 'event-3',
    projectId: 'project-1',
    start: 6.3,
    end: 7.7,
    type: 'posture',
    category: 'slouching',
    severity: 'high'
  },
  // Additional gesture events
  {
    id: 'event-4',
    projectId: 'project-1',
    start: 10.2,
    end: 11.0,
    type: 'gesture',
    category: 'pointing-excessive',
    severity: 'medium'
  },
  {
    id: 'event-5',
    projectId: 'project-1',
    start: 12.5,
    end: 12.8,
    type: 'posture',
    category: 'head-tilt',
    severity: 'low'
  },
  {
    id: 'event-6',
    projectId: 'project-1',
    start: 30.6,
    end: 32.0,
    type: 'gesture',
    category: 'hands-in-pockets',
    severity: 'high'
  },
  // Additional facial expression events
  {
    id: 'event-7',
    projectId: 'project-1',
    start: 34.2,
    end: 36.0,
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
  // {
  //   id: 'event-10',
  //   projectId: 'project-1',
  //   start: 145.8,
  //   end: 148.4,
  //   type: 'posture',
  //   category: 'leaning-back',
  //   severity: 'low'
  // },
  // {
  //   id: 'event-11',
  //   projectId: 'project-1',
  //   start: 162.3,
  //   end: 165.1,
  //   type: 'gesture',
  //   category: 'repetitive-hand-gestures',
  //   severity: 'high'
  // },
  // // Additional facial expression events
  // {
  //   id: 'event-12',
  //   projectId: 'project-1',
  //   start: 178.9,
  //   end: 181.5,
  //   type: 'facial',
  //   category: 'forced-smile',
  //   severity: 'medium'
  // },
  // {
  //   id: 'event-13',
  //   projectId: 'project-1',
  //   start: 195.2,
  //   end: 197.8,
  //   type: 'facial',
  //   category: 'looking-away',
  //   severity: 'high'
  // }
  
  // Demo project behavior events
  {
    id: 'demo-event-1',
    projectId: 'demo-project',
    start: 2.5,
    end: 3.2,
    type: 'gesture',
    category: 'pointing-excessive',
    severity: 'low'
  },
  {
    id: 'demo-event-2',
    projectId: 'demo-project',
    start: 10.1,
    end: 11.0,
    type: 'posture',
    category: 'slouching',
    severity: 'medium'
  },
  {
    id: 'demo-event-3',
    projectId: 'demo-project',
    start: 15.8,
    end: 16.5,
    type: 'facial',
    category: 'lack-of-smile',
    severity: 'low'
  },
  {
    id: 'demo-event-4',
    projectId: 'demo-project',
    start: 22.3,
    end: 23.1,
    type: 'gesture',
    category: 'fidgeting',
    severity: 'medium'
  },
  {
    id: 'demo-event-5',
    projectId: 'demo-project',
    start: 28.7,
    end: 29.5,
    type: 'posture',
    category: 'leaning-forward',
    severity: 'high'
  },
  {
    id: 'demo-event-6',
    projectId: 'demo-project',
    start: 35.0,
    end: 36.2,
    type: 'facial',
    category: 'eye-contact-poor',
    severity: 'medium'
  }
];

// Mock badge scores
//ActionType : Eye Contact | Body Stability | Head Alignment | Distracting Gestures | Facing away
export const mockBadgeScores: BadgeScore[] = [
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
  },
  // Demo project badge scores
  {
    badgeId: 'smile-consistency',
    projectId: 'demo-project',
    stars: 4,
    totalEvents: 3
  },
  {
    badgeId: 'posture-alignment',
    projectId: 'demo-project',
    stars: 3,
    totalEvents: 5
  },
  {
    badgeId: 'hand-gestures',
    projectId: 'demo-project',
    stars: 3,
    totalEvents: 4
  },
  {
    badgeId: 'eye-contact',
    projectId: 'demo-project',
    stars: 4,
    totalEvents: 2
  }
];

// Mock suggestions
export const mockSuggestions: Suggestion[] = [
  {
    id: 'suggestion-1',
    projectId: 'project-1',
    sectionId: 'section-1',
    type: 'modify',
    suggestedText: 'Good morning, team. I am excited to share our outstanding Q2 sales performance with you today. We not only met our targets but exceeded them by 15%, which represents a significant improvement from last quarter.',
    rationale: 'Using positive emotional language and combining related statements creates a stronger, more confident opening.'
  },
  {
    id: 'suggestion-2',
    projectId: 'project-1',
    sectionId: 'section-2',
    type: 'modify',
    suggestedText: 'Let me highlight the key metrics that drove this exceptional performance. Our conversion rate increased by 8% compared to Q1, while customer acquisition costs decreased by 12%, demonstrating improved efficiency. Most notably, the average deal size grew by 22%, indicating we are successfully attracting higher-value clients.',
    rationale: 'Restructuring for better flow and emphasizing the positive outcomes with stronger connecting words.'
  },
  {
    id: 'suggestion-3',
    projectId: 'project-1',
    sectionId: 'section-3',
    type: 'keep',
    rationale: 'This section effectively presents regional data with clear structure and balanced tone.'
  },
  {
    id: 'suggestion-4',
    projectId: 'project-1',
    sectionId: 'section-4',
    type: 'modify',
    suggestedText: 'While we achieved great success, we also navigated some challenges effectively. Supply chain disruptions initially affected our delivery times, but we proactively addressed this by diversifying our supplier base and implementing new tracking systems for better visibility.',
    rationale: 'Reframing challenges as opportunities demonstrates problem-solving capability and maintains positive momentum.'
  },
  {
    id: 'suggestion-5',
    projectId: 'project-1',
    sectionId: 'section-5',
    type: 'delete',
    rationale: 'The future outlook section, while informative, may be too detailed for this quarterly review. Consider moving these points to a separate strategic planning discussion.'
  },
  // Demo project suggestions
  {
    id: 'demo-suggestion-1',
    projectId: 'demo-project',
    sectionId: 'demo-section-1',
    type: 'modify',
    suggestedText: 'Hello everyone, I am excited to welcome you to our comprehensive product demo. Today I will showcase the groundbreaking features of our innovative platform.',
    rationale: 'Adding emotional language and stronger adjectives creates more engagement and enthusiasm.'
  },
  {
    id: 'demo-suggestion-2',
    projectId: 'demo-project',
    sectionId: 'demo-section-2',
    type: 'keep',
    rationale: 'This section effectively presents the key features with clear structure and good pacing.'
  },
  {
    id: 'demo-suggestion-3',
    projectId: 'demo-project',
    sectionId: 'demo-section-3',
    type: 'modify',
    suggestedText: 'This platform will transform and revolutionize how your team collaborates, leading to increased productivity and innovation.',
    rationale: 'Expanding on the benefits with specific outcomes makes the value proposition stronger.'
  }
];
