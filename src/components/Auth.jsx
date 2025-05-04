
import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom'; // Import Link

function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between Login and Sign Up
  const { toast } = useToast();

  const handleAuth = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      let response;
      if (isSignUp) {
        response = await supabase.auth.signUp({ email, password });
        if (response.error) throw response.error;

        // Check if email confirmation is required (depends on Supabase settings)
        const requiresConfirmation = response.data.user?.identities?.length === 0;

        toast({
          title: "Signup successful!",
          description: requiresConfirmation
            ? "Please check your email to confirm your account."
            : "You are now logged in.",
        });

      } else {
        response = await supabase.auth.signInWithPassword({ email, password });
        if (response.error) throw response.error;
         toast({
            title: "Login successful!",
            description: "Welcome back!",
         });
      }
      // No need to manually set session here, onAuthStateChange in App.jsx handles it
    } catch (error) {
      toast({
        title: `Authentication Failed`,
        description: error.error_description || error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-950 p-4"
    >
      <Card className="w-full max-w-md shadow-2xl border border-border/40 bg-card/80 backdrop-blur-lg overflow-hidden">
        <div className={`bg-gradient-to-r ${isSignUp ? 'from-green-500 to-teal-500' : 'from-blue-500 to-purple-500'} p-1`}></div>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold flex items-center justify-center">
            {isSignUp ? <UserPlus className="mr-2" /> : <LogIn className="mr-2" />}
            {isSignUp ? 'Create Account' : 'Welcome Back!'}
          </CardTitle>
          <CardDescription>
            {isSignUp ? 'Enter your details to sign up.' : 'Sign in to access your KDP Dashboard.'}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleAuth}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/70"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background/70"
              />
              {isSignUp && password && password.length < 6 && (
                 <p className="text-xs text-destructive">Password should be at least 6 characters.</p>
              )}
            </div>
             {/* Add Forgot Password link only on Login view */}
             {!isSignUp && (
               <div className="text-right">
                 <Button asChild variant="link" className="text-sm px-0 text-muted-foreground">
                   <Link to="/forgot-password">Forgot Password?</Link>
                 </Button>
               </div>
             )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4 bg-muted/30 dark:bg-muted/10 p-6">
            <Button type="submit" className={`w-full ${isSignUp ? 'bg-gradient-to-r from-green-500 to-teal-600' : 'bg-gradient-to-r from-blue-500 to-purple-600'} text-white shadow-md transition-all duration-300 ease-in-out transform hover:scale-105`} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Login')}
            </Button>
            <Button
              type="button"
              variant="link"
              className="text-sm text-muted-foreground"
              onClick={() => setIsSignUp(!isSignUp)}
              disabled={loading}
            >
              {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}

export default Auth;
  