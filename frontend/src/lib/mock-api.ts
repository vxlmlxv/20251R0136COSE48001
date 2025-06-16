
import { mockUsers, mockProjects, mockVideos, mockScriptSegments, mockBehaviorEvents, mockBadgeScores, mockSuggestions } from '@/lib/mock-data';
import { Project, User, Video } from '@/lib/types';

// This file simulates API endpoints for the prototype
// In a real app, this would be replaced by actual API calls

// Helper to simulate API delays
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API handler
export const mockApiHandler = {
  // Intercept fetch calls and handle them with mock data
  setupMockApi: () => {
    // Store the original fetch
    const originalFetch = window.fetch;

    // Replace fetch with our mock implementation
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      // Get URL as string
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
      const method = init?.method || 'GET';
      
      console.log(`[Mock API] ${method} ${url}`);
      
      // Simulate network delay
      await delay();
      
      // Extract endpoint from URL
      const endpoint = url.replace(/^.*\/api/, '');
      
      // Auth endpoints
      if (endpoint.startsWith('/auth')) {
        return handleAuthEndpoints(endpoint, init);
      }
      
      // Projects endpoints
      if (endpoint.startsWith('/projects')) {
        return handleProjectEndpoints(endpoint, init);
      }
      
      // If no mock endpoint matches, pass through to the original fetch
      console.log(`[Mock API] No mock handler for ${url}, passing through`);
      return originalFetch(input, init);
    };

    console.log('[Mock API] Mock API handlers installed');
  }
};

// Handle auth-related endpoints
async function handleAuthEndpoints(endpoint: string, init?: RequestInit) {
  // Parse request body if present
  let body: any = {};
  if (init?.body) {
    try {
      body = JSON.parse(init.body as string);
    } catch (error) {
      console.error('[Mock API] Error parsing request body', error);
    }
  }
  
  // Login endpoint
  if (endpoint === '/auth/login' && init?.method === 'POST') {
    const { email } = body;
    const user = mockUsers.find(u => u.email === email);
    
    if (user) {
      return createMockResponse(200, user);
    } else {
      return createMockResponse(401, { message: 'Invalid credentials' });
    }
  }
  
  // Signup endpoint
  if (endpoint === '/auth/signup' && init?.method === 'POST') {
    const { name, email } = body;
    
    // Check if user already exists
    if (mockUsers.some(u => u.email === email)) {
      return createMockResponse(409, { message: 'Email already in use' });
    }
    
    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      username: email.split('@')[0], // Generate username from email
      locale: 'en-US',
      plan: 'free'
    };
    
    // In a real app, this would save to a database
    return createMockResponse(201, newUser);
  }
  
  // Profile endpoint
  if (endpoint === '/auth/profile' && init?.method === 'GET') {
    // Get user ID from Authorization header
    const authHeader = init?.headers ? (init.headers as any).Authorization : '';
    const userId = authHeader?.replace('Bearer ', '');
    
    const user = mockUsers.find(u => u.id === userId);
    
    if (user) {
      return createMockResponse(200, user);
    } else {
      return createMockResponse(404, { message: 'User not found' });
    }
  }
  
  // Default: not found
  return createMockResponse(404, { message: 'Endpoint not found' });
}

