import React, { useState, useEffect } from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { patientsApi } from '../api/patients';
import { doctorsApi } from '../api/doctors';
import { emergenciesApi, Emergency } from '../api/emergencies';
import { useAuth } from '../context/AuthContext';
import { 
  UserGroupIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  PlusIcon,
  CogIcon
} from '@heroicons/react/24/outline';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    activeEmergencies: 0,
    resolvedEmergencies: 0,
    totalUsers: 0,
    systemHealth: 'Good'
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [patientsData, doctorsData, emergenciesData] = await Promise.all([
        patientsApi.getAll(),
        doctorsApi.getAll(),
        emergenciesApi.getAll()
      ]);
      
      setPatients(patientsData);
      setDoctors(doctorsData);
      setEmergencies(emergenciesData);
      
      setStats({
        totalPatients: patientsData.length,
        totalDoctors: doctorsData.length,
        activeEmergencies: emergenciesData.filter(e => e.status === 'Active').length,
        resolvedEmergencies: emergenciesData.filter(e => e.status === 'Resolved').length,
        totalUsers: patientsData.length + doctorsData.length,
        systemHealth: 'Good'
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmergencyAction = async (emergencyId: number, action: string) => {
    try {
      if (action === 'assign') {
        await emergenciesApi.updateStatus(emergencyId, { 
          status: 'In Progress', 
          assignedDoctor: 'Dr. Admin' 
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
  const recentDoctors = doctors.slice(0, 5);

  const statCards = [
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      icon: UserGroupIcon,
      color: 'bg-primary-500',
      change: '+12%'
    },
    {
      title: 'Total Doctors',
      value: stats.totalDoctors,
      icon: UserGroupIcon,
      color: 'bg-success-500',
      change: '+2'
    },
    {
      title: 'Active Emergencies',
      value: stats.activeEmergencies,
      icon: ExclamationTriangleIcon,
      color: 'bg-danger-500',
      change: '+3'
    },
    {
      title: 'Resolved Cases',
      value: stats.resolvedEmergencies,
      icon: CheckCircleIcon,
      color: 'bg-warning-500',
      change: '+8 this week'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: UserGroupIcon,
      color: 'bg-purple-500',
      change: '+15%'
    },
    {
      title: 'System Health',
      value: stats.systemHealth,
      icon: CogIcon,
      color: 'bg-green-500',
      change: 'All systems operational'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">System overview and management</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} padding="md">
            <div className="text-center">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-success-600">{stat.change}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {new Date(emergency.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {emergency.status === 'Active' && (
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleEmergencyAction(emergency.id, 'assign')}
                      >
                        Assign Doctor
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
                      View
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

        {/* Recent Doctors */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Doctors</h3>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {recentDoctors.length > 0 ? (
              recentDoctors.map((doctor: any) => (
                <div key={doctor.id} className="flex items-center p-3 border border-gray-200 rounded-lg">
                  <div className="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center mr-3">
                    <UserGroupIcon className="h-5 w-5 text-success-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{doctor.name || 'Unknown'}</h4>
                    <p className="text-sm text-gray-600">{doctor.email}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No doctors found</p>
            )}
          </div>
        </Card>
      </div>

      {/* System Management */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button variant="primary" className="justify-start">
            <UserGroupIcon className="h-5 w-5 mr-2" />
            Manage Users
          </Button>
          <Button variant="outline" className="justify-start">
            <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
            Emergency Management
          </Button>
          <Button variant="outline" className="justify-start">
            <ChartBarIcon className="h-5 w-5 mr-2" />
            System Analytics
          </Button>
          <Button variant="outline" className="justify-start">
            <CogIcon className="h-5 w-5 mr-2" />
            System Settings
          </Button>
        </div>
      </Card>

      {/* System Status */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center p-3 bg-success-50 rounded-lg">
            <CheckCircleIcon className="h-6 w-6 text-success-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Database</p>
              <p className="text-sm text-success-600">Operational</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-success-50 rounded-lg">
            <CheckCircleIcon className="h-6 w-6 text-success-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">API Services</p>
              <p className="text-sm text-success-600">Operational</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-warning-50 rounded-lg">
            <ClockIcon className="h-6 w-6 text-warning-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">AI Services</p>
              <p className="text-sm text-warning-600">Limited</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
