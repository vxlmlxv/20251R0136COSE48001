// Simple test to verify frontend-backend integration
const testEmailRegistration = async () => {
  const testUser = {
    username: 'testfrontend',
    email: 'testfrontend@example.com',
    password: 'password123',
    fullName: 'Test Frontend User'
  };

  try {
    console.log('🧪 Testing registration endpoint...');
    
    const response = await fetch('http://localhost:8080/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    });

    if (!response.ok) {
      const error = await response.text();
      console.log('❌ Registration failed:', error);
      return;
    }

    const authResponse = await response.json();
    console.log('✅ Registration successful!');
    console.log('Token:', authResponse.accessToken);
    console.log('User:', authResponse.user);

    // Test login
    console.log('\n🧪 Testing login endpoint...');
    
    const loginResponse = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });

    if (!loginResponse.ok) {
      const error = await loginResponse.text();
      console.log('❌ Login failed:', error);
      return;
    }

    const loginData = await loginResponse.json();
    console.log('✅ Login successful!');
    console.log('Token:', loginData.accessToken);
    console.log('User:', loginData.user);

    // Test profile endpoint
    console.log('\n🧪 Testing profile endpoint...');
    
    const profileResponse = await fetch('http://localhost:8080/api/auth/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${loginData.accessToken}`,
        'Content-Type': 'application/json',
      }
    });

    if (!profileResponse.ok) {
      const error = await profileResponse.text();
      console.log('❌ Profile request failed:', error);
      return;
    }

    const profileData = await profileResponse.json();
    console.log('✅ Profile request successful!');
    console.log('Profile:', profileData);

    console.log('\n🎉 All tests passed! Frontend should work correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

testEmailRegistration();
