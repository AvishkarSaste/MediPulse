import React, { useState, useEffect } from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { emergenciesApi, Emergency } from '../api/emergencies';
import { useAuth } from '../context/AuthContext';
import { 
  ExclamationTriangleIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  PhoneIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon
} from '@heroicons/react/24/outline';


const Emergencies: React.FC = () => {
  const { user } = useAuth();
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({
    emergencyType: '',
    severity: 'Medium' as 'Low' | 'Medium' | 'High' | 'Critical',
    location: '',
    description: ''
  });

  useEffect(() => {
    loadEmergencies();
  }, []);

  const loadEmergencies = async () => {
    try {
      setLoading(true);
      const data = await emergenciesApi.getAll();
      setEmergencies(data);
    } catch (err) {
      setError('Failed to load emergencies');
      console.error('Error loading emergencies:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmergencies = filterStatus === 'all' 
    ? emergencies 
    : emergencies.filter(emergency => emergency.status === filterStatus);

  const handleCreateEmergency = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await emergenciesApi.create(createForm);
      setShowCreateForm(false);
      setCreateForm({
        emergencyType: '',
        severity: 'Medium',
        location: '',
        description: ''
      });
      loadEmergencies();
    } catch (err) {
      setError('Failed to create emergency');
    }
  };

  const handleUpdateStatus = async (id: number, status: string, assignedDoctor?: string) => {
    try {
      await emergenciesApi.updateStatus(id, { status: status as any, assignedDoctor });
      loadEmergencies();
    } catch (err) {
      setError('Failed to update emergency status');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-danger-100 text-danger-800 border-danger-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-warning-100 text-warning-800 border-warning-200';
      case 'Low': return 'bg-success-100 text-success-800 border-success-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-danger-100 text-danger-800';
      case 'In Progress': return 'bg-warning-100 text-warning-800';
      case 'Resolved': return 'bg-success-100 text-success-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <XCircleIcon className="h-5 w-5" />;
      case 'In Progress': return <ClockIcon className="h-5 w-5" />;
      case 'Resolved': return <CheckCircleIcon className="h-5 w-5" />;
      default: return <ClockIcon className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Emergency Cases</h1>
          <p className="text-gray-600">Monitor and manage emergency situations</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button variant="danger" size="md">
            <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
            Report Emergency
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card padding="md">
          <div className="flex items-center">
            <div className="p-2 bg-danger-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-danger-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Active Emergencies</p>
              <p className="text-2xl font-bold text-danger-600">2</p>
            </div>
          </div>
        </Card>
        
        <Card padding="md">
          <div className="flex items-center">
            <div className="p-2 bg-warning-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-warning-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-warning-600">1</p>
            </div>
          </div>
        </Card>
        
        <Card padding="md">
          <div className="flex items-center">
            <div className="p-2 bg-success-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-success-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Resolved Today</p>
              <p className="text-2xl font-bold text-success-600">1</p>
            </div>
          </div>
        </Card>
        
        <Card padding="md">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <UserIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Cases</p>
              <p className="text-2xl font-bold text-primary-600">3</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter */}
      <Card padding="md">
        <div className="flex gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input w-auto"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </Card>

      {/* Emergency Cases */}
      <div className="space-y-4">
        {filteredEmergencies.map((emergency) => (
          <Card key={emergency.id} padding="md">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{emergency.patientName}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(emergency.priority)}`}>
                    {emergency.priority.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(emergency.status)}`}>
                    {emergency.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                
                <p className="text-gray-700 mb-3">{emergency.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    {emergency.location}
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    {new Date(emergency.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2 ml-4">
                <Button variant="primary" size="sm">
                  View Details
                </Button>
                {emergency.status === 'Active' && (
                  <Button 
                    variant="success" 
                    size="sm"
                    onClick={() => handleUpdateStatus(emergency.id, 'In Progress')}
                  >
                    Accept Case
                  </Button>
                )}
                {emergency.status === 'In Progress' && (
                  <Button 
                    variant="warning" 
                    size="sm"
                    onClick={() => handleUpdateStatus(emergency.id, 'Resolved')}
                  >
                    Mark Resolved
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredEmergencies.length === 0 && (
        <Card padding="lg" className="text-center">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No emergencies found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filterStatus === 'all' ? 'No emergency cases at the moment.' : `No ${filterStatus} emergency cases.`}
          </p>
        </Card>
      )}
    </div>
  );
};

export default Emergencies;
