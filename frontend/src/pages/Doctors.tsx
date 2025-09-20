import React, { useState, useEffect } from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { doctorsApi } from '../api/doctors';
import { User } from '../api/auth';
import { 
  MagnifyingGlassIcon,
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

const Doctors: React.FC = () => {
  const [doctors, setDoctors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const data = await doctorsApi.getAll();
      setDoctors(data);
    } catch (err) {
      setError('Failed to load doctors');
      console.error('Error loading doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(doctor => 
    doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctors</h1>
          <p className="text-gray-600">Manage and view doctor information</p>
        </div>
      </div>

      {/* Search */}
      <Card padding="md">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search doctors by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading doctors...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card padding="md" className="text-center">
          <div className="text-danger-600 mb-4">
            <p className="text-sm">{error}</p>
          </div>
          <Button variant="primary" onClick={loadDoctors}>
            Try Again
          </Button>
        </Card>
      )}

      {/* Doctors Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id} padding="md">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{doctor.name || 'Unknown'}</h3>
                    <p className="text-sm text-gray-500 capitalize">{doctor.role}</p>
                  </div>
                </div>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-success-100 text-success-800">
                  Active
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <EnvelopeIcon className="h-4 w-4 mr-2" />
                  {doctor.email || 'N/A'}
                </div>
                {doctor.profile?.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    {doctor.profile.phone}
                  </div>
                )}
                {doctor.profile?.address && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    {doctor.profile.address.city}, {doctor.profile.address.state}
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-600">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Joined: {new Date(doctor.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Profile
                </Button>
                <Button variant="primary" size="sm" className="flex-1">
                  Contact
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredDoctors.length === 0 && (
        <Card padding="lg" className="text-center">
          <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No doctors found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search criteria.' : 'No doctors are currently registered.'}
          </p>
        </Card>
      )}
    </div>
  );
};

export default Doctors;
