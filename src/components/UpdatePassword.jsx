
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { KeyRound, Loader2, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function UpdatePassword() {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updated, setUpdated] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Supabase password recovery flow puts the access_token in the URL hash fragment.
  // onAuthStateChange handles this automatically if the user is not logged in.
  // If the user *is* logged in, we might need manual handling, but typically
  // the reset flow implies the user is logged out.

  useEffect(() => {
     // Check if the user was redirected here from the email link
     // Supabase JS client v2 automatically handles the session update via hash fragment
     // when onAuthStateChange runs in App.jsx. We just need to provide the UI.
     const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
           // This might happen if the link expired or was invalid before App.jsx could process it.
           // Or if the user navigates here directly without a valid token.
           toast({
              title: "Invalid or Expired Link",
              description: "The password reset link is invalid or has expired. Please request a new one.",
              variant: "destructive",
           });
           navigate('/forgot-password'); // Redirect to request a new link
        }
     };
     checkSession();
  }, [navigate, toast]);


  const handlePasswordUpdate = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }
    if (password.length < 6) {
       toast({
         title: 'Password too short',
         description: 'Password must be at least 6 characters long.',
         variant: 'destructive',
       });
       return;
    }

    setLoading(true);
    try {
      // The user session should have been updated automatically by Supabase
      // when the component mounted due to the hash fragment.
      const { error } = await supabase.auth.updateUser({ password: password });

      if (error) throw error;

      toast({
        title: 'Password Updated Successfully!',
        description: 'You can now log in with your new password.',
      });
      setUpdated(true);
      // Optionally redirect after a delay
      setTimeout(() => {
        navigate('/auth'); // Redirect to login page
      }, 3000);

    } catch (error) {
      toast({
        title: 'Error Updating Password',
        description: error.error_description || error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (updated) {
     return (
       <motion.div
         initial={{ opacity: 0, scale: 0.9 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ duration: 0.3 }}
         className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-900 dark:to-green-950 p-4"
       >
         <Card className="w-full max-w-md text-center shadow-2xl border border-border/40 bg-card/80 backdrop-blur-lg">
           <CardHeader>
             <CardTitle className="text-2xl font-bold flex items-center justify-center text-green-600 dark:text-green-400">
               <CheckCircle className="mr-2 h-8 w-8" />
               Password Updated!
             </CardTitle>
           </CardHeader>
           <CardContent>
             <p className="text-muted-foreground">Your password has been successfully updated. Redirecting you to the login page...</p>
           </CardContent>
         </Card>
       </motion.div>
     );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-950 p-4"
    >
      <Card className="w-full max-w-md shadow-2xl border border-border/40 bg-card/80 backdrop-blur-lg overflow-hidden">
         <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-1"></div>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold flex items-center justify-center">
            <KeyRound className="mr-2" />
            Set New Password
          </CardTitle>
          <CardDescription>
            Enter and confirm your new password below.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handlePasswordUpdate}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background/70"
              />
               {password && password.length < 6 && (
                  <p className="text-xs text-destructive">Password should be at least 6 characters.</p>
               )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-background/70"
              />
               {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-destructive">Passwords do not match.</p>
               )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 bg-muted/30 dark:bg-muted/10 p-6">
            <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md transition-all duration-300 ease-in-out transform hover:scale-105" disabled={loading || password.length < 6 || password !== confirmPassword}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}

export default UpdatePassword;
  