import { useLanguage } from '@/hooks/use-language';

// Import English pages
import DashboardPage from '@/pages/app/DashboardPage';
import SettingsPage from '@/pages/app/SettingsPage';
import ProjectOverviewPage from '@/pages/app/ProjectOverviewPage';
import BodyFeedbackPage from '@/pages/app/BodyFeedbackPage';
import ScriptFeedbackPage from '@/pages/app/ScriptFeedbackPage';
import NewProjectPage from '@/pages/app/NewProjectPage';
import ProfilePage from '@/pages/app/ProfilePage';
import LandingPage from '@/pages/public/LandingPage';
import FeaturesPage from '@/pages/public/FeaturesPage';
import PricingPage from '@/pages/public/PricingPage';

// Import Korean pages
import DashboardPageKo from '@/pages/app/DashboardPageKo';
import SettingsPageKo from '@/pages/app/SettingsPageKo';
import ProjectOverviewPageKo from '@/pages/app/ProjectOverviewPageKo';
import BodyFeedbackPageKo from '@/pages/app/BodyFeedbackPageKo';
import ScriptFeedbackPageKo from '@/pages/app/ScriptFeedbackPageKo';
import NewProjectPageKo from '@/pages/app/NewProjectPageKo';
import ProfilePageKo from '@/pages/app/ProfilePageKo';
import LandingPageKo from '@/pages/public/LandingPageKo';
import FeaturesPageKo from '@/pages/public/FeaturesPageKo';
import PricingPageKo from '@/pages/public/PricingPageKo';

interface LanguageRouterProps {
  page: 'dashboard' | 'settings' | 'project-overview' | 'body-feedback' | 'script-feedback' | 'new-project' | 'profile' | 'landing' | 'features' | 'pricing';
}

export const LanguageRouter = ({ page }: LanguageRouterProps) => {
  const { language } = useLanguage();

  if (language === 'ko') {
    switch (page) {
      case 'dashboard':
        return <DashboardPageKo />;
      case 'settings':
        return <SettingsPageKo />;
      case 'project-overview':
        return <ProjectOverviewPageKo />;
      case 'body-feedback':
        return <BodyFeedbackPageKo />;
      case 'script-feedback':
        return <ScriptFeedbackPageKo />;
      case 'new-project':
        return <NewProjectPageKo />;
      case 'profile':
        return <ProfilePageKo />;
      case 'landing':
        return <LandingPageKo />;
      case 'features':
        return <FeaturesPageKo />;
      case 'pricing':
        return <PricingPageKo />;
      default:
        return <DashboardPageKo />;
    }
  }

  // Default to English pages
  switch (page) {
    case 'dashboard':
      return <DashboardPage />;
    case 'settings':
      return <SettingsPage />;
    case 'project-overview':
      return <ProjectOverviewPage />;
    case 'body-feedback':
      return <BodyFeedbackPage />;
    case 'script-feedback':
      return <ScriptFeedbackPage />;
    case 'new-project':
      return <NewProjectPage />;
    case 'profile':
      return <ProfilePage />;
    case 'landing':
      return <LandingPage />;
    case 'features':
      return <FeaturesPage />;
    case 'pricing':
      return <PricingPage />;
    default:
      return <DashboardPage />;
  }
};
