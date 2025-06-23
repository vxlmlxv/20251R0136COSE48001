import { User, Project, Video, ScriptSegment, ScriptSection, BehaviorEvent, BadgeScore, Suggestion } from './types';

// Mock user data
export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    locale: 'en-US',
    plan: 'pro'
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
  },
  {
    id: 'project-4',
    userId: 'user-1',
    title: '마케팅 전략 분석 및 발표',
    description: '대학생이 분석한 마케팅 전략과 포인트',
    audience: 'executive',
    formality: 'formal',
    domain: 'marketing',
    status: 'completed',
    createdAt: '2025-06-20T10:15:00Z'
  }
];

// Mock videos
export const mockVideos: Video[] = [
  {
    id: 'video-1',
    projectId: 'project-1',
    url: '/testvideo.mp4',
    duration: 160,
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
  },
  {
    id: 'video-4',
    projectId: 'project-4',
    url: '/testvideo.mp4',
    duration: 37, // Based on actual API analysis duration (37.2s total video)
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

  // Project-4 script segments (Korean presentation)
  {
    id: 'segment-4-1',
    projectId: 'project-4',
    start: 0,
    end: 4.2,
    text: '안녕하세요, 여러분.',
    speechAct: 'statement'
  },
  {
    id: 'segment-4-2',
    projectId: 'project-4',
    start: 4.2,
    end: 8.8,
    text: '오늘은 우리 회사의 새로운 마케팅 전략에 대해 상세히 분석해 보겠습니다.',
    speechAct: 'statement'
  },
  {
    id: 'segment-4-3',
    projectId: 'project-4',
    start: 8.8,
    end: 13.5,
    text: '먼저 현재 시장 동향과 경쟁사 분석을 통해 우리의 위치를 파악해보겠습니다.',
    speechAct: 'statement'
  },
  {
    id: 'segment-4-4',
    projectId: 'project-4',
    start: 13.5,
    end: 18.2,
    text: '그리고 이를 바탕으로 향후 전략 방향을 제시하도록 하겠습니다.',
    speechAct: 'statement'
  },
  {
    id: 'segment-4-5',
    projectId: 'project-4',
    start: 18.2,
    end: 22.8,
    text: '지난 분기 데이터를 보면 디지털 마케팅 채널에서 30% 성장을 기록했습니다.',
    speechAct: 'statement'
  },
  {
    id: 'segment-4-6',
    projectId: 'project-4',
    start: 22.8,
    end: 27.1,
    text: '특히 소셜 미디어 플랫폼에서의 참여도가 크게 향상되었습니다.',
    speechAct: 'emphasis'
  },
  {
    id: 'segment-4-7',
    projectId: 'project-4',
    start: 27.1,
    end: 31.5,
    text: '하지만 전환율 측면에서는 여전히 개선의 여지가 있습니다.',
    speechAct: 'statement'
  },
  {
    id: 'segment-4-8',
    projectId: 'project-4',
    start: 31.5,
    end: 35.8,
    text: '이제 구체적인 개선 방안에 대해 말씀드리겠습니다.',
    speechAct: 'statement'
  },
  {
    id: 'segment-4-9',
    projectId: 'project-4',
    start: 35.8,
    end: 37.0,
    text: '감사합니다.',
    speechAct: 'statement'
  }
];

// Mock script sections
export const mockScriptSections: ScriptSection[] = [
  // ... keeping the existing sections for project-1 ...
  {
    id: 'section-1',
    projectId: 'project-1',
    startTime: 5.2,
    endTime: 23.8,
    sentences: [
      "안녕하세요, 오늘 저희 회사의 새로운 마케팅 전략에 대해 발표하게 되어 기쁩니다.",
      "먼저 현재 시장 상황과 저희가 직면한 과제들을 살펴보겠습니다.",
      "그리고 이를 해결하기 위한 구체적인 방안들을 제시하도록 하겠습니다."
    ]
  },

  // Project-4 comprehensive script sections (Marketing Strategy Analysis)
  {
    id: 'section-4-1',
    projectId: 'project-4',
    startTime: 0,
    endTime: 9.5,
    sentences: [
      "안녕하세요, 여러분.",
      "오늘은 우리 회사의 새로운 마케팅 전략에 대해 상세히 분석해 보겠습니다.",
      "이번 발표를 통해 현재 마케팅 현황과 향후 방향성을 공유하고자 합니다."
    ]
  },
  {
    id: 'section-4-2',
    projectId: 'project-4',
    startTime: 9.5,
    endTime: 18.5,
    sentences: [
      "먼저 현재 시장 동향과 경쟁사 분석을 통해 우리의 위치를 파악해보겠습니다.",
      "그리고 이를 바탕으로 향후 전략 방향을 제시하도록 하겠습니다.",
      "데이터를 중심으로 한 객관적인 분석이 이루어질 예정입니다."
    ]
  },
  {
    id: 'section-4-3',
    projectId: 'project-4',
    startTime: 18.5,
    endTime: 27.5,
    sentences: [
      "지난 분기 데이터를 보면 디지털 마케팅 채널에서 30% 성장을 기록했습니다.",
      "특히 소셜 미디어 플랫폼에서의 참여도가 크게 향상되었습니다.",
      "이는 우리의 콘텐츠 전략이 효과적으로 작동하고 있음을 보여줍니다."
    ]
  },
  {
    id: 'section-4-4',
    projectId: 'project-4',
    startTime: 27.5,
    endTime: 37.0,
    sentences: [
      "하지만 전환율 측면에서는 여전히 개선의 여지가 있습니다.",
      "이제 구체적인 개선 방안에 대해 말씀드리겠습니다.",
      "고객 여정 최적화와 개인화 전략을 통해 전환율을 높일 수 있을 것입니다.",
      "마지막으로 향후 3개월간의 실행 계획을 제시하며 발표를 마치겠습니다.",
      "감사합니다."
    ]
  }
];

// Mock behavior events based on real analysis data
export const mockBehaviorEvents: BehaviorEvent[] = [
  // Project-1 events
  {
    id: 'event-gaze-1',
    projectId: 'project-1',
    timestamp: 9.5,
    start: 9.5,
    end: 11.7,
    type: 'eye-contact',
    category: '시선을 아래로',
    confidence: 0.85,
    description: 'Speaker looking down, avoiding camera contact',
    severity: 'medium'
  },

  // Project-4 events based on real API analysis data
  // Body sway events (좌우로 몸 흔들기) - 10 occurrences from API
  {
    id: 'event-project4-sway-1',
    projectId: 'project-4',
    timestamp: 0, // frame 312 / 30fps
    start: 0.1,
    end: 0.9, // frame 351 / 30fps (0.7s duration)
    type: 'body-stability',
    category: '좌우로 몸 흔들기',
    confidence: 0.85,
    description: 'Side-to-side body swaying detected',
    severity: 'medium'
  },
  {
    id: 'event-project4-sway-2',
    projectId: 'project-4',
    timestamp: 11, // frame 357 / 30fps
    start: 11.0,
    end: 14.3, // frame 432 / 30fps (1.3s duration)
    type: 'body-stability',
    category: '좌우로 몸 흔들기',
    confidence: 0.78,
    description: 'Extended swaying movement',
    severity: 'medium'
  },
  {
    id: 'event-project4-sway-3',
    projectId: 'project-4',
    timestamp: 14.8, // frame 444 / 30fps
    start: 14.8,
    end: 19.2, // frame 576 / 30fps (2.2s duration)
    type: 'body-stability',
    category: '좌우로 몸 흔들기',
    confidence: 0.82,
    description: 'Prolonged body instability',
    severity: 'high'
  },
  {
    id: 'event-project4-sway-4',
    projectId: 'project-4',
    timestamp: 20.9, // frame 627 / 30fps
    start: 20.9,
    end: 29.5, // frame 885 / 30fps (4.3s duration)
    type: 'facing-away',
    category: '뒤돌아 서기',
    confidence: 0.87,
    description: 'Significant swaying episode',
    severity: 'high'
  },
  {
    id: 'event-project4-sway-5',
    projectId: 'project-4',
    timestamp: 33.9, // frame 1017 / 30fps
    start: 33.9,
    end: 36.8, // frame 1104 / 30fps (1.5s duration)
    type: 'body-stability',
    category: '좌우로 몸 흔들기',
    confidence: 0.81,
    description: 'Moderate swaying motion',
    severity: 'medium'
  },
  {
    id: 'event-project4-sway-6',
    projectId: 'project-4',
    timestamp: 37.2, // frame 1116 / 30fps
    start: 37.2,
    end: 39.4, // frame 1182 / 30fps (1.1s duration)
    type: 'body-stability',
    category: '좌우로 몸 흔들기',
    confidence: 0.73,
    description: 'Brief swaying motion',
    severity: 'medium'
  },
  {
    id: 'event-project4-sway-7',
    projectId: 'project-4',
    timestamp: 39.8, // frame 1194 / 30fps
    start: 39.8,
    end: 39.9, // frame 1197 / 30fps (0.1s duration)
    type: 'body-stability',
    category: '좌우로 몸 흔들기',
    confidence: 0.68,
    description: 'Quick body adjustment',
    severity: 'low'
  },
  {
    id: 'event-project4-sway-9',
    projectId: 'project-4',
    timestamp: 41.9, // frame 1257 / 30fps
    start: 41.9,
    end: 42.2, // frame 1266 / 30fps (0.2s duration)
    type: 'body-stability',
    category: '좌우로 몸 흔들기',
    confidence: 0.71,
    description: 'Minimal body movement',
    severity: 'low'
  },
  {
    id: 'event-project4-sway-10',
    projectId: 'project-4',
    timestamp: 44.7, // frame 1341 / 30fps
    start: 44.7,
    end: 57.2, // frame 1716 / 30fps (6.3s duration)
    type: 'body-stability',
    category: '좌우로 몸 흔들기',
    confidence: 0.88,
    description: 'Extended unstable posture',
    severity: 'high'
  }


];

// Mock badge scores based on analysis data
export const mockBadgeScores: BadgeScore[] = [
  // Project-1 badges
  {
    badgeId: 'eye-contact',
    projectId: 'project-1',
    stars: 3,
    totalEvents: 1
  },
  {
    badgeId: 'body-stability',
    projectId: 'project-1',
    stars: 2,
    totalEvents: 5
  },
  {
    badgeId: 'head-posture',
    projectId: 'project-1',
    stars: 2,
    totalEvents: 1
  },
  {
    badgeId: 'self-touching',
    projectId: 'project-1',
    stars: 1,
    totalEvents: 2
  },
  {
    badgeId: 'facing-away',
    projectId: 'project-1',
    stars: 5,
    totalEvents: 0
  },

  // Project-4 badge scores based on real API analysis
  {
    badgeId: 'eye-contact',
    projectId: 'project-4',
    stars: 5,
    totalEvents: 0 // no eye contact issues detected
  },
  {
    badgeId: 'body-stability',
    projectId: 'project-4',
    stars: 1,
    totalEvents: 10 // 10 body sway events detected (18.4s total duration)
  },
  {
    badgeId: 'head-posture',
    projectId: 'project-4',
    stars: 5,
    totalEvents: 0 // no head posture issues detected
  },
  {
    badgeId: 'self-touching',
    projectId: 'project-4',
    stars: 5,
    totalEvents: 0 // no self-touching events detected in this API result
  },
  {
    badgeId: 'facing-away',
    projectId: 'project-4',
    stars: 5,
    totalEvents: 0 // no facing away events detected
  }
];

// Mock suggestions
export const mockSuggestions: Suggestion[] = [
  // Project-1 suggestions
  {
    id: 'suggestion-1',
    projectId: 'project-1',
    sectionId: 'section-1',
    type: 'modify',
    category: 'audience-formality',
    suggestedText: "안녕하십니까, 오늘 귀중한 시간을 내어 참석해 주신 여러분께 진심으로 감사드립니다. 저희가 준비한 혁신적인 마케팅 전략을 소개하게 되어 영광입니다.",
    rationale: "더 격식 있고 전문적인 인사말로 변경하여 청중에게 좋은 첫인상을 줄 수 있습니다. 감사 인사를 추가하면 청중과의 유대감을 형성할 수 있습니다."
  },

  // Project-4 comprehensive suggestions based on body language analysis and script optimization
  {
    id: 'suggestion-4-1',
    projectId: 'project-4',
    sectionId: 'section-4-1',
    type: 'modify',
    category: 'delivery',
    suggestedText: "안녕하세요, 여러분. 오늘은 우리 회사의 혁신적인 마케팅 전략에 대해 체계적으로 분석해 보겠습니다. 이번 발표를 통해 현재 마케팅 현황과 데이터 기반의 향후 방향성을 명확히 공유하고자 합니다.",
    rationale: "발표 초반(10-11초)의 신체 불안정성을 고려하여 더 자신감 있는 표현으로 수정했습니다. '상세히'보다 '체계적으로', '새로운'보다 '혁신적인' 등 강한 어조를 사용하여 발표자의 확신을 높였습니다."
  },
  {
    id: 'suggestion-4-2',
    projectId: 'project-4',
    sectionId: 'section-4-2',
    type: 'modify',
    category: 'delivery',
    suggestedText: "먼저 현재 시장 동향과 경쟁사 심층 분석을 통해 우리의 전략적 위치를 명확히 파악해보겠습니다. 그리고 이를 바탕으로 데이터 기반의 구체적인 향후 전략 방향을 제시하도록 하겠습니다. 객관적이고 실용적인 분석이 이루어질 예정입니다.",
    rationale: "발표 중반(11-19초)의 지속적인 몸 흔들림을 고려하여 내용을 더욱 구체화하고 전문적으로 표현했습니다. '심층 분석', '전략적 위치', '데이터 기반' 등의 용어로 발표자의 전문성을 강조했습니다."
  },
  {
    id: 'suggestion-4-3',
    projectId: 'project-4',
    sectionId: 'section-4-3',
    type: 'modify',
    category: 'delivery',
    suggestedText: "지난 분기 실적을 보면 디지털 마케팅 채널에서 놀라운 30% 성장을 달성했습니다. 특히 소셜 미디어 플랫폼에서의 고객 참여도가 전년 대비 두 배 이상 향상되었습니다. 이는 우리의 혁신적인 콘텐츠 전략이 시장에서 매우 효과적으로 작동하고 있음을 명확히 보여줍니다.",
    rationale: "발표 후반(20-29초)의 가장 심각한 몸 흔들림 구간이므로, 성과를 더욱 강조하여 발표자의 자신감을 높이고 긴장을 완화할 수 있도록 수정했습니다. '놀라운', '달성', '혁신적인' 등 긍정적 용어를 사용했습니다."
  },
  {
    id: 'suggestion-4-4',
    projectId: 'project-4',
    sectionId: 'section-4-4',
    type: 'modify',
    category: 'delivery',
    suggestedText: "물론 전환율 측면에서는 추가적인 최적화 기회가 있다고 판단됩니다. 이제 이러한 기회를 활용한 구체적인 혁신 방안에 대해 말씀드리겠습니다. 고객 여정 최적화와 AI 기반 개인화 전략을 통해 전환율을 획기적으로 개선할 수 있을 것입니다. 마지막으로 향후 3개월간의 체계적인 실행 계획과 성과 지표를 제시하며 발표를 마치겠습니다. 여러분의 귀중한 시간에 감사드립니다.",
    rationale: "발표 마무리 구간(27-37초)의 지속적인 신체 불안정성을 고려하여 긍정적이고 미래지향적인 표현으로 마무리했습니다. '개선의 여지'를 '최적화 기회'로, '구체적인 개선 방안'을 '혁신 방안'으로 바꿔 더 적극적인 어조를 만들었습니다."
  },
  {
    id: 'suggestion-4-5',
    projectId: 'project-4',
    sectionId: 'section-4-1',
    type: 'modify',
    category: 'delivery',
    suggestedText: "발표를 시작하기 전에 잠시 심호흡을 하시고, 어깨를 펴고 안정적인 자세를 취해보세요. 안녕하세요, 여러분.",
    rationale: "API 분석 결과 발표 전반에 걸쳐 지속적인 몸 흔들림(18.4초간)이 감지되었습니다. 발표 시작 전 몸의 중심을 잡는 것이 중요합니다."
  },
  {
    id: 'suggestion-4-6',
    projectId: 'project-4',
    sectionId: 'section-4-2',
    type: 'modify',
    category: 'delivery',
    suggestedText: "이 부분에서는 슬라이드나 자료를 가리키며 청중의 시선을 집중시키는 것이 효과적입니다. 먼저 현재 시장 동향과 경쟁사 심층 분석을 통해 우리의 전략적 위치를 명확히 파악해보겠습니다.",
    rationale: "11-19초 구간에서 몸 흔들림이 지속되므로, 손과 팔의 의도적인 움직임을 통해 몸의 안정성을 확보할 수 있습니다."
  },
  {
    id: 'suggestion-4-7',
    projectId: 'project-4',
    sectionId: 'section-4-3',
    type: 'modify',
    category: 'delivery',
    suggestedText: "성과 수치를 발표할 때는 잠시 멈춤을 두어 청중이 내용을 소화할 시간을 주세요. 지난 분기 실적을 보면 디지털 마케팅 채널에서 놀라운 30% 성장을 달성했습니다.",
    rationale: "20-29초 구간의 심각한 몸 흔들림을 완화하기 위해 의도적인 정지 시간을 두어 몸의 균형을 다시 잡을 수 있습니다."
  },
  {
    id: 'suggestion-4-8',
    projectId: 'project-4',
    sectionId: 'section-4-4',
    type: 'modify',
    category: 'delivery',
    suggestedText: "마무리 단계에서는 발을 어깨 너비로 벌리고 중심을 잡아 안정감 있게 마무리하세요. 물론 전환율 측면에서는 추가적인 최적화 기회가 있다고 판단됩니다.",
    rationale: "발표 후반부(33-57초)에 여러 차례 몸 흔들림이 감지되므로, 의식적으로 안정적인 자세를 유지하는 것이 필요합니다."
  }
];
