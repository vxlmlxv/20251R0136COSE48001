// Simple test to check backend connection
async function testBackend() {
  try {
    const response = await fetch('http://localhost:8080/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser456',
        email: 'test2@example.com',
        password: 'password123',
        fullName: 'Test User 2'
      })
    });
    
    const data = await response.json();
    console.log('Backend response:', data);
    console.log('Response status:', response.status);
    console.log('Response headers:', [...response.headers.entries()]);
    
    if (response.ok) {
      console.log('✅ Backend connection successful!');
      console.log('Token:', data.accessToken);
      console.log('User:', data.user);
    } else {
      console.log('❌ Backend returned error:', data);
    }
  } catch (error) {
    console.error('❌ Failed to connect to backend:', error);
  }
}

testBackend();
