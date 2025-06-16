import { useState } from 'react';
import { authService } from '@/services/auth-service';
import { Button } from '@/components/ui/button';

export const BackendTestComponent = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testRegistration = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const testEmail = `test${Date.now()}@example.com`;
      const response = await authService.register(testEmail, 'password123', 'Test User');
      setResult({ success: true, data: response });
      console.log('✅ Registration successful:', response);
    } catch (error: any) {
      setResult({ success: false, error: error.message });
      console.error('❌ Registration failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      // Use the test user we created earlier
      const response = await authService.login('test@example.com', 'password123');
      setResult({ success: true, data: response });
      console.log('✅ Login successful:', response);
    } catch (error: any) {
      setResult({ success: false, error: error.message });
      console.error('❌ Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50 my-4">
      <h3 className="font-semibold mb-2">Backend Connection Test</h3>
      <div className="space-x-2 mb-2">
        <Button onClick={testRegistration} disabled={loading} size="sm">
          Test Registration
        </Button>
        <Button onClick={testLogin} disabled={loading} size="sm">
          Test Login
        </Button>
      </div>
      
      {loading && <p>Testing...</p>}
      
      {result && (
        <div className={`mt-2 p-2 rounded text-sm ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {result.success ? (
            <div>
              <p>✅ Success!</p>
              <pre>{JSON.stringify(result.data, null, 2)}</pre>
            </div>
          ) : (
            <div>
              <p>❌ Error: {result.error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
