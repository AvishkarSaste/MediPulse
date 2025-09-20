import React, { useState, useEffect } from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import EmergencySOS from '../components/EmergencySOS';
import { useAuth } from '../context/AuthContext';
import { 
  ExclamationTriangleIcon,
  UserIcon,
  CalendarIcon,
  PhoneIcon,
  MapPinIcon,
  HeartIcon,
  ClockIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [showSOS, setShowSOS] = useState(false);
  const [recentEmergencies, setRecentEmergencies] = useState<any[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);

  // Mock data for patient dashboard
  useEffect(() => {
    // In a real app, this would fetch from the backend
    setUpcomingAppointments([
      {
        id: 1,
        doctor: 'Dr. Sarah Johnson',
        specialty: 'Cardiology',
        date: '2024-01-25',
        time: '10:00 AM',
        location: 'Main Hospital, Room 205'
      },
      {
        id: 2,
        doctor: 'Dr. Michael Chen',
        specialty: 'General Medicine',
        date: '2024-01-28',
        time: '2:30 PM',
        location: 'Clinic A, Room 101'
      }
    ]);
  }, []);

  const quickActions = [
    {
      title: 'Emergency SOS',
      description: 'Send emergency alert',
      icon: ExclamationTriangleIcon,
      color: 'bg-danger-500',
      onClick: () => setShowSOS(true)
    },
    {
      title: 'Book Appointment',
      description: 'Schedule new appointment',
      icon: CalendarIcon,
      color: 'bg-primary-500',
      onClick: () => console.log('Book appointment')
    },
    {
      title: 'View Records',
      description: 'Access medical records',
      icon: DocumentTextIcon,
      color: 'bg-success-500',
      onClick: () => console.log('View records')
    },
    {
      title: 'AI Assistant',
      description: 'Get medical help',
      icon: ChatBubbleLeftRightIcon,
      color: 'bg-warning-500',
      onClick: () => console.log('AI Assistant')
    }
  ];

  const healthMetrics = [
    { label: 'Blood Pressure', value: '120/80', status: 'Normal', color: 'text-success-600' },
    { label: 'Heart Rate', value: '72 bpm', status: 'Normal', color: 'text-success-600' },
    { label: 'Temperature', value: '98.6°F', status: 'Normal', color: 'text-success-600' },
    { label: 'Weight', value: '70 kg', status: 'Stable', color: 'text-primary-600' }
  ];

  return (
    <div className="space-y-6">
      {/* Emergency SOS Button - Always visible for patients */}
      <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-danger-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-danger-900">Emergency Alert</h3>
              <p className="text-sm text-danger-700">Need immediate medical assistance?</p>
            </div>
          </div>
          <Button
            variant="danger"
            onClick={() => setShowSOS(true)}
            className="bg-danger-600 hover:bg-danger-700"
          >
            <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
            SOS Alert
          </Button>
        </div>
      </div>

      {/* Welcome Section */}
      <Card padding="lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.name || 'Patient'}!
            </h1>
            <p className="text-gray-600">Here's your health overview</p>
          </div>
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <UserIcon className="h-8 w-8 text-primary-600" />
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Card key={index} padding="md" className="hover:shadow-md transition-shadow cursor-pointer">
              <div onClick={action.onClick} className="text-center">
                <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Metrics */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Metrics</h3>
          <div className="space-y-4">
            {healthMetrics.map((metric, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{metric.label}</p>
                  <p className="text-sm text-gray-600">{metric.status}</p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-semibold ${metric.color}`}>{metric.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments</h3>
          <div className="space-y-3">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{appointment.doctor}</h4>
                    <span className="text-sm text-primary-600">{appointment.specialty}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 space-x-4">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {appointment.date}
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {appointment.time}
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    {appointment.location}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
            )}
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <HeartIcon className="h-5 w-5 text-primary-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Health check completed</p>
              <p className="text-sm text-gray-600">2 days ago</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <DocumentTextIcon className="h-5 w-5 text-success-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Lab results received</p>
              <p className="text-sm text-gray-600">1 week ago</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <CalendarIcon className="h-5 w-5 text-warning-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Appointment scheduled</p>
              <p className="text-sm text-gray-600">2 weeks ago</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Emergency SOS Modal */}
      <EmergencySOS isOpen={showSOS} onClose={() => setShowSOS(false)} />
    </div>
  );
};

export default PatientDashboard;
