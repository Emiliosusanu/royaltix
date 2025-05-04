
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import KdpDashboard from '@/components/KdpDashboard';
import Auth from '@/components/Auth';
import ForgotPassword from '@/components/ForgotPassword';
import UpdatePassword from '@/components/UpdatePassword';
import MainLayout from '@/components/MainLayout';

// Location hook needed for redirect state
function RedirectToAuth() {
  const location = useLocation();
  return <Navigate to="/auth" state={{ from: location }} replace />;
}

function AppRouter({ session }) {
  return (
    <Routes>
      {/* Main Protected Route - Logic inlined */}
      <Route
        path="/"
        element={
          session ? (
            <MainLayout session={session}>
              <KdpDashboard key={session.user.id} session={session} />
            </MainLayout>
          ) : (
            <RedirectToAuth /> // Use component to get location for state
          )
        }
      />

      {/* Authentication Routes */}
      <Route path="/auth" element={!session ? <Auth /> : <Navigate to="/" replace />} />
      <Route path="/forgot-password" element={!session ? <ForgotPassword /> : <Navigate to="/" replace />} />
      <Route path="/update-password" element={<UpdatePassword />} />

      {/* Catch-all Route */}
      <Route path="*" element={<Navigate to={session ? "/" : "/auth"} replace />} />
    </Routes>
  );
}

export default AppRouter;
   