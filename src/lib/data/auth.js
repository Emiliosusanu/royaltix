
    import { supabase } from '@/lib/supabaseClient';

    export const setupAuthListener = (callback) => {
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          console.log("Auth event:", event);
          callback(event, session); // Call the provided callback on auth change
        }
      );
      return authListener; // Return the listener so it can be unsubscribed
    };

    export const unsubscribeAuthListener = (listener) => {
      listener?.subscription?.unsubscribe();
    };
  