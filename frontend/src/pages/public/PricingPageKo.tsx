import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const PricingPageKo = () => {
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
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">{t('pricing.title')}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('pricing.subtitle')}
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">{t('pricing.free.name')}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">{t('pricing.free.price')}</span>
                <span className="text-gray-500">/{t('pricing.free.period')}</span>
              </div>
              <ul className="space-y-3 mb-8 text-left">
                {(t('pricing.free.features', { returnObjects: true }) as string[]).map((feature: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-5 w-5 text-mint mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link to="/signup">
                <Button className="w-full" variant="outline">
                  무료로 시작하기
                </Button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-white rounded-2xl shadow-sm border-2 border-mint p-8 text-center relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-mint text-white px-4 py-1 rounded-full text-sm font-medium">
                  인기
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('pricing.pro.name')}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">{t('pricing.pro.price')}</span>
                <span className="text-gray-500">/{t('pricing.pro.period')}</span>
              </div>
              <ul className="space-y-3 mb-8 text-left">
                {(t('pricing.pro.features', { returnObjects: true }) as string[]).map((feature: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-5 w-5 text-mint mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link to="/signup">
                <Button className="w-full bg-mint hover:bg-mint/90 text-white">
                  프로 플랜 시작하기
                </Button>
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">{t('pricing.enterprise.name')}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">{t('pricing.enterprise.price')}</span>
                <span className="text-gray-500">/{t('pricing.enterprise.period')}</span>
              </div>
              <ul className="space-y-3 mb-8 text-left">
                {(t('pricing.enterprise.features', { returnObjects: true }) as string[]).map((feature: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-5 w-5 text-mint mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link to="/signup">
                <Button className="w-full" variant="outline">
                  엔터프라이즈 문의
                </Button>
              </Link>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">자주 묻는 질문</h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-2">무료 버전과 유료 버전의 차이점은 무엇인가요?</h3>
                <p className="text-gray-600">
                  무료 버전에서는 월 1개의 프로젝트와 기본적인 피드백을 제공합니다. 유료 버전에서는 무제한 프로젝트, 고급 AI 분석, 상세한 보고서, 우선 지원 등의 추가 기능을 이용하실 수 있습니다.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">언제든지 플랜을 변경할 수 있나요?</h3>
                <p className="text-gray-600">
                  네, 언제든지 플랜을 업그레이드하거나 다운그레이드할 수 있습니다. 변경사항은 다음 결제 주기부터 적용됩니다.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">환불 정책은 어떻게 되나요?</h3>
                <p className="text-gray-600">
                  30일 무조건 환불 보장을 제공합니다. 서비스에 만족하지 않으시면 30일 이내에 전액 환불받으실 수 있습니다.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">데이터 보안은 어떻게 보장되나요?</h3>
                <p className="text-gray-600">
                  모든 데이터는 최고 수준의 암호화 기술로 보호되며, 엄격한 보안 정책에 따라 관리됩니다. 고객의 개인정보와 발표 영상은 절대 외부에 공유되지 않습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-jet text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            지금 바로 시작해보세요
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            무료 플랜으로 시작하고 필요에 따라 언제든지 업그레이드하세요.
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-mint hover:bg-mint/90 text-white">
              무료로 시작하기
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PricingPageKo;
