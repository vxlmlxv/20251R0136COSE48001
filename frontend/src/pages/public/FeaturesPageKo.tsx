import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const FeaturesPageKo = () => {
  const { t, i18n } = useTranslation();
  
  // Force Korean language for this component
  if (i18n.language !== 'ko') {
    i18n.changeLanguage('ko');
  }
  
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-cloud">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">{t('features.title')}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>
      </section>

      {/* Feature sections */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Feature 1 */}
          <div className="lg:flex items-center mb-24">
            <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-12">
              <h2 className="text-3xl font-bold mb-6">{t('features.body_language.title')}</h2>
              <p className="text-lg text-gray-600 mb-6">
                {t('features.body_language.description')}
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-mint mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>손짓과 움직임 패턴 분석</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-mint mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>자세와 서 있는 모습 평가</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-mint mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>무대 존재감과 공간 인식</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-mint mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>시선 처리와 청중과의 연결</span>
                </li>
              </ul>
              <Button size="lg" className="bg-mint hover:bg-mint/90 text-white">
                바디 랭귀지 분석 시작하기
              </Button>
            </div>
            <div className="lg:w-1/2">
              <div className="bg-gradient-to-br from-mint/10 to-mint/20 rounded-2xl p-8 text-center">
                <div className="w-24 h-24 bg-mint/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12 text-mint" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">실시간 분석</h3>
                <p className="text-gray-600">
                  AI가 발표 중 바디 랭귀지를 실시간으로 분석하여 즉시 피드백을 제공합니다.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="lg:flex items-center mb-24 lg:flex-row-reverse">
            <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pl-12">
              <h2 className="text-3xl font-bold mb-6">{t('features.facial_expressions.title')}</h2>
              <p className="text-lg text-gray-600 mb-6">
                {t('features.facial_expressions.description')}
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-mint mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>감정 표현 분석</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-mint mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>눈 맞춤과 시선 추적</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-mint mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>미소와 표정 변화 패턴</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-mint mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>자신감과 진정성 측정</span>
                </li>
              </ul>
              <Button size="lg" className="bg-mint hover:bg-mint/90 text-white">
                표정 분석 체험해보기
              </Button>
            </div>
            <div className="lg:w-1/2">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 text-center">
                <div className="w-24 h-24 bg-purple-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">감정 인식</h3>
                <p className="text-gray-600">
                  최첨단 AI가 미세한 표정 변화까지 감지하여 감정 전달 효과를 평가합니다.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="lg:flex items-center mb-24">
            <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-12">
              <h2 className="text-3xl font-bold mb-6">{t('features.script_feedback.title')}</h2>
              <p className="text-lg text-gray-600 mb-6">
                {t('features.script_feedback.description')}
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-mint mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>말하기 속도와 일시 정지 분석</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-mint mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>톤과 강조점 최적화</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-mint mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>내용 구조와 논리성 검토</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-mint mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>청중 맞춤형 언어 사용 제안</span>
                </li>
              </ul>
              <Button size="lg" className="bg-mint hover:bg-mint/90 text-white">
                음성 분석 시작하기
              </Button>
            </div>
            <div className="lg:w-1/2">
              <div className="bg-gradient-to-br from-green-100 to-mint/20 rounded-2xl p-8 text-center">
                <div className="w-24 h-24 bg-mint/30 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12 text-mint" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">음성 인식</h3>
                <p className="text-gray-600">
                  고급 음성 인식 기술로 발음, 속도, 강조점을 정확하게 분석합니다.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="lg:flex items-center mb-24 lg:flex-row-reverse">
            <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pl-12">
              <h2 className="text-3xl font-bold mb-6">{t('features.ai_insights.title')}</h2>
              <p className="text-lg text-gray-600 mb-6">
                {t('features.ai_insights.description')}
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-mint mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>개인 맞춤형 개선 제안</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-mint mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>발표 스타일 최적화</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-mint mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>청중별 맞춤 전략</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-mint mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>발전 과정 추적과 분석</span>
                </li>
              </ul>
              <Button size="lg" className="bg-mint hover:bg-mint/90 text-white">
                AI 인사이트 받아보기
              </Button>
            </div>
            <div className="lg:w-1/2">
              <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl p-8 text-center">
                <div className="w-24 h-24 bg-orange-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">스마트 추천</h3>
                <p className="text-gray-600">
                  머신러닝을 통해 수집된 데이터로 가장 효과적인 개선 방안을 제시합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-jet text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            지금 바로 발표 실력 향상을 시작하세요
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            모든 기능을 무료로 체험해보고 발표의 달인이 되어보세요.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="bg-mint hover:bg-mint/90 text-white">
                무료로 시작하기
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="border-gray-400 text-gray-300 hover:text-jet hover:bg-white">
                요금제 보기
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPageKo;