// Handle project-related endpoints
async function handleProjectEndpoints(endpoint: string, init?: RequestInit) {
  // Parse request body if present
  let body: any = {};
  if (init?.body) {
    try {
      body = JSON.parse(init.body as string);
    } catch (error) {
      console.error('[Mock API] Error parsing request body', error);
    }
  }
  
  // Get all projects
  if (endpoint === '/projects' && init?.method === 'GET') {
    // Get user ID from Authorization header
    const authHeader = init?.headers ? (init.headers as any).Authorization : '';
    const userId = authHeader?.replace('Bearer ', '');
    
    const projects = mockProjects.filter(p => p.userId === userId);
    return createMockResponse(200, projects);
  }
  
  // Create new project
  if (endpoint === '/projects' && init?.method === 'POST') {
    // Get user ID from Authorization header
    const authHeader = init?.headers ? (init.headers as any).Authorization : '';
    const userId = authHeader?.replace('Bearer ', '');
    
    const newProject: Project = {
      id: `project-${Date.now()}`,
      userId,
      title: body.title,
      description: body.description,
      audience: body.audience,
      formality: body.formality,
      domain: body.domain || '',
      status: 'created',
      createdAt: new Date().toISOString()
    };
    
    // In a real app, this would save to a database
    return createMockResponse(201, newProject);
  }
  
  // Get single project
  if (endpoint.match(/^\/projects\/[^\/]+$/) && init?.method === 'GET') {
    const projectId = endpoint.split('/')[2];
    const project = mockProjects.find(p => p.id === projectId);
    
    if (project) {
      return createMockResponse(200, project);
    } else {
      return createMockResponse(404, { message: 'Project not found' });
    }
  }
  
  // Upload video
  if (endpoint.match(/^\/projects\/[^\/]+\/video$/) && init?.method === 'POST') {
    const projectId = endpoint.split('/')[2];
    
    const newVideo: Video = {
      id: `video-${Date.now()}`,
      projectId,
      url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', // Example URL
      duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 mins
      resolution: {
        width: 1280,
        height: 720
      }
    };
    
    // In a real app, this would save to a database
    return createMockResponse(201, newVideo);
  }
  
  // Get project status
  if (endpoint.match(/^\/projects\/[^\/]+\/status$/) && init?.method === 'GET') {
    const projectId = endpoint.split('/')[2];
    const project = mockProjects.find(p => p.id === projectId);
    
    if (project) {
      // Simulate status progression
      const statuses = ['created', 'uploading', 'processing', 'analyzed', 'completed'];
      const currentIndex = statuses.indexOf(project.status);
      
      // Every request has a small chance to advance the status
      if (Math.random() > 0.7 && currentIndex < statuses.length - 1) {
        project.status = statuses[currentIndex + 1] as any;
      }
      
      return createMockResponse(200, project);
    } else {
      return createMockResponse(404, { message: 'Project not found' });
    }
  }
  
  // Get project videos
  if (endpoint.match(/^\/projects\/[^\/]+\/videos$/) && init?.method === 'GET') {
    const projectId = endpoint.split('/')[2];
    const videos = mockVideos.filter(v => v.projectId === projectId);
    
    return createMockResponse(200, videos);
  }
  
  // Get script segments
  if (endpoint.match(/^\/projects\/[^\/]+\/script$/) && init?.method === 'GET') {
    const projectId = endpoint.split('/')[2];
    const segments = mockScriptSegments.filter(s => s.projectId === projectId);
    
    return createMockResponse(200, segments);
  }
  
  // Get behavior events
  if (endpoint.match(/^\/projects\/[^\/]+\/behavior/) && init?.method === 'GET') {
    const projectId = endpoint.split('/')[2];
    
    // Check if there's a type filter
    const typeMatch = endpoint.match(/\?type=([a-z]+)/);
    const type = typeMatch ? typeMatch[1] : null;
    
    let events = mockBehaviorEvents.filter(e => e.projectId === projectId);
    
    if (type) {
      events = events.filter(e => e.type === type);
    }
    
    return createMockResponse(200, events);
  }
  
  // Get badge scores
  if (endpoint.match(/^\/projects\/[^\/]+\/badges$/) && init?.method === 'GET') {
    const projectId = endpoint.split('/')[2];
    const badges = mockBadgeScores.filter(b => b.projectId === projectId);
    
    return createMockResponse(200, badges);
  }
  
  // Get suggestions
  if (endpoint.match(/^\/projects\/[^\/]+\/suggestions$/) && init?.method === 'GET') {
    const projectId = endpoint.split('/')[2];
    const suggestions = mockSuggestions.filter(s => s.projectId === projectId);
    
    return createMockResponse(200, suggestions);
  }
  
  // Process suggestion (accept/reject)
  if (endpoint.match(/^\/projects\/[^\/]+\/suggestions\/[^\/]+\/(accept|reject)$/) && init?.method === 'POST') {
    // In a real app, this would update the suggestion status
    return createMockResponse(200, { success: true });
  }
  
  // Default: not found
  return createMockResponse(404, { message: 'Endpoint not found' });
}

// Helper to create mock response
function createMockResponse(status: number, body: any): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
