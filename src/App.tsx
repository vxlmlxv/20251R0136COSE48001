
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';

// Public pages
import LandingPage from "./pages/public/LandingPage";
import FeaturesPage from "./pages/public/FeaturesPage";
import PricingPage from "./pages/public/PricingPage";
import SignupPage from "./pages/public/SignupPage";
import LoginPage from "./pages/public/LoginPage";

// App pages
import DashboardPage from "./pages/app/DashboardPage";
import NewProjectPage from "./pages/app/NewProjectPage";
import ProjectOverviewPage from "./pages/app/ProjectOverviewPage";
import BodyFeedbackPage from "./pages/app/BodyFeedbackPage";
import ScriptFeedbackPage from "./pages/app/ScriptFeedbackPage";
import ProfilePage from "./pages/app/ProfilePage";
import SettingsPage from "./pages/app/SettingsPage";

// Fallback
import NotFound from "./pages/NotFound";

// Layouts
import { PublicLayout } from "./components/layout/PublicLayout";
import { AppLayout } from "./components/layout/AppLayout";

// Authentication guard
import { RequireAuth } from "./components/auth/RequireAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<PublicLayout><LandingPage /></PublicLayout>} />
            <Route path="/features" element={<PublicLayout><FeaturesPage /></PublicLayout>} />
            <Route path="/pricing" element={<PublicLayout><PricingPage /></PublicLayout>} />
            <Route path="/signup" element={<PublicLayout><SignupPage /></PublicLayout>} />
            <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
            
            {/* App routes (authenticated) */}
            <Route path="/app" element={<RequireAuth><AppLayout><DashboardPage /></AppLayout></RequireAuth>} />
            <Route path="/app/dashboard" element={<RequireAuth><AppLayout><DashboardPage /></AppLayout></RequireAuth>} />
            <Route path="/app/projects/new" element={<RequireAuth><AppLayout><NewProjectPage /></AppLayout></RequireAuth>} />
            <Route path="/app/projects/:projectId/overview" element={<RequireAuth><AppLayout><ProjectOverviewPage /></AppLayout></RequireAuth>} />
            <Route path="/app/projects/:projectId/body-feedback" element={<RequireAuth><AppLayout><BodyFeedbackPage /></AppLayout></RequireAuth>} />
            <Route path="/app/projects/:projectId/script-feedback" element={<RequireAuth><AppLayout><ScriptFeedbackPage /></AppLayout></RequireAuth>} />
            <Route path="/app/profile" element={<RequireAuth><AppLayout><ProfilePage /></AppLayout></RequireAuth>} />
            <Route path="/app/settings" element={<RequireAuth><AppLayout><SettingsPage /></AppLayout></RequireAuth>} />
            
            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
