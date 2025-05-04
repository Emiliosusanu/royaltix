
    import React from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { LogOut, User, Sun, Moon } from 'lucide-react';

    function DashboardHeader({ session, handleLogout }) {
      const userEmail = session?.user?.email;
      // Basic theme toggle example - assumes you have a way to set/get theme state
      // In a real app, this state would likely live higher up (e.g., App.jsx) or in context
      const [isDarkMode, setIsDarkMode] = React.useState(() => {
         if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark' ||
                   (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
         }
         return false; // Default for SSR or environments without window
      });

      const toggleTheme = () => {
         const newTheme = !isDarkMode ? 'dark' : 'light';
         setIsDarkMode(!isDarkMode);
         if (typeof window !== 'undefined') {
            document.documentElement.classList.toggle('dark', !isDarkMode);
            localStorage.setItem('theme', newTheme);
         }
      };

       React.useEffect(() => {
           // Apply the theme on initial mount
           if (typeof window !== 'undefined') {
               const storedTheme = localStorage.getItem('theme');
               const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
               if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
                   document.documentElement.classList.add('dark');
                   setIsDarkMode(true);
               } else {
                   document.documentElement.classList.remove('dark');
                   setIsDarkMode(false);
               }
           }
       }, []);


      return (
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl font-extrabold primary-gradient-text"
          >
            Royaltix
          </motion.h1>
          <div className="flex items-center gap-3">
             <Button onClick={toggleTheme} variant="ghost" size="icon">
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                <span className="sr-only">Toggle theme</span>
             </Button>
            {userEmail && (
              <motion.div
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: 0.2, duration: 0.3 }}
                 className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border/50 shadow-inner"
               >
                <User className="h-4 w-4 text-primary/70" />
                <span>{userEmail}</span>
              </motion.div>
            )}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={handleLogout} variant="outline" size="sm" className="transition-colors hover:bg-destructive/10 hover:border-destructive/50 hover:text-destructive">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </motion.div>
          </div>
        </header>
      );
    }

    export default DashboardHeader;
  