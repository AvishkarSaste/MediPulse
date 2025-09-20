import React, { useState, useEffect } from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { patientsApi } from '../api/patients';
import { User } from '../api/auth';
import { 
  MagnifyingGlassIcon,
  PlusIcon,
  FunnelIcon,
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';


const Patients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [patients, setPatients] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const data = await patientsApi.getAll();
      setPatients(data);
    } catch (err) {
      setError('Failed to load patients');
      console.error('Error loading patients:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success-100 text-success-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'emergency': return 'bg-danger-100 text-danger-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-600">Manage and monitor patient information</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button variant="primary" size="md">
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Patient
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <Card padding="md">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients by name, email, or health ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input w-auto"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="emergency">Emergency</option>
            </select>
            <Button variant="outline" size="md">
              <FunnelIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading patients...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card padding="md" className="text-center">
          <div className="text-danger-600 mb-4">
            <p className="text-sm">{error}</p>
          </div>
          <Button variant="primary" onClick={loadPatients}>
            Try Again
          </Button>
        </Card>
      )}

      {/* Patients Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <Card key={patient.id} padding="md">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{patient.name || 'Unknown'}</h3>
                    <p className="text-sm text-gray-500 capitalize">{patient.role}</p>
                  </div>
                </div>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-success-100 text-success-800">
                  Active
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <EnvelopeIcon className="h-4 w-4 mr-2" />
                  {patient.email || 'N/A'}
                </div>
                {patient.profile?.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    {patient.profile.phone}
                  </div>
                )}
                {patient.profile?.address && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    {patient.profile.address.city}, {patient.profile.address.state}
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-600">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Joined: {new Date(patient.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
                <Button variant="primary" size="sm" className="flex-1">
                  Edit
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredPatients.length === 0 && (
        <Card padding="lg" className="text-center">
          <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No patients found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by adding a new patient.'}
          </p>
          <div className="mt-6">
            <Button variant="primary">
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Patient
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Patients;
