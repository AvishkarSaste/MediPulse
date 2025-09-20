import React, { useState, useEffect } from 'react';
import { emergenciesApi } from '../api/emergencies';
import { useAuth } from '../context/AuthContext';
import Button from './UI/Button';
import Modal from './UI/Modal';
import { 
  ExclamationTriangleIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface EmergencySOSProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmergencySOS: React.FC<EmergencySOSProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [emergencyData, setEmergencyData] = useState({
    emergencyType: '',
    severity: 'High' as 'Low' | 'Medium' | 'High' | 'Critical',
    location: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setEmergencyData(prev => ({
            ...prev,
            location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
          setEmergencyData(prev => ({
            ...prev,
            location: 'Location not available'
          }));
        }
      );
    }
  }, []);

  // Countdown timer for emergency submission
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emergencyData.emergencyType || !emergencyData.location) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await emergenciesApi.create(emergencyData);
      setSuccess(true);
      setCountdown(5);
      
      // Auto-close after 5 seconds
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setEmergencyData({
          emergencyType: '',
          severity: 'High',
          location: '',
          description: ''
        });
      }, 5000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send emergency alert');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmergencyData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const emergencyTypes = [
    'Cardiac Emergency',
    'Respiratory Distress',
    'Severe Bleeding',
    'Loss of Consciousness',
    'Severe Allergic Reaction',
    'Stroke Symptoms',
    'Severe Pain',
    'Drug Overdose',
    'Seizure',
    'Other Medical Emergency'
  ];

  if (success) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <div className="text-center py-8">
          <CheckCircleIcon className="mx-auto h-16 w-16 text-success-600 mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Emergency Alert Sent!</h3>
          <p className="text-gray-600 mb-4">
            Your emergency has been reported to medical staff. Help is on the way.
          </p>
          <p className="text-sm text-gray-500">
            This window will close automatically in {countdown} seconds
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-danger-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Emergency SOS</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-danger-50 border border-danger-200 rounded-lg">
            <p className="text-sm text-danger-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Emergency Type */}
          <div>
            <label className="label">Type of Emergency *</label>
            <select
              name="emergencyType"
              value={emergencyData.emergencyType}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="">Select emergency type</option>
              {emergencyTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Severity Level */}
          <div>
            <label className="label">Severity Level *</label>
            <select
              name="severity"
              value={emergencyData.severity}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="Low">Low - Non-urgent</option>
              <option value="Medium">Medium - Urgent</option>
              <option value="High">High - Critical</option>
              <option value="Critical">Critical - Life-threatening</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="label">Location *</label>
            <div className="flex items-center">
              <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                name="location"
                value={emergencyData.location}
                onChange={handleChange}
                className="input flex-1"
                placeholder="Current location or address"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              GPS coordinates will be automatically detected if location services are enabled
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="label">Description</label>
            <textarea
              name="description"
              value={emergencyData.description}
              onChange={handleChange}
              className="input h-24 resize-none"
              placeholder="Describe the emergency situation, symptoms, or what happened..."
            />
          </div>

          {/* Patient Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Patient Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Name:</span>
                <span className="ml-2 font-medium">{user?.name || 'Unknown'}</span>
              </div>
              <div>
                <span className="text-gray-600">Email:</span>
                <span className="ml-2 font-medium">{user?.email || 'Unknown'}</span>
              </div>
              <div>
                <span className="text-gray-600">Phone:</span>
                <span className="ml-2 font-medium">{user?.profile?.phone || 'Not provided'}</span>
              </div>
              <div>
                <span className="text-gray-600">Emergency Contact:</span>
                <span className="ml-2 font-medium">
                  {user?.profile?.emergencyContact?.name || 'Not provided'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="danger"
              loading={loading}
              disabled={loading}
            >
              <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
              Send Emergency Alert
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EmergencySOS;
