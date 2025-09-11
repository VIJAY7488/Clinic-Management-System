import { Users, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Replace this URL with your actual API endpoint
  const API_ENDPOINT = 'http://localhost:3000/api/auth/login';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Successful login
        setIsAuthenticated(true);
        
        // Store token if provided by backend
        if (data.token) {
          // Store token in memory (localStorage not supported in artifacts)
          console.log('Token received:', data.token);
        }
        
        console.log('Login successful:', data);
      } else {
        // Handle error response
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      // Handle network or other errors
      console.error('Login error:', err);
      setError('Network error. Please try again.');
      
      // Fallback to demo credentials for testing
      if (username === 'admin' && password === 'password') {
        setIsAuthenticated(true);
        setError('');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  // Success screen after login
  if (isAuthenticated) {
    navigate('/home');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <div className="text-center mb-8">
          <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Clinic Front Desk</h1>
          <p className="text-gray-600">Please sign in to continue</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.trim())}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter username"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value.trim())}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
              disabled={isLoading}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin(e)}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </div>

        <div className="mt-4 text-center text-sm text-gray-500">
          Demo credentials: admin / password
          <br />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;