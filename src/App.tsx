import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import './styles/globals.css';
import SplashScreen from './components/ui/SplashScreen';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = React.useState(true);

  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
