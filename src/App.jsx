
    import React, { useState, useEffect } from 'react';
    import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
    import { supabase } from '@/lib/supabaseClient';
    import { Toaster } from '@/components/ui/toaster';
    import KdpDashboard from '@/components/KdpDashboard';
    import Auth from '@/components/Auth';
    import ForgotPassword from '@/components/ForgotPassword';
    import UpdatePassword from '@/components/UpdatePassword';
    import ErrorBoundary from '@/components/ErrorBoundary'; // Import ErrorBoundary
    import { Loader2 } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';

    // ProtectedRoute component to handle authenticated routes
    function ProtectedRoute({ session, isLoading, children }) {
      const location = useLocation();

      if (isLoading) {
        // App's main loader covers initial load, this is for subsequent checks if needed
        return null;
      }

      if (!session) {
        // Redirect them to the /auth page, saving the current location
        return <Navigate to="/auth" state={{ from: location }} replace />;
      }
      return children;
    }

    function App() {
      const [session, setSession] = useState(null);
      const [loadingInitial, setLoadingInitial] = useState(true);
      const location = useLocation();
      const navigate = useNavigate();

      useEffect(() => {
        // Initial session check
        supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
          setSession(currentSession);
          setLoadingInitial(false);
        }).catch((error) => {
          console.error("Error getting initial session:", error);
          setLoadingInitial(false);
        });

        // Listener for auth state changes
        const { data: authListener } = supabase.auth.onAuthStateChange(
          (event, currentSession) => {
            console.log("Auth event:", event, currentSession);
            setSession(currentSession);
            setLoadingInitial(false); // Ensure loading is false after any auth event

            // Handle redirects based on auth events
            if (event === 'PASSWORD_RECOVERY') {
              if (location.pathname !== '/update-password') {
                navigate('/update-password', { replace: true });
              }
            } else if (event === 'SIGNED_IN') {
               const from = location.state?.from?.pathname || '/';
               if (location.pathname !== from && !location.pathname.startsWith(from + '/')) {
                 navigate(from, { replace: true });
               } else if (location.pathname.startsWith('/auth') || location.pathname === '/forgot-password') {
                  navigate('/', {replace: true});
               }
            } else if (event === 'SIGNED_OUT') {
              if (!['/auth', '/forgot-password', '/update-password'].includes(location.pathname)) {
                  navigate('/auth', { replace: true });
              }
            }
          }
        );

        // Cleanup listener
        return () => {
          authListener?.subscription?.unsubscribe();
        };
      }, [navigate, location.state, location.pathname]);

      // Display loading indicator only during the very initial check
      if (loadingInitial) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-950 text-foreground">
             <motion.div
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.5, ease: "backOut" }}
             >
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
             </motion.div>
          </div>
        );
      }

      return (
        <ErrorBoundary> {/* Wrap the main content with ErrorBoundary */}
          <div className="min-h-screen"> {/* Removed background here, applied in index.css body */}
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route
                  path="/"
                  element={
                    <ProtectedRoute session={session} isLoading={loadingInitial}>
                      <KdpDashboard key={session?.user?.id} session={session} />
                    </ProtectedRoute>
                  }
                />
                <Route path="/auth" element={!session ? <Auth /> : <Navigate to="/" replace />} />
                <Route path="/forgot-password" element={!session ? <ForgotPassword /> : <Navigate to="/" replace />} />
                <Route path="/update-password" element={<UpdatePassword />} />
                <Route path="*" element={<Navigate to={session ? "/" : "/auth"} replace />} />
              </Routes>
            </AnimatePresence>
            <Toaster />
          </div>
        </ErrorBoundary>
      );
    }

    export default App;
  