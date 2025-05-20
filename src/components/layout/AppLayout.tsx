
import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar, SidebarContent, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Home, Video, Settings, User, LogOut } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // If no user is logged in, redirect to login
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarContent>
            <div className="p-4">
              <Link to="/">
                <h1 className="preffy-logo text-xl">Preffy</h1>
              </Link>
            </div>
            
            <SidebarGroup>
              <SidebarGroupLabel>Main</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/app/dashboard" className={location.pathname === '/app/dashboard' ? 'text-mint' : ''}>
                        <Home size={20} />
                        <span>Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/app/projects/new" className={location.pathname === '/app/projects/new' ? 'text-mint' : ''}>
                        <Video size={20} />
                        <span>New Project</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <SidebarGroup>
              <SidebarGroupLabel>Account</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/app/profile" className={location.pathname === '/app/profile' ? 'text-mint' : ''}>
                        <User size={20} />
                        <span>Profile</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/app/settings" className={location.pathname === '/app/settings' ? 'text-mint' : ''}>
                        <Settings size={20} />
                        <span>Settings</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <div className="mt-auto p-4">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="overflow-hidden">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                className="w-full mt-4 text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={logout}
              >
                <LogOut size={16} className="mr-2" />
                Log out
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 flex flex-col min-h-screen">
          <header className="bg-white border-b border-gray-200 p-4 sm:px-6 flex items-center justify-between">
            {isMobile && <SidebarTrigger />}
            <h1 className="text-xl font-semibold">
              {location.pathname === '/app/dashboard' && 'Dashboard'}
              {location.pathname === '/app/projects/new' && 'New Project'}
              {location.pathname === '/app/profile' && 'Profile'}
              {location.pathname === '/app/settings' && 'Settings'}
              {location.pathname.includes('/app/projects/') && location.pathname.includes('/overview') && 'Project Overview'}
              {location.pathname.includes('/app/projects/') && location.pathname.includes('/body-feedback') && 'Body Feedback'}
              {location.pathname.includes('/app/projects/') && location.pathname.includes('/script-feedback') && 'Script Feedback'}
            </h1>
            <div>
              {/* Add any header actions here */}
            </div>
          </header>
          
          <main className="flex-1 p-4 sm:p-6 bg-gray-50 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
