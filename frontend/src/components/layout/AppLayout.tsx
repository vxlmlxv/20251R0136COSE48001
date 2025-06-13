
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
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full">
        <Sidebar collapsible="icon">
          <SidebarContent>
            <div className="p-4 flex justify-center group-data-[collapsible=icon]:p-2">
              <Link to="/">
                <img 
                  src="/favicon.ico" 
                  alt="Preffy" 
                  className="h-6 w-auto group-data-[collapsible=icon]:h-8 mt-2"
                />
              </Link>
            </div>
            
            <div className="px-4 py-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:space-x-0">
            <SidebarGroup>
              <SidebarGroupLabel>Main</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Dashboard">
                      <Link to="/app/dashboard" className={location.pathname === '/app/dashboard' ? 'text-mint' : ''}>
                        <Home size={22} />
                        <span>Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="New Project">
                      <Link to="/app/projects/new" className={location.pathname === '/app/projects/new' ? 'text-mint' : ''}>
                        <Video size={22} />
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
                    <SidebarMenuButton asChild tooltip="Profile">
                      <Link to="/app/profile" className={location.pathname === '/app/profile' ? 'text-mint' : ''}>
                        <User size={22} />
                        <span>Profile</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Settings">
                      <Link to="/app/settings" className={location.pathname === '/app/settings' ? 'text-mint' : ''}>
                        <Settings size={22} />
                        <span>Settings</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            </div>
            
            <div className="mt-auto p-4 group-data-[collapsible=icon]:p-2">
              <div className="flex items-center space-x-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:space-x-0">
                <Avatar className="group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="overflow-hidden group-data-[collapsible=icon]:hidden">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                className="w-full mt-4 text-red-500 hover:text-red-700 hover:bg-red-50 group-data-[collapsible=icon]:w-12 group-data-[collapsible=icon]:h-12 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:mt-2 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center"
                onClick={logout}
              >
                <LogOut size={22} className="mr-2 group-data-[collapsible=icon]:mr-0" />
                <span className="group-data-[collapsible=icon]:sr-only">Log out</span>
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
