import React, { useState } from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import EmergencySOS from '../components/EmergencySOS';
import { useAuth } from '../context/AuthContext';
import { 
  ExclamationTriangleIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  HeartIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const EmergencySOSPage: React.FC = () => {
  const { user } = useAuth();
  const [showSOSModal, setShowSOSModal] = useState(false);

  const emergencyContacts = [
    {
      name: 'Emergency Services',
      number: '911',
      description: 'Police, Fire, Medical Emergency',
      icon: ExclamationTriangleIcon,
      color: 'bg-danger-500'
    },
    {
      name: 'Poison Control',
      number: '1-800-222-1222',
      description: '24/7 Poison Emergency Hotline',
      icon: PhoneIcon,
      color: 'bg-warning-500'
    },
    {
      name: 'Suicide Prevention',
      number: '988',
      description: 'Crisis Text Line & Suicide Prevention',
      icon: HeartIcon,
      color: 'bg-primary-500'
    },
    {
      name: 'MediPulse Emergency',
      number: '1-800-MEDIPULSE',
      description: 'Direct hospital emergency line',
      icon: ShieldCheckIcon,
      color: 'bg-success-500'
    }
  ];

  const emergencySteps = [
    {
      step: 1,
      title: 'Stay Calm',
      description: 'Take deep breaths and try to remain calm. Panic can make the situation worse.',
      icon: HeartIcon
    },
    {
      step: 2,
      title: 'Assess the Situation',
      description: 'Quickly evaluate if this is a life-threatening emergency that requires immediate medical attention.',
      icon: ExclamationTriangleIcon
    },
    {
      step: 3,
      title: 'Call for Help',
      description: 'Use the emergency SOS button or call 911 immediately if it\'s a life-threatening situation.',
      icon: PhoneIcon
    },
    {
      step: 4,
      title: 'Provide Location',
      description: 'Give your exact location and any relevant details about the emergency.',
      icon: MapPinIcon
    },
    {
      step: 5,
      title: 'Follow Instructions',
      description: 'Listen carefully to the emergency operator and follow their instructions.',
      icon: ClockIcon
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Emergency SOS</h1>
        <p className="text-gray-600">Quick access to emergency services and medical help</p>
      </div>

      {/* Emergency Alert Button */}
      <div className="bg-danger-50 border-2 border-danger-200 rounded-2xl p-8 text-center">
        <ExclamationTriangleIcon className="mx-auto h-16 w-16 text-danger-600 mb-4" />
        <h2 className="text-2xl font-bold text-danger-900 mb-2">Medical Emergency?</h2>
        <p className="text-danger-700 mb-6">
          If you're experiencing a medical emergency, click the button below to send an immediate alert to medical staff.
        </p>
        <Button
          variant="danger"
          size="lg"
          onClick={() => setShowSOSModal(true)}
          className="bg-danger-600 hover:bg-danger-700 text-white px-8 py-4 text-lg font-semibold"
        >
          <ExclamationTriangleIcon className="h-6 w-6 mr-2" />
          SEND EMERGENCY ALERT
        </Button>
        <p className="text-sm text-danger-600 mt-4">
          This will immediately notify medical staff and emergency services
        </p>
      </div>

      {/* Emergency Steps */}
      <Card padding="lg">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">What to Do in an Emergency</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {emergencySteps.map((step) => (
            <div key={step.step} className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <step.icon className="h-6 w-6 text-primary-600" />
              </div>
              <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                {step.step}
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">{step.title}</h4>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Emergency Contacts */}
      <Card padding="lg">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Emergency Contacts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {emergencyContacts.map((contact, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3">
                <div className={`w-10 h-10 ${contact.color} rounded-lg flex items-center justify-center mr-3`}>
                  <contact.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{contact.name}</h4>
                  <p className="text-sm text-gray-600">{contact.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary-600">{contact.number}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`tel:${contact.number}`)}
                >
                  <PhoneIcon className="h-4 w-4 mr-1" />
                  Call
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Patient Information */}
      <Card padding="lg">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Emergency Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Personal Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{user?.name || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{user?.email || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium">{user?.profile?.phone || 'Not provided'}</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Emergency Contact</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Contact Name:</span>
                <span className="font-medium">{user?.profile?.emergencyContact?.name || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Contact Phone:</span>
                <span className="font-medium">{user?.profile?.emergencyContact?.phone || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Relationship:</span>
                <span className="font-medium">{user?.profile?.emergencyContact?.relationship || 'Not provided'}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-warning-50 border border-warning-200 rounded-lg">
          <p className="text-sm text-warning-700">
            <strong>Note:</strong> Make sure your emergency contact information is up to date in your profile. 
            This information will be shared with emergency responders if needed.
          </p>
        </div>
      </Card>

      {/* Emergency SOS Modal */}
      <EmergencySOS isOpen={showSOSModal} onClose={() => setShowSOSModal(false)} />
    </div>
  );
};

export default EmergencySOSPage;
