import React from 'react';
import { 
  BellIcon, 
  UserCircleIcon, 
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

interface HeaderProps {
  user?: {
    name: string;
    role: string;
    avatar?: string;
  };
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-white shadow-soft border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">MediPulse</h1>
                <p className="text-xs text-gray-500">Healthcare Management</p>
              </div>
            </div>
          </div>

          {/* Right side - Notifications and User Menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg">
              <BellIcon className="h-6 w-6" />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-danger-500"></span>
            </button>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name || 'Guest User'}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role || 'Guest'}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg">
                  <Cog6ToothIcon className="h-5 w-5" />
                </button>
                
                {onLogout && (
                  <button 
                    onClick={onLogout}
                    className="p-2 text-gray-400 hover:text-danger-500 focus:outline-none focus:ring-2 focus:ring-danger-500 rounded-lg"
                    title="Logout"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
