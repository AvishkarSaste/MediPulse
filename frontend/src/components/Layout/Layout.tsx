import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';
import { Bars3Icon } from '@heroicons/react/24/outline';

interface LayoutProps {
  user?: {
    name: string;
    role: string;
    avatar?: string;
  };
  onLogout?: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    if (onLogout) onLogout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          type="button"
          className="bg-white p-2 rounded-lg shadow-soft border border-gray-200 text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
          onClick={() => setSidebarOpen(true)}
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
      </div>

      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        userRole={user?.role}
      />

      <div className="lg:pl-64">
        <Header user={user} onLogout={handleLogout} />
        
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
