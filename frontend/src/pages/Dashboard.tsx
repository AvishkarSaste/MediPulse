import React from 'react';
import { useAuth } from '../context/AuthContext';
import PatientDashboard from './PatientDashboard';
import DoctorDashboard from './DoctorDashboard';
import AdminDashboard from './AdminDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Render different dashboards based on user role
  if (user?.role === 'patient') {
    return <PatientDashboard />;
  } else if (user?.role === 'doctor') {
    return <DoctorDashboard />;
  } else if (user?.role === 'admin') {
    return <AdminDashboard />;
  }

  // Fallback for unknown roles
  return (
    <div className="text-center py-8">
      <p className="text-gray-500">Loading dashboard...</p>
    </div>
  );
};

export default Dashboard;