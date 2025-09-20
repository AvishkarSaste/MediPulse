import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Patients from './pages/Patients';
import Doctors from './pages/Doctors';
import Emergencies from './pages/Emergencies';
import AIAssistant from './pages/AIAssistant';
import Profile from './pages/Profile';
import EmergencySOSPage from './pages/EmergencySOSPage';

const AppContent: React.FC = () => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  const userData = {
    name: user?.name || 'User',
    role: user?.role || 'patient',
    avatar: ''
  };

  return (
    <Layout user={userData} onLogout={() => {}}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/emergencies" element={<Emergencies />} />
        <Route path="/emergency-sos" element={<EmergencySOSPage />} />
        <Route path="/ai-assistant" element={<AIAssistant />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;