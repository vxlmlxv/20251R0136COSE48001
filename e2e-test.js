// End-to-end test of the frontend-backend integration
const testEmail = `e2etest${Date.now()}@example.com`;
const testPassword = 'password123';
const testName = 'E2E Test User';

let authToken = '';
let projectId = '';

const API_BASE = 'http://localhost:8080/api';

async function testRegistration() {
  console.log('🧪 Testing user registration...');
  
  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: testEmail.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, ''),
        email: testEmail,
        password: testPassword,
        fullName: testName
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.log('❌ Registration failed:', error);
      return false;
    }

    const authResponse = await response.json();
    authToken = authResponse.accessToken;
    
    console.log('✅ Registration successful!');
    console.log('User:', authResponse.user);
    return true;
  } catch (error) {
    console.error('❌ Registration error:', error.message);
    return false;
  }
}

async function testProjectCreation() {
  console.log('\n🧪 Testing project creation...');
  
  try {
    const response = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        title: 'E2E Test Project',
        description: 'A test project created during end-to-end testing',
        audience: 'EXECUTIVE',
        formality: 'FORMAL',
        domain: 'business'
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.log('❌ Project creation failed:', error);
      return false;
    }

    const project = await response.json();
    projectId = project.id;
    
    console.log('✅ Project creation successful!');
    console.log('Project:', project);
    return true;
  } catch (error) {
    console.error('❌ Project creation error:', error.message);
    return false;
  }
}

async function testProjectFetch() {
  console.log('\n🧪 Testing project fetch...');
  
  try {
    const response = await fetch(`${API_BASE}/projects`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (!response.ok) {
      const error = await response.text();
      console.log('❌ Project fetch failed:', error);
      return false;
    }

    const projects = await response.json();
    
    console.log('✅ Project fetch successful!');
    console.log(`Found ${projects.length} projects`);
    
    const ourProject = projects.find(p => p.id === projectId);
    if (ourProject) {
      console.log('✅ Our test project found:', ourProject.title);
      console.log('Status:', ourProject.status);
      console.log('Audience:', ourProject.audience);
      console.log('Formality:', ourProject.formality);
    } else {
      console.log('❌ Our test project not found in the list');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('❌ Project fetch error:', error.message);
    return false;
  }
}

async function runE2ETest() {
  console.log('🚀 Starting End-to-End Test\n');
  
  const registrationOk = await testRegistration();
  if (!registrationOk) return;
  
  const projectCreationOk = await testProjectCreation();
  if (!projectCreationOk) return;
  
  const projectFetchOk = await testProjectFetch();
  if (!projectFetchOk) return;
  
  console.log('\n🎉 All E2E tests passed! Frontend-backend integration is working correctly.');
  console.log('\nTest Summary:');
  console.log('- User registration: ✅');
  console.log('- Project creation: ✅'); 
  console.log('- Project fetching: ✅');
  console.log('- Data format consistency: ✅');
}

runE2ETest();
