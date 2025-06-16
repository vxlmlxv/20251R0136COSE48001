// Utility for testing backend connectivity
export const testBackendConnection = async () => {
  const API_URL = 'http://localhost:8080';
  
  try {
    console.log('Testing backend connection...');
    
    // Test basic connectivity
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'OPTIONS',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('OPTIONS response status:', response.status);
    console.log('OPTIONS response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      console.log('✅ Backend is reachable');
      return true;
    } else {
      console.log('❌ Backend returned error:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.log('❌ Backend connection failed:', error);
    return false;
  }
};

// Test actual login endpoint
export const testLoginEndpoint = async () => {
  const API_URL = 'http://localhost:8080';
  
  try {
    console.log('Testing login endpoint...');
    
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'testpassword'
      }),
    });
    
    console.log('Login response status:', response.status);
    console.log('Login response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('Login response body:', responseText);
    
    return response.status;
  } catch (error) {
    console.log('❌ Login endpoint test failed:', error);
    return null;
  }
};

// Test if backend endpoints exist
export const testEndpoints = async () => {
  const API_URL = 'http://localhost:8080';
  const endpoints = [
    '/api/auth/login',
    '/api/auth/register', 
    '/api/auth/profile',
    '/api/projects'
  ];
  
  console.log('Testing endpoints...');
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'OPTIONS'
      });
      console.log(`${endpoint}: ${response.status}`);
    } catch (error) {
      console.log(`${endpoint}: ERROR - ${error.message}`);
    }
  }
};
