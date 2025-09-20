import React from 'react';
import { 
  HomeIcon,
  UserGroupIcon,
  UserIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, userRole = 'patient' }) => {
  const getNavigation = (role: string) => {
    if (role === 'patient') {
      return [
        { name: 'Dashboard', href: '/', icon: HomeIcon },
        { name: 'Emergency SOS', href: '/emergency-sos', icon: ExclamationTriangleIcon },
        { name: 'My Appointments', href: '/appointments', icon: CalendarIcon },
        { name: 'Medical Records', href: '/records', icon: DocumentTextIcon },
        { name: 'AI Assistant', href: '/ai-assistant', icon: CpuChipIcon },
        { name: 'Profile', href: '/profile', icon: UserIcon },
      ];
    } else if (role === 'doctor') {
      return [
        { name: 'Dashboard', href: '/', icon: HomeIcon },
        { name: 'Patients', href: '/patients', icon: UserGroupIcon },
        { name: 'Emergencies', href: '/emergencies', icon: ExclamationTriangleIcon },
        { name: 'My Schedule', href: '/schedule', icon: CalendarIcon },
        { name: 'AI Assistant', href: '/ai-assistant', icon: CpuChipIcon },
        { name: 'Profile', href: '/profile', icon: UserIcon },
      ];
    } else if (role === 'admin') {
      return [
        { name: 'Dashboard', href: '/', icon: HomeIcon },
        { name: 'Patients', href: '/patients', icon: UserGroupIcon },
        { name: 'Doctors', href: '/doctors', icon: UserIcon },
        { name: 'Emergencies', href: '/emergencies', icon: ExclamationTriangleIcon },
        { name: 'AI Assistant', href: '/ai-assistant', icon: CpuChipIcon },
        { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
        { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
        { name: 'Profile', href: '/profile', icon: UserIcon },
      ];
    }

    return [{ name: 'Dashboard', href: '/', icon: HomeIcon }];
  };

  const navigation = getNavigation(userRole);


  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-strong transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-100">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <div className="ml-3">
              <h2 className="text-lg font-bold text-gray-900">MediPulse</h2>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
                onClick={onClose}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    window.location.pathname === item.href
                      ? 'text-primary-600'
                      : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* User info at bottom */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <UserIcon className="h-5 w-5 text-primary-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Current User</p>
                <p className="text-xs text-gray-500 capitalize">{userRole}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
