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
  }
];

// Mock videos
export const mockVideos: Video[] = [
  {
    id: 'video-1',
    projectId: 'project-1',
    url: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
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
  }
];

// Mock behavior events
export const mockBehaviorEvents: BehaviorEvent[] = [
  {
    id: 'event-1',
    projectId: 'project-1',
    timestamp: 10.2,
    start: 10.2,
    end: 12.5,
    type: 'eye-contact',
    category: 'looking-away',
    confidence: 0.85,
    description: 'Speaker avoids eye contact with camera',
    severity: 'medium'
  },
  {
    id: 'event-2',
    projectId: 'project-1',
    timestamp: 18.7,
    start: 18.7,
    end: 21.3,
    type: 'body-stability',
    category: 'swaying-side-to-side',
    confidence: 0.72,
    description: 'Noticeable side-to-side body movement',
    severity: 'low'
  },
  {
    id: 'event-3',
    projectId: 'project-1',
    timestamp: 28.5,
    start: 28.5,
    end: 31.0,
    type: 'head-posture',
    category: 'head-tilting',
    confidence: 0.68,
    description: 'Frequent head tilting motion',
    severity: 'high'
  },
  {
    id: 'event-4',
    projectId: 'project-1',
    timestamp: 45.2,
    start: 45.2,
    end: 47.8,
    type: 'self-touching',
    category: 'face-scratching',
    confidence: 0.89,
    description: 'Speaker scratches face/head area',
    severity: 'medium'
  },
  {
    id: 'event-5',
    projectId: 'project-1',
    timestamp: 62.1,
    start: 62.1,
    end: 64.5,
    type: 'facing-away',
    category: 'turning-around',
    confidence: 0.76,
    description: 'Speaker turns away from camera',
    severity: 'low'
  },
  {
    id: 'event-6',
    projectId: 'project-1',
    timestamp: 78.3,
    start: 78.3,
    end: 81.2,
    type: 'body-stability',
    category: 'dropping-down',
    confidence: 0.65,
    description: 'Noticeable downward body movement',
    severity: 'high'
  },
  {
    id: 'event-7',
    projectId: 'project-1',
    timestamp: 95.7,
    start: 95.7,
    end: 98.1,
    type: 'eye-contact',
    category: 'avoiding-camera',
    confidence: 0.82,
    description: 'Poor eye contact with camera',
    severity: 'medium'
  },
  {
    id: 'event-8',
    projectId: 'project-1',
    timestamp: 112.4,
    start: 112.4,
    end: 115.0,
    type: 'self-touching',
    category: 'head-scratching',
    confidence: 0.73,
    description: 'Speaker touches head frequently',
    severity: 'high'
  },
  {
    id: 'event-9',
    projectId: 'project-1',
    timestamp: 128.6,
    start: 128.6,
    end: 131.2,
    type: 'head-posture',
    category: 'excessive-tilting',
    confidence: 0.79,
    description: 'Excessive head tilting behavior',
    severity: 'medium'
  },
  {
    id: 'event-10',
    projectId: 'project-1',
    timestamp: 145.8,
    start: 145.8,
    end: 148.4,
    type: 'facing-away',
    category: 'side-profile',
    confidence: 0.84,
    description: 'Speaker faces away showing side profile',
    severity: 'low'
  },
  {
    id: 'event-11',
    projectId: 'project-1',
    timestamp: 162.3,
    start: 162.3,
    end: 165.1,
    type: 'body-stability',
    category: 'unstable-stance',
    confidence: 0.71,
    description: 'Unstable body positioning',
    severity: 'high'
  },
  {
    id: 'event-12',
    projectId: 'project-1',
    timestamp: 178.9,
    start: 178.9,
    end: 181.5,
    type: 'self-touching',
    category: 'face-touching',
    confidence: 0.88,
    description: 'Frequent face touching behavior',
    severity: 'medium'
  },
  {
    id: 'event-13',
    projectId: 'project-1',
    timestamp: 195.2,
    start: 195.2,
    end: 197.8,
    type: 'eye-contact',
    category: 'distracted-gaze',
    confidence: 0.77,
    description: 'Distracted eye movement pattern',
    severity: 'high'
  }
];

// Mock badge scores
export const mockBadgeScores: BadgeScore[] = [
  {
    badgeId: 'eye-contact',
    projectId: 'project-1',
    stars: 3,
    totalEvents: 8
  },
  {
    badgeId: 'body-stability',
    projectId: 'project-1',
    stars: 2,
    totalEvents: 12
  },
  {
    badgeId: 'head-posture',
    projectId: 'project-1',
    stars: 4,
    totalEvents: 5
  },
  {
    badgeId: 'self-touching',
    projectId: 'project-1',
    stars: 5,
    totalEvents: 2
  },
  {
    badgeId: 'facing-away',
    projectId: 'project-1',
    stars: 3,
    totalEvents: 6
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
  }
];
