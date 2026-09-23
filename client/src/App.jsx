import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ConfigProvider } from './context/ConfigContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Milestones } from './pages/Milestones';
import { Leaderboard } from './pages/Leaderboard';
import { Analytics } from './pages/Analytics';
import { Resources } from './pages/Resources';
import { Settings } from './pages/Settings';
import { AdminPanel } from './pages/AdminPanel';

// Route guard for authenticated users
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-500">Checking authorization sessions...</p>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

// Route guard for admin-only pages
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-8 h-8 border-4 border-indigo-550 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return user && user.role === 'admin' ? children : <Navigate to="/dashboard" replace />;
};

// Route guard for public-only auth routes (Login/Register)
const AuthRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-8 h-8 border-4 border-indigo-550 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return !user ? children : <Navigate to="/dashboard" replace />;
};

// App Layout wrapper containing Navbar & Sidebar
const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
      <Navbar onMenuClick={() => setSidebarOpen(prev => !prev)} />
      
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 max-w-[1600px] overflow-x-hidden">
          <Routes>
            {/* Public Pages */}
            <Route path="" element={<Home />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="milestones" element={<Milestones />} />
            <Route path="arcade-facilitator" element={<Milestones />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="resources" element={<Resources />} />

            {/* Guarded Pages */}
            <Route path="analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
            <Route path="settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            <Route path="admin" element={<PrivateRoute><AdminRoute><AdminPanel /></AdminRoute></PrivateRoute>} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export const AppContent = () => {
  return (
    <Routes>
      {/* Auth Guard Pages */}
      <Route
        path="/login"
        element={
          <AuthRoute>
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
              <Login />
            </div>
          </AuthRoute>
        }
      />
      <Route
        path="/register"
        element={
          <AuthRoute>
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
              <Register />
            </div>
          </AuthRoute>
        }
      />

      {/* Main Layout containing Public & Private Pages */}
      <Route
        path="/*"
        element={
          <ConfigProvider>
            <DashboardLayout />
          </ConfigProvider>
        }
      />
    </Routes>
  );
};

export const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
