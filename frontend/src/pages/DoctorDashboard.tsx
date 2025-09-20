import React, { useState, useEffect } from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { patientsApi } from '../api/patients';
import { emergenciesApi, Emergency } from '../api/emergencies';
import { useAuth } from '../context/AuthContext';
import { 
  UserGroupIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon,
  CalendarIcon,
  ChartBarIcon,
  PhoneIcon,
  MapPinIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<any[]>([]);
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    activeEmergencies: 0,
    todayAppointments: 0,
    completedCases: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [patientsData, emergenciesData] = await Promise.all([
        patientsApi.getAll(),
        emergenciesApi.getAll()
      ]);
      
      setPatients(patientsData);
      setEmergencies(emergenciesData);
      
      setStats({
        totalPatients: patientsData.length,
        activeEmergencies: emergenciesData.filter(e => e.status === 'Active').length,
        todayAppointments: 5, // Mock data
        completedCases: emergenciesData.filter(e => e.status === 'Resolved').length
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmergencyAction = async (emergencyId: number, action: string) => {
    try {
      if (action === 'accept') {
        await emergenciesApi.updateStatus(emergencyId, { 
          status: 'In Progress', 
          assignedDoctor: user?.name || 'Dr. Unknown' 
        });
      } else if (action === 'resolve') {
        await emergenciesApi.updateStatus(emergencyId, { status: 'Resolved' });
      }
      loadDashboardData();
    } catch (error) {
      console.error('Error updating emergency:', error);
    }
  };

  const recentEmergencies = emergencies.slice(0, 5);
  const recentPatients = patients.slice(0, 5);

  const statCards = [
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      icon: UserGroupIcon,
      color: 'bg-primary-500',
      change: '+12%'
    },
    {
      title: 'Active Emergencies',
      value: stats.activeEmergencies,
      icon: ExclamationTriangleIcon,
      color: 'bg-danger-500',
      change: '+3'
    },
    {
      title: 'Today\'s Appointments',
      value: stats.todayAppointments,
      icon: CalendarIcon,
      color: 'bg-success-500',
      change: '2 remaining'
    },
    {
      title: 'Completed Cases',
      value: stats.completedCases,
      icon: CheckCircleIcon,
      color: 'bg-warning-500',
      change: '+8 this week'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, Dr. {user?.name || 'Doctor'}!
        </h1>
        <p className="text-gray-600">Here's your medical dashboard overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} padding="md">
            <div className="flex items-center">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mr-4`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-success-600">{stat.change}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Emergencies */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Active Emergencies</h3>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {recentEmergencies.length > 0 ? (
              recentEmergencies.map((emergency) => (
                <div key={emergency.id} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{emergency.patientName}</h4>
                      <p className="text-sm text-gray-600">{emergency.emergencyType}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      emergency.severity === 'Critical' ? 'bg-danger-100 text-danger-800' :
                      emergency.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                      emergency.severity === 'Medium' ? 'bg-warning-100 text-warning-800' :
                      'bg-success-100 text-success-800'
                    }`}>
                      {emergency.severity}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 space-x-4 mb-2">
                    <div className="flex items-center">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {emergency.location}
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {new Date(emergency.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                  {emergency.description && (
                    <p className="text-sm text-gray-700 mb-3">{emergency.description}</p>
                  )}
                  <div className="flex space-x-2">
                    {emergency.status === 'Active' && (
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleEmergencyAction(emergency.id, 'accept')}
                      >
                        Accept Case
                      </Button>
                    )}
                    {emergency.status === 'In Progress' && (
                      <Button
                        size="sm"
                        variant="warning"
                        onClick={() => handleEmergencyAction(emergency.id, 'resolve')}
                      >
                        Mark Resolved
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <EyeIcon className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No active emergencies</p>
            )}
          </div>
        </Card>

        {/* Recent Patients */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Patients</h3>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {recentPatients.length > 0 ? (
              recentPatients.map((patient: any) => (
                <div key={patient.id} className="flex items-center p-3 border border-gray-200 rounded-lg">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <UserGroupIcon className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{patient.name || 'Unknown'}</h4>
                    <p className="text-sm text-gray-600">{patient.email}</p>
                    {patient.profile?.phone && (
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <PhoneIcon className="h-4 w-4 mr-1" />
                        {patient.profile.phone}
                      </div>
                    )}
                  </div>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No patients found</p>
            )}
          </div>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
        <div className="space-y-3">
          {[
            { time: '09:00 AM', patient: 'John Doe', type: 'Follow-up', status: 'Upcoming' },
            { time: '10:30 AM', patient: 'Jane Smith', type: 'Consultation', status: 'In Progress' },
            { time: '02:00 PM', patient: 'Bob Johnson', type: 'Check-up', status: 'Scheduled' },
            { time: '03:30 PM', patient: 'Alice Brown', type: 'Emergency', status: 'Scheduled' }
          ].map((appointment, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-primary-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">{appointment.time}</p>
                  <p className="text-sm text-gray-600">{appointment.patient} - {appointment.type}</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                appointment.status === 'In Progress' ? 'bg-warning-100 text-warning-800' :
                appointment.status === 'Upcoming' ? 'bg-primary-100 text-primary-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {appointment.status}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="primary" className="justify-start">
            <UserGroupIcon className="h-5 w-5 mr-2" />
            View All Patients
          </Button>
          <Button variant="outline" className="justify-start">
            <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
            Emergency Cases
          </Button>
          <Button variant="outline" className="justify-start">
            <ChartBarIcon className="h-5 w-5 mr-2" />
            View Analytics
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default DoctorDashboard;
