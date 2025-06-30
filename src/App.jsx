// Main App Component with Routing
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import QRLogin from './components/QRLogin';
import UserRegistration from './pages/UserRegistration';
import InspectionForm from './pages/InspectionForm';
import { Loader2 } from './components/Icons';

// Loading Component
const LoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="animate-spin mx-auto mb-4 text-green-600" size={48} />
      <p className="text-gray-600">Carregando...</p>
    </div>
  </div>
);

// Main App Router Component
const AppRouter = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const [showRegistration, setShowRegistration] = useState(false);
  const [pendingPRN, setPendingPRN] = useState(null);

  // Show loading screen while checking authentication
  if (loading) {
    return <LoadingScreen />;
  }

  // Handle login success (existing user)
  const handleLoginSuccess = (userData) => {
    // User is already authenticated via useAuth hook
    // This will automatically redirect to InspectionForm
  };

  // Handle new user registration needed
  const handleNeedRegistration = (prn) => {
    setPendingPRN(prn);
    setShowRegistration(true);
  };

  // Handle registration completion
  const handleRegistrationSuccess = (userData) => {
    setShowRegistration(false);
    setPendingPRN(null);
    // User is now authenticated and will see InspectionForm
  };

  // Show registration form if needed
  if (showRegistration && pendingPRN) {
    return (
      <UserRegistration
        prn={pendingPRN}
        onRegistrationSuccess={handleRegistrationSuccess}
      />
    );
  }

  // Show main form if user is authenticated
  if (isAuthenticated && user) {
    return <InspectionForm />;
  }

  // Show login screen by default
  return (
    <QRLogin
      onLoginSuccess={handleLoginSuccess}
      onNeedRegistration={handleNeedRegistration}
    />
  );
};

// Main App Component
const App = () => {
  return (
    <AuthProvider>
      <div className="App">
        <AppRouter />
      </div>
    </AuthProvider>
  );
};

export default App;

