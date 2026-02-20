import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Directory } from './pages/Directory';
import { ListingDetail } from './pages/ListingDetail';
import { AuthPages } from './pages/AuthPages';

const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role?: string }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role && user.role !== 'admin') return <Navigate to="/" />;
  return <>{children}</>;
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes with Layout */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/annuaire" element={<Layout><Directory /></Layout>} />
          <Route path="/listing/:slug" element={<Layout><ListingDetail /></Layout>} />
          
          {/* Auth Routes without main layout */}
          <Route path="/login" element={<AuthPages mode="login" />} />
          <Route path="/register" element={<AuthPages mode="register" />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <div className="max-w-7xl mx-auto px-4 py-12">
                  <h1 className="text-3xl font-bold mb-8">Tableau de bord</h1>
                  <p className="text-slate-500 italic">Interface du tableau de bord en cours de développement...</p>
                </div>
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute role="admin">
              <Layout>
                <div className="max-w-7xl mx-auto px-4 py-12">
                  <h1 className="text-3xl font-bold mb-8">Administration</h1>
                  <p className="text-slate-500 italic">Interface d'administration en cours de développement...</p>
                </div>
              </Layout>
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
