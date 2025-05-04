
import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handlePasswordResetRequest = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      // IMPORTANT: Supabase needs the correct Site URL configured in project settings
      // for the redirect in the email link to work.
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
         // This automatically uses the Site URL + #access_token=...&refresh_token=...
         // The UpdatePassword component will handle this hash fragment.
         // No specific redirectTo needed here unless overriding default behavior.
      });

      if (error) throw error;

      toast({
        title: 'Password Reset Email Sent',
        description: 'Please check your email for instructions to reset your password.',
      });
    } catch (error) {
      toast({
        title: 'Error Sending Reset Email',
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
         <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-1"></div>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold flex items-center justify-center">
            <Mail className="mr-2" />
            Forgot Password?
          </CardTitle>
          <CardDescription>
            Enter your email address below and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handlePasswordResetRequest}>
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
          </CardContent>
          <CardFooter className="flex flex-col gap-4 bg-muted/30 dark:bg-muted/10 p-6">
            <Button type="submit" className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-md transition-all duration-300 ease-in-out transform hover:scale-105" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
             <Button asChild variant="link" className="text-sm text-muted-foreground">
               <Link to="/auth">
                 <ArrowLeft className="mr-1 h-4 w-4" /> Back to Login
               </Link>
             </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}

export default ForgotPassword;
  