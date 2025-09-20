import React, { useState, useEffect } from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useAuth } from '../context/AuthContext';
import { User } from '../api/auth';
import { 
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    dateOfBirth: '',
    gender: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.profile?.phone || '',
        address: {
          street: user.profile?.address?.street || '',
          city: user.profile?.address?.city || '',
          state: user.profile?.address?.state || '',
          zipCode: user.profile?.address?.zipCode || '',
          country: user.profile?.address?.country || ''
        },
        dateOfBirth: user.profile?.dateOfBirth ? new Date(user.profile.dateOfBirth).toISOString().split('T')[0] : '',
        gender: user.profile?.gender || '',
        emergencyContact: {
          name: user.profile?.emergencyContact?.name || '',
          phone: user.profile?.emergencyContact?.phone || '',
          relationship: user.profile?.emergencyContact?.relationship || ''
        }
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await updateProfile({
        name: formData.name,
        profile: {
          phone: formData.phone,
          address: formData.address,
          dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : undefined,
          gender: formData.gender as 'male' | 'female' | 'other' | undefined,
          emergencyContact: formData.emergencyContact
        }
      });

      if (error) {
        setError(error);
      } else {
        setSuccess('Profile updated successfully');
        setIsEditing(false);
      }
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.profile?.phone || '',
        address: {
          street: user.profile?.address?.street || '',
          city: user.profile?.address?.city || '',
          state: user.profile?.address?.state || '',
          zipCode: user.profile?.address?.zipCode || '',
          country: user.profile?.address?.country || ''
        },
        dateOfBirth: user.profile?.dateOfBirth ? new Date(user.profile.dateOfBirth).toISOString().split('T')[0] : '',
        gender: user.profile?.gender || '',
        emergencyContact: {
          name: user.profile?.emergencyContact?.name || '',
          phone: user.profile?.emergencyContact?.phone || '',
          relationship: user.profile?.emergencyContact?.relationship || ''
        }
      });
    }
    setIsEditing(false);
    setError(null);
    setSuccess(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value
        }
      }));
    } else if (name.startsWith('emergencyContact.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Manage your personal information</p>
        </div>
        {!isEditing && (
          <Button
            variant="primary"
            onClick={() => setIsEditing(true)}
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      {/* Success/Error Messages */}
      {success && (
        <Card padding="md" className="bg-success-50 border-success-200">
          <div className="text-success-600">
            <p className="text-sm">{success}</p>
          </div>
        </Card>
      )}

      {error && (
        <Card padding="md" className="bg-danger-50 border-danger-200">
          <div className="text-danger-600">
            <p className="text-sm">{error}</p>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <Card>
          <div className="text-center">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserIcon className="h-12 w-12 text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
            <p className="text-gray-500 capitalize">{user.role}</p>
            <p className="text-sm text-gray-400 mt-2">{user.email}</p>
            <div className="mt-4 text-sm text-gray-600">
              <p>Member since {new Date(user.createdAt).toLocaleDateString()}</p>
              {user.lastLogin && (
                <p>Last login: {new Date(user.lastLogin).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Profile Form */}
        <Card className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input"
                    disabled={!isEditing}
                    required
                  />
                </div>
                <div>
                  <label className="label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input"
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="label">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="input"
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="label">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="input"
                    disabled={!isEditing}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="label">Street Address</label>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleChange}
                    className="input"
                    disabled={!isEditing}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="label">City</label>
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleChange}
                      className="input"
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="label">State</label>
                    <input
                      type="text"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleChange}
                      className="input"
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="label">ZIP Code</label>
                    <input
                      type="text"
                      name="address.zipCode"
                      value={formData.address.zipCode}
                      onChange={handleChange}
                      className="input"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Country</label>
                  <input
                    type="text"
                    name="address.country"
                    value={formData.address.country}
                    onChange={handleChange}
                    className="input"
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="label">Contact Name</label>
                  <input
                    type="text"
                    name="emergencyContact.name"
                    value={formData.emergencyContact.name}
                    onChange={handleChange}
                    className="input"
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="label">Phone Number</label>
                  <input
                    type="tel"
                    name="emergencyContact.phone"
                    value={formData.emergencyContact.phone}
                    onChange={handleChange}
                    className="input"
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="label">Relationship</label>
                  <input
                    type="text"
                    name="emergencyContact.relationship"
                    value={formData.emergencyContact.relationship}
                    onChange={handleChange}
                    className="input"
                    disabled={!isEditing}
                    placeholder="e.g., Spouse, Parent, Sibling"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  <XMarkIcon className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                >
                  <CheckIcon className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
