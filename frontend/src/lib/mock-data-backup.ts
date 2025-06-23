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
    title: '마케팅 전략 발표',
    description: '분기별 성과 리뷰와 새로운 마케팅 전략 제안',
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
    title: 'Marketing Strategy Analysis',
    description: 'Comprehensive analysis using real AI body language detection',
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
    duration: 160, // Approximate duration for testvideo.mp4 (need to verify actual duration)
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
    duration: 160, // Based on real testvideo.mp4 duration
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
  }
];

// Mock script sections
export const mockScriptSections: ScriptSection[] = [
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
  {
    id: 'section-2',
    projectId: 'project-1',
    startTime: 24.1,
    endTime: 45.7,
    sentences: [
      "최근 3년간 우리 업계의 디지털 전환이 급속도로 진행되고 있습니다.",
      "특히 모바일 커머스 시장이 전년 대비 35% 성장하며 새로운 기회를 창출하고 있습니다.",
      "하지만 동시에 경쟁이 치열해지면서 기존 마케팅 방식의 한계가 드러나고 있습니다."
    ]
  },
  {
    id: 'section-3',
    projectId: 'project-1',
    startTime: 46.3,
    endTime: 68.9,
    sentences: [
      "이러한 변화에 대응하기 위해 저희는 3단계 전략을 수립했습니다.",
      "첫 번째는 데이터 기반의 개인화된 마케팅 시스템 구축입니다.",
      "두 번째는 소셜 미디어 플랫폼을 활용한 브랜드 스토리텔링 강화입니다."
    ]
  },
  {
    id: 'section-4',
    projectId: 'project-1',
    startTime: 69.4,
    endTime: 92.1,
    sentences: [
      "마지막으로 인플루언서 마케팅과 콘텐츠 마케팅의 통합 운영입니다.",
      "이 전략들을 통해 향후 12개월 내 브랜드 인지도 40% 향상을 목표로 하고 있습니다.",
      "또한 고객 참여도를 50% 이상 증가시킬 계획입니다."
    ]
  },
  {
    id: 'section-5',
    projectId: 'project-1',
    startTime: 92.8,
    endTime: 115.6,
    sentences: [
      "구체적인 실행 계획을 말씀드리면, 먼저 AI 기반 고객 분석 도구를 도입할 예정입니다.",
      "이를 통해 고객의 구매 패턴과 선호도를 정확히 파악하여 맞춤형 캠페인을 진행하겠습니다.",
      "동시에 크리에이티브 팀과 데이터 분석팀 간의 협업 체계를 강화하겠습니다."
    ]
  },
  {
    id: 'section-6',
    projectId: 'project-1',
    startTime: 116.2,
    endTime: 138.4,
    sentences: [
      "예산 배분에 대해서도 말씀드리겠습니다.",
      "전체 마케팅 예산의 40%를 디지털 채널에 집중 투자하고,",
      "나머지 60%는 기존 오프라인 채널의 효율성 개선에 사용하겠습니다."
    ]
  },
  {
    id: 'section-7',
    projectId: 'project-1',
    startTime: 139.1,
    endTime: 161.8,
    sentences: [
      "성과 측정을 위한 KPI도 새롭게 설정했습니다.",
      "매월 브랜드 인지도, 고객 획득 비용, 생애 가치 등을 종합적으로 분석하여",
      "전략의 효과성을 지속적으로 모니터링하겠습니다."
    ]
  },
  {
    id: 'section-8',
    projectId: 'project-1',
    startTime: 162.5,
    endTime: 180.3,
    sentences: [
      "마지막으로 이 모든 계획이 성공적으로 실행된다면",
      "올해 말까지 시장 점유율 5% 증가와 매출 20% 성장을 달성할 수 있을 것으로 예상됩니다.",
      "감사합니다. 질문이 있으시면 언제든 말씀해 주세요."
    ]
  },

  // Project-4 script sections (Marketing Strategy Analysis with real testvideo.mp4)
  {
    id: 'section-4-1',
    projectId: 'project-4',
    startTime: 0,
    endTime: 18.5,
    sentences: [
      "안녕하세요, 여러분. 오늘은 우리 회사의 새로운 마케팅 전략에 대해 상세히 분석해 보겠습니다.",
      "먼저 현재 시장 동향과 경쟁사 분석을 통해 우리의 위치를 파악해보겠습니다.",
      "그리고 이를 바탕으로 향후 전략 방향을 제시하도록 하겠습니다."
    ]
  },
  {
    id: 'section-4-2',
    projectId: 'project-4',
    startTime: 18.5,
    endTime: 35.2,
    sentences: [
      "지난 분기 데이터를 보면 디지털 마케팅 채널에서 30% 성장을 기록했습니다.",
      "특히 소셜 미디어 플랫폼에서의 참여도가 크게 향상되었습니다.",
      "하지만 전환율 측면에서는 여전히 개선의 여지가 있습니다."
    ]
  },
  {
    id: 'section-4-3',
    projectId: 'project-4',
    startTime: 35.2,
    endTime: 52.8,
    sentences: [
      "이러한 분석 결과를 바탕으로 세 가지 핵심 개선 방안을 도출했습니다.",
      "첫째, 개인화된 콘텐츠 전략을 통한 고객 경험 향상입니다.",
      "둘째, 데이터 기반 타겟팅으로 광고 효율성을 극대화하겠습니다."
    ]
  },
  {
    id: 'section-4-4',
    projectId: 'project-4',
    startTime: 52.8,
    endTime: 68.9,
    sentences: [
      "셋째, 옴니채널 접근을 통해 고객 여정 전반에 걸친 일관성을 확보하겠습니다.",
      "이 전략들을 통해 다음 분기까지 ROI 25% 향상을 목표로 하고 있습니다.",
      "또한 브랜드 인지도도 15% 이상 개선할 계획입니다."
    ]
  },
  {
    id: 'section-4-5',
    projectId: 'project-4',
    startTime: 68.9,
    endTime: 85.3,
    sentences: [
      "구체적인 실행 계획을 말씀드리면, AI 기반 고객 분석 시스템을 도입할 예정입니다.",
      "이를 통해 실시간으로 고객 행동을 분석하고 맞춤형 캠페인을 자동화하겠습니다.",
      "동시에 크로스 플랫폼 데이터 통합으로 360도 고객 뷰를 구축하겠습니다."
    ]
  },
  {
    id: 'section-4-6',
    projectId: 'project-4',
    startTime: 85.3,
    endTime: 102.1,
    sentences: [
      "예산 배분에 있어서는 전체 마케팅 예산의 55%를 디지털에 집중하겠습니다.",
      "나머지 45%는 오프라인 채널의 효율성 개선과 브랜드 경험 향상에 투자하겠습니다.",
      "특히 고객 생애 가치(LTV) 증대에 중점을 두고 장기적 관점으로 접근하겠습니다."
    ]
  },
  {
    id: 'section-4-7',
    projectId: 'project-4',
    startTime: 102.1,
    endTime: 118.7,
    sentences: [
      "성과 측정을 위해 새로운 KPI 체계를 구축했습니다.",
      "고객 획득 비용, 전환율, 리텐션율을 주요 지표로 설정하고",
      "매주 성과를 모니터링하여 신속한 최적화를 진행하겠습니다."
    ]
  },
  {
    id: 'section-4-8',
    projectId: 'project-4',
    startTime: 118.7,
    endTime: 135.5,
    sentences: [
      "경쟁사 대비 우리의 차별화 포인트는 데이터 활용 능력입니다.",
      "머신러닝 알고리즘을 통해 예측 마케팅을 구현하고",
      "고객의 니즈를 선제적으로 파악하여 맞춤형 솔루션을 제공하겠습니다."
    ]
  },
  {
    id: 'section-4-9',
    projectId: 'project-4',
    startTime: 135.5,
    endTime: 152.3,
    sentences: [
      "위험 요소와 대응 방안도 미리 준비했습니다.",
      "시장 변동성에 대비해 유연한 예산 조정 체계를 마련했고",
      "A/B 테스트를 통해 지속적으로 전략을 개선해 나가겠습니다."
    ]
  },
  {
    id: 'section-4-10',
    projectId: 'project-4',
    startTime: 152.3,
    endTime: 160,
    sentences: [
      "결론적으로, 이번 마케팅 전략은 데이터 기반의 과학적 접근과",
      "창의적 콘텐츠의 조화를 통해 지속 가능한 성장을 추진하겠습니다.",
      "여러분의 적극적인 지원과 협조를 부탁드립니다. 감사합니다."
    ]
  }
];

