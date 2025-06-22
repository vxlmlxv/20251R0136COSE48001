
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { LanguageRouter } from './components/LanguageRouter';
import { useEffect } from "react";
import { mockApiHandler } from "./lib/mock-api";

// Public pages
import SignupPage from "./pages/public/SignupPage";
import LoginPage from "./pages/public/LoginPage";

// App pages - removed direct imports since they're now handled by LanguageRouter

// Fallback
import NotFound from "./pages/NotFound";

// Layouts
import { PublicLayout } from "./components/layout/PublicLayout";
import { AppLayout } from "./components/layout/AppLayout";

// Authentication guard
import { RequireAuth } from "./components/auth/RequireAuth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Initialize the mock API
if (import.meta.env.MODE === 'development') {
  mockApiHandler.setupMockApi();
}

const App = () => {
  // Add a global fetch error handler
  useEffect(() => {
    const handleUnauthorized = (event: Event) => {
      const error = (event as ErrorEvent).error;
      // Check if it's a 401 error
      if (error && error.status === 401) {
        // Clear user data from local storage
        localStorage.removeItem('prefUser');
        // Reload the page to force login
        window.location.href = '/login';
      }
    };

    window.addEventListener('error', handleUnauthorized);
    
    return () => {
      window.removeEventListener('error', handleUnauthorized);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<PublicLayout><LanguageRouter page="landing" /></PublicLayout>} />
                <Route path="/features" element={<PublicLayout><LanguageRouter page="features" /></PublicLayout>} />
                <Route path="/pricing" element={<PublicLayout><LanguageRouter page="pricing" /></PublicLayout>} />
                <Route path="/signup" element={<PublicLayout><SignupPage /></PublicLayout>} />
                <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
                
                {/* App routes (authenticated) */}
                <Route path="/app" element={<RequireAuth><AppLayout><LanguageRouter page="dashboard" /></AppLayout></RequireAuth>} />
                <Route path="/app/dashboard" element={<RequireAuth><AppLayout><LanguageRouter page="dashboard" /></AppLayout></RequireAuth>} />
                <Route path="/app/projects/new" element={<RequireAuth><AppLayout><LanguageRouter page="new-project" /></AppLayout></RequireAuth>} />
                <Route path="/app/projects/:projectId/overview" element={<RequireAuth><AppLayout><LanguageRouter page="project-overview" /></AppLayout></RequireAuth>} />
                <Route path="/app/projects/:projectId/body-feedback" element={<RequireAuth><AppLayout><LanguageRouter page="body-feedback" /></AppLayout></RequireAuth>} />
                <Route path="/app/projects/:projectId/script-feedback" element={<RequireAuth><AppLayout><LanguageRouter page="script-feedback" /></AppLayout></RequireAuth>} />
                <Route path="/app/profile" element={<RequireAuth><AppLayout><LanguageRouter page="profile" /></AppLayout></RequireAuth>} />
                <Route path="/app/settings" element={<RequireAuth><AppLayout><LanguageRouter page="settings" /></AppLayout></RequireAuth>} />
                
                {/* Fallback */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
