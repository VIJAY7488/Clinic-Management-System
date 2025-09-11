import { Users } from 'lucide-react';
import React from 'react';

const Navigation: React.FC = () => (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">Clinic Management</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`px-4 py-2 rounded-md ${currentView === 'dashboard' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentView('queue')}
              className={`px-4 py-2 rounded-md ${currentView === 'queue' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              Queue
            </button>
            <button
              onClick={() => setCurrentView('appointments')}
              className={`px-4 py-2 rounded-md ${currentView === 'appointments' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              Appointments
            </button>
            <button
              onClick={() => setCurrentView('doctors')}
              className={`px-4 py-2 rounded-md ${currentView === 'doctors' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              Doctors
            </button>
            <button
              onClick={() => {
                setIsAuthenticated(false);
                setCurrentView('login');
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );

export default Navigation;