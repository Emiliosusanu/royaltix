
import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

// AuthRedirectHandler: Moved inside the layout to ensure context
function AuthRedirectHandler({ session }) {
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth event (in MainLayout/AuthRedirectHandler):", event, currentSession);

        if (event === 'PASSWORD_RECOVERY' && location.pathname !== '/update-password') {
          navigate('/update-password', { replace: true });
        } else if (event === 'SIGNED_IN') {
           const from = location.state?.from?.pathname || '/';
           if (['/auth', '/forgot-password'].includes(location.pathname)) {
             navigate(from === '/auth' || from === '/forgot-password' ? '/' : from, { replace: true });
           }
        } else if (event === 'SIGNED_OUT') {
           if (!['/auth', '/forgot-password', '/update-password'].includes(location.pathname)) {
             navigate('/auth', { replace: true });
           }
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [navigate, location.pathname, location.state, session]);

  return null; // Doesn't render anything visual
}


// MainLayout Component
function MainLayout({ session }) {
  return (
    <>
      <AuthRedirectHandler session={session} />
      <Outlet /> {/* Renders the matched child route (e.g., KdpDashboard) */}
    </>
  );
}

export default MainLayout;
  