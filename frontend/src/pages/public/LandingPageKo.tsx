import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Features from './Features';

const LandingPageKo = () => {
  const { t, i18n } = useTranslation();
  
  // Force Korean language for this component
  if (i18n.language !== 'ko') {
    i18n.changeLanguage('ko');
  }
  
  return (
    <div className="w-full">
      {/* Hero section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-cloud to-white">
        <div className="max-w-7xl mx-auto">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div className="mb-12 lg:mb-0">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-jet tracking-tight mb-6 flex flex-col">
                <span> {t('landing.hero_title')}</span> <span className="text-mint">{t('landing.hero_title_accent')}</span>
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8">
                {t('landing.hero_subtitle')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/signup">
                  <Button size="lg" className="bg-mint hover:bg-mint/90 text-white">
                    {t('landing.start_free')}
                  </Button>
                </Link>
                <Link to="/features">
                  <Button size="lg" variant="outline">
                    {t('landing.learn_more')}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="발표하는 사람" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Teaser */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t('landing.how_preffy_helps')}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('landing.how_preffy_subtitle')}
          </p>
        </div>
        <Features />
      </section>

      {/* Social Proof */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-cloud/30">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-8">수천 명의 발표자들이 신뢰합니다</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {/* Placeholder logos */}
            <div className="h-12 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-gray-400 font-semibold">회사 A</span>
            </div>
            <div className="h-12 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-gray-400 font-semibold">회사 B</span>
            </div>
            <div className="h-12 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-gray-400 font-semibold">회사 C</span>
            </div>
            <div className="h-12 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-gray-400 font-semibold">회사 D</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">사용자들의 후기</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 bg-mint/10 rounded-full flex items-center justify-center">
                  <span className="text-mint font-semibold">김</span>
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold">김민수</h4>
                  <p className="text-sm text-gray-500">마케팅 매니저</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Preffy 덕분에 발표 실력이 크게 향상되었습니다. AI 피드백이 정말 도움이 되었어요!"
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 bg-mint/10 rounded-full flex items-center justify-center">
                  <span className="text-mint font-semibold">이</span>
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold">이정우</h4>
                  <p className="text-sm text-gray-500">프로덕트 매니저</p>
                </div>
              </div>
              <p className="text-gray-600">
                "바디 랭귀지 분석 기능이 특히 유용했습니다. 이제 더 자신감 있게 발표할 수 있어요."
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 bg-mint/10 rounded-full flex items-center justify-center">
                  <span className="text-mint font-semibold">박</span>
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold">박서연</h4>
                  <p className="text-sm text-gray-500">세일즈 디렉터</p>
                </div>
              </div>
              <p className="text-gray-600">
                "클라이언트 발표 전에 항상 Preffy로 연습합니다. 성공률이 눈에 띄게 높아졌어요!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-jet text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            지금 바로 발표 실력을 향상시켜보세요
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            무료로 시작하고, 첫 번째 분석을 몇 분 안에 받아보세요.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="bg-mint hover:bg-mint/90 text-white">
                무료로 시작하기
              </Button>
            </Link>
            <Link to="/features">
              <Button size="lg" variant="outline" className="border-gray-400 text-gray-300 hover:text-jet hover:bg-white">
                기능 둘러보기
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPageKo;