// Mock behavior events based on real analysis data
export const mockBehaviorEvents: BehaviorEvent[] = [
  // Gaze down events
  {
    id: 'event-gaze-1',
    projectId: 'project-1',
    timestamp: 9.5, // frame 285 / 30fps
    start: 9.5,
    end: 11.7, // frame 351 / 30fps
    type: 'eye-contact',
    category: '시선을 아래로',
    confidence: 0.85,
    description: 'Speaker looking down, avoiding camera contact',
    severity: 'medium'
  },
  
  // Body sway events
  {
    id: 'event-sway-1',
    projectId: 'project-1',
    timestamp: 0.1, // frame 3 / 30fps
    start: 0.1,
    end: 0.1,
    type: 'body-stability',
    category: '좌우로 몸 흔들기',
    confidence: 0.72,
    description: 'Brief side-to-side body movement',
    severity: 'low'
  },
  {
    id: 'event-sway-2',
    projectId: 'project-1',
    timestamp: 0.3, // frame 9 / 30fps
    start: 0.3,
    end: 5.9, // frame 177 / 30fps
    type: 'body-stability',
    category: '좌우로 몸 흔들기',
    confidence: 0.78,
    description: 'Extended period of side-to-side swaying',
    severity: 'high'
  },
  {
    id: 'event-sway-3',
    projectId: 'project-1',
    timestamp: 6.2, // frame 186 / 30fps
    start: 6.2,
    end: 6.7, // frame 201 / 30fps
    type: 'body-stability',
    category: '좌우로 몸 흔들기',
    confidence: 0.65,
    description: 'Short swaying motion',
    severity: 'medium'
  },
  {
    id: 'event-sway-4',
    projectId: 'project-1',
    timestamp: 31.2, // frame 936 / 30fps
    start: 31.2,
    end: 31.3, // frame 939 / 30fps
    type: 'body-stability',
    category: '좌우로 몸 흔들기',
    confidence: 0.68,
    description: 'Brief body sway',
    severity: 'low'
  },
  {
    id: 'event-sway-5',
    projectId: 'project-1',
    timestamp: 31.6, // frame 948 / 30fps
    start: 31.6,
    end: 33.9, // frame 1017 / 30fps
    type: 'eye-contact',
    category: '시선을 아래로',
    confidence: 0.74,
    description: 'Noticeable swaying movement',
    severity: 'medium'
  },
  
  // Head tilt events
  {
    id: 'event-tilt-1',
    projectId: 'project-1',
    timestamp: 31.7, // frame 951 / 30fps
    start: 31.7,
    end: 39.5, // frame 1185 / 30fps
    type: 'head-posture',
    category: '고개 기울이기',
    confidence: 0.82,
    description: 'Extended period of head tilting',
    severity: 'high'
  },
  

  {
    id: 'event-face-2',
    projectId: 'project-1',
    timestamp: 24.8, // frame 744 / 30fps
    start: 24.8,
    end: 29.1, // frame 873 / 30fps
    type: 'self-touching',
    category: '머리나 얼굴 긁기',
    confidence: 0.86,
    description: 'Continued face/head touching behavior',
    severity: 'high'
  },

  // Project-4 events based on real API analysis data
  // Body sway events (좌우로 몸 흔들기) - 10 occurrences
  {
    id: 'event-project4-sway-1',
    projectId: 'project-4',
    timestamp: 10.4, // frame 312 / 30fps
    start: 10.4,
    end: 11.7, // frame 351 / 30fps
    type: 'body-stability',
    category: '좌우로 몸 흔들기',
    confidence: 0.85,
    description: 'Side-to-side body swaying detected',
    severity: 'medium'
  },
  {
    id: 'event-project4-sway-2',
    projectId: 'project-4',
    timestamp: 11.9, // frame 357 / 30fps
    start: 11.9,
    end: 14.4, // frame 432 / 30fps
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
    end: 19.2, // frame 576 / 30fps
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
    end: 29.5, // frame 885 / 30fps
    type: 'body-stability',
    category: '좌우로 몸 흔들기',
    confidence: 0.87,
    description: 'Significant swaying episode',
    severity: 'high'
  },
  {
    id: 'event-project4-sway-5',
    projectId: 'project-4',
    timestamp: 33.9, // frame 1017 / 30fps
    start: 33.9,
    end: 36.8, // frame 1104 / 30fps
    type: 'body-stability',
    category: '좌우로 몸 흔들기',
    confidence: 0.75,
    description: 'Moderate body movement',
    severity: 'medium'
  },
  {
    id: 'event-project4-sway-6',
    projectId: 'project-4',
    timestamp: 37.2, // frame 1116 / 30fps
    start: 37.2,
    end: 39.4, // frame 1182 / 30fps
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
    end: 39.9, // frame 1197 / 30fps
    type: 'body-stability',
    category: '좌우로 몸 흔들기',
    confidence: 0.68,
    description: 'Quick body adjustment',
    severity: 'low'
  },
  {
    id: 'event-project4-sway-8',
    projectId: 'project-4',
    timestamp: 40.2, // frame 1206 / 30fps
    start: 40.2,
    end: 41.8, // frame 1254 / 30fps
    type: 'body-stability',
    category: '좌우로 몸 흔들기',
    confidence: 0.79,
    description: 'Short swaying period',
    severity: 'medium'
  },
  {
    id: 'event-project4-sway-9',
    projectId: 'project-4',
    timestamp: 41.9, // frame 1257 / 30fps
    start: 41.9,
    end: 42.2, // frame 1266 / 30fps
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
    end: 57.2, // frame 1716 / 30fps
    type: 'body-stability',
    category: '좌우로 몸 흔들기',
    confidence: 0.88,
    description: 'Extended unstable posture',
    severity: 'high'
  },

  // Head/face scratching event (머리나 얼굴 긁기) - 1 long occurrence
  {
    id: 'event-project4-scratch-1',
    projectId: 'project-4',
    timestamp: 0.1, // frame 3 / 30fps
    start: 0.1,
    end: 37.8, // frame 1134 / 30fps
    type: 'self-touching',
    category: '머리나 얼굴 긁기',
    confidence: 0.91,
    description: 'Continuous head and face touching behavior throughout presentation',
    severity: 'high'
  }
];

