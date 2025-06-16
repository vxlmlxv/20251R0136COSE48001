// Test Demo Mode Functionality
// This file tests the demo mode implementation

const testDemoMode = async () => {
  console.log('Testing Demo Mode...');
  
  // Test demo login
  const loginResult = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: 'demo@preffy.com',
      password: 'demo123'
    })
  });
  
  console.log('Demo login response:', await loginResult.json());
  
  // Test if demo mode is enabled
  const isDemoMode = localStorage.getItem('demo-mode') === 'true';
  console.log('Demo mode enabled:', isDemoMode);
  
  // Test getting demo projects
  if (isDemoMode) {
    const projectsResult = await fetch('/api/projects');
    console.log('Demo projects response:', await projectsResult.json());
  }
};

// Run the test
if (typeof window !== 'undefined') {
  testDemoMode().catch(console.error);
}