// Mock badge scores based on analysis data
export const mockBadgeScores: BadgeScore[] = [
  {
    badgeId: 'eye-contact',
    projectId: 'project-1',
    stars: 3,
    totalEvents: 1 // gaze_down events
  },
  {
    badgeId: 'body-stability',
    projectId: 'project-1',
    stars: 2,
    totalEvents: 5 // body_sway events
  },
  {
    badgeId: 'head-posture',
    projectId: 'project-1',
    stars: 2,
    totalEvents: 1 // head_tilt events
  },
  {
    badgeId: 'self-touching',
    projectId: 'project-1',
    stars: 1,
    totalEvents: 2 // hand_on_face events
  },
  {
    badgeId: 'facing-away',
    projectId: 'project-1',
    stars: 5,
    totalEvents: 0 // no facing away events detected
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
    totalEvents: 10 // 10 body sway events detected
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
    stars: 1,
    totalEvents: 1 // 1 long head/face scratching event
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
  {
    id: 'suggestion-1',
    projectId: 'project-1',
    sectionId: 'section-1',
    type: 'modify',
    category: 'audience-formality',
    suggestedText: "안녕하십니까, 오늘 귀중한 시간을 내어 참석해 주신 여러분께 진심으로 감사드립니다. 저희가 준비한 혁신적인 마케팅 전략을 소개하게 되어 영광입니다.",
    rationale: "더 격식 있고 전문적인 인사말로 변경하여 청중에게 좋은 첫인상을 줄 수 있습니다. 감사 인사를 추가하면 청중과의 유대감을 형성할 수 있습니다."
  },
  {
    id: 'suggestion-2',
    projectId: 'project-1',
    sectionId: 'section-2',
    type: 'modify',
    category: 'clarity',
    suggestedText: "지난 3년간 우리 업계는 급격한 디지털 전환을 경험했습니다. 특히 모바일 커머스 시장은 전년 대비 35% 성장하며 새로운 비즈니스 기회를 창출했습니다. 그러나 이러한 성장과 함께 경쟁이 심화되면서 전통적인 마케팅 접근법의 한계가 명확해졌습니다.",
    rationale: "시간 표현을 명확히 하고 '급속도로'를 '급격한'으로 바꿔 더 간결하게 표현했습니다. 또한 논리적 흐름을 개선하여 청중의 이해를 돕습니다."
  },
  {
    id: 'suggestion-3',
    projectId: 'project-1',
    sectionId: 'section-3',
    type: 'modify',
    category: 'delivery',
    suggestedText: "이러한 도전에 효과적으로 대응하기 위해 저희는 체계적인 3단계 전략을 개발했습니다. 첫째, 고객 데이터 분석을 통한 개인화 마케팅 시스템 구축, 둘째, 소셜 미디어를 활용한 브랜드 스토리텔링 강화입니다.",
    rationale: "번호를 명확히 나열하여 구조를 개선하고, '수립'보다는 '개발'이라는 더 적극적인 표현을 사용했습니다. 청중이 따라가기 쉽도록 순서를 명확히 했습니다."
  },
  {
    id: 'suggestion-4',
    projectId: 'project-1',
    sectionId: 'section-4',
    type: 'modify',
    category: 'clarity',
    suggestedText: "셋째, 인플루언서 마케팅과 콘텐츠 마케팅의 전략적 통합입니다. 이 세 가지 핵심 전략을 통해 향후 12개월 내 브랜드 인지도 40% 향상과 고객 참여도 50% 증가라는 구체적인 목표를 달성하겠습니다.",
    rationale: "세 번째 전략을 명확히 언급하고, 목표를 하나의 문장으로 통합하여 임팩트를 높였습니다. 구체적인 수치를 강조하여 신뢰성을 향상시켰습니다."
  },
  {
    id: 'suggestion-5',
    projectId: 'project-1',
    sectionId: 'section-5',
    type: 'modify',
    category: 'audience-formality',
    suggestedText: "실행 방안을 구체적으로 살펴보겠습니다. 1단계로 AI 기반 고객 행동 분석 플랫폼을 도입하여 고객의 구매 패턴과 선호도를 정밀하게 분석할 예정입니다. 동시에 크리에이티브 팀과 데이터 분석팀 간의 유기적인 협업 시스템을 구축하겠습니다.",
    rationale: "더 전문적인 어조로 수정하고, '도구'보다는 '플랫폼'이라는 더 포괄적인 용어를 사용했습니다. 실행 단계를 명확히 구분하여 체계적인 접근을 강조했습니다."
  },
  {
    id: 'suggestion-6',
    projectId: 'project-1',
    sectionId: 'section-6',
    type: 'modify',
    category: 'delivery',
    suggestedText: "투자 전략을 말씀드리겠습니다. 전체 마케팅 예산을 전략적으로 배분하여, 40%는 고성장 디지털 채널에 집중 투자하고, 60%는 기존 오프라인 채널의 ROI 최적화에 활용하겠습니다.",
    rationale: "'예산 배분'보다는 '투자 전략'이라는 더 적극적인 표현을 사용하고, ROI라는 비즈니스 용어를 추가하여 전문성을 높였습니다. 문장을 하나로 통합하여 흐름을 개선했습니다."
  },
  {
    id: 'suggestion-7',
    projectId: 'project-1',
    sectionId: 'section-7',
    type: 'modify',
    category: 'clarity',
    suggestedText: "성과 측정을 위한 핵심 성과 지표(KPI)를 새롭게 정의했습니다. 브랜드 인지도, 고객 획득 비용(CAC), 고객 생애 가치(LTV) 등을 매월 종합 분석하여 전략의 효과성을 실시간으로 모니터링하고 최적화하겠습니다.",
    rationale: "전문 용어의 영문 약어를 추가하여 비즈니스 전문성을 높이고, '지속적으로'보다는 '실시간으로'라는 더 구체적인 표현을 사용했습니다. 최적화 과정도 추가하여 완성도를 높였습니다."
  },
  {
    id: 'suggestion-8',
    projectId: 'project-1',
    sectionId: 'section-8',
    type: 'modify',
    category: 'audience-formality',
    suggestedText: "결론적으로, 제시된 전략이 성공적으로 실행된다면 올해 말까지 시장 점유율 5% 증가와 매출 20% 성장이라는 목표를 달성할 것으로 확신합니다. 여러분의 관심과 지원에 다시 한 번 감사드리며, 궁금한 점이 있으시면 언제든 질문해 주시기 바랍니다.",
    rationale: "결론 부분을 더 확신에 찬 어조로 수정하고, 청중에 대한 감사 인사를 추가했습니다. 질문 유도 부분도 더 정중한 표현으로 개선하여 전체적인 마무리를 강화했습니다."
  },

  // Project-4 suggestions based on body language analysis results
  {
    id: 'suggestion-4-1',
    projectId: 'project-4',
    sectionId: 'section-4-1',
    type: 'modify',
    category: 'delivery',
    suggestedText: "안녕하세요, 여러분. 오늘은 우리 회사의 혁신적인 마케팅 전략에 대해 체계적으로 분석해 보겠습니다. 먼저 현재 시장 동향과 경쟁사 분석을 통해 우리의 전략적 위치를 명확히 파악해보겠습니다. 그리고 이를 바탕으로 데이터 기반의 향후 전략 방향을 제시하도록 하겠습니다.",
    rationale: "발표 초반의 신체 불안정성을 고려하여 더 자신감 있는 표현으로 수정했습니다. '상세히'보다 '체계적으로', '새로운'보다 '혁신적인' 등 강한 어조를 사용하여 발표자의 확신을 높였습니다."
  },
  {
    id: 'suggestion-4-2',
    projectId: 'project-4',
    sectionId: 'section-4-2',
    type: 'modify',
    category: 'delivery',
    suggestedText: "지난 분기 실적을 보면 디지털 마케팅 채널에서 놀라운 30% 성장을 달성했습니다. 특히 소셜 미디어 플랫폼에서의 고객 참여도가 전년 대비 두 배 이상 향상되었습니다. 물론 전환율 측면에서는 추가적인 최적화 기회가 있다고 판단됩니다.",
    rationale: "신체 접촉 행동이 감지된 구간이므로, 성과를 더욱 강조하여 발표자의 자신감을 높이고 긴장을 완화할 수 있도록 수정했습니다. '크게 향상'을 구체적 수치로, '개선의 여지'를 '최적화 기회'로 긍정적으로 표현했습니다."
  },
  {
    id: 'suggestion-4-3',
    projectId: 'project-4',
    sectionId: 'section-4-3',
    type: 'modify',
    category: 'clarity',
    suggestedText: "이러한 심층 분석 결과를 바탕으로 세 가지 게임체인징 전략을 수립했습니다. 첫째, AI 기반 개인화 콘텐츠로 고객 경험을 혁신하겠습니다. 둘째, 정밀한 데이터 타겟팅으로 마케팅 ROI를 극대화하겠습니다.",
    rationale: "몸의 흔들림이 많이 감지된 구간이므로, 더 명확하고 강력한 표현을 사용하여 발표 내용에 집중할 수 있도록 했습니다. '핵심 개선 방안'을 '게임체인징 전략'으로 업그레이드했습니다."
  },
  {
    id: 'suggestion-4-4',
    projectId: 'project-4',
    sectionId: 'section-4-4',
    type: 'modify',
    category: 'delivery',
    suggestedText: "셋째, 완벽한 옴니채널 경험을 구현하여 고객 여정의 모든 터치포인트에서 일관성을 보장하겠습니다. 이 혁신적 전략들을 통해 다음 분기까지 ROI 25% 향상이라는 도전적 목표를 반드시 달성하겠습니다. 또한 브랜드 인지도 역시 15% 이상 끌어올리겠습니다.",
    rationale: "계속되는 신체 불안정성에 대응하여 더 결정적이고 확신에 찬 표현으로 수정했습니다. '확보'를 '보장', '목표로 하고 있습니다'를 '반드시 달성하겠습니다'로 강화했습니다."
  },
  {
    id: 'suggestion-4-5',
    projectId: 'project-4',
    sectionId: 'section-4-8',
    type: 'modify',
    category: 'delivery',
    suggestedText: "경쟁사 대비 우리의 결정적 차별화 요소는 압도적인 데이터 활용 역량입니다. 최첨단 머신러닝 알고리즘을 통해 예측 마케팅을 완벽히 구현하고, 고객의 잠재 니즈까지 선제적으로 발굴하여 맞춤형 솔루션을 제공하겠습니다.",
    rationale: "발표 후반부까지 이어지는 신체 행동을 고려하여 경쟁 우위를 더욱 강조하는 방향으로 수정했습니다. '차별화 포인트'를 '결정적 차별화 요소'로, '능력'을 '역량'으로 격상하여 자신감을 표현했습니다."
  }
];
