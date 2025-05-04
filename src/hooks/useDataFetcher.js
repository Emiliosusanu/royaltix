
    import { useState, useEffect, useCallback } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { fetchAllData } from '@/lib/data/helpers';
    import { defaultSettings } from '@/lib/data/constants';
    import { useToast } from '@/components/ui/use-toast';

    export function useDataFetcher() {
      const [data, setData] = useState({
        settings: defaultSettings,
        accounts: [],
        entries: [],
        otherExpenses: []
      });
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const { toast } = useToast();

      const loadData = useCallback(async (showLoadingIndicator = true) => {
        if (showLoadingIndicator) {
            setLoading(true);
        }
        setError(null);
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
             // Don't throw an error, let the auth state listener handle redirect
             console.log("User not authenticated during data fetch.");
             setLoading(false);
             // Clear data if user is logged out
              setData({
                  settings: defaultSettings,
                  accounts: [],
                  entries: [],
                  otherExpenses: []
              });
             return;
          }

          const fetchedData = await fetchAllData(user.id);
          setData(fetchedData);

        } catch (err) {
          console.error("Error fetching data:", err);
          const errorMessage = err.message || "An unexpected error occurred while fetching data.";
          setError(errorMessage);
          toast({
            title: "Data Fetch Error",
            description: errorMessage,
            variant: "destructive",
          });
          // Reset state on error
          setData({
            settings: defaultSettings,
            accounts: [],
            entries: [],
            otherExpenses: []
          });
        } finally {
          setLoading(false);
        }
      }, [toast]);

      // Effect for initial load
      useEffect(() => {
        loadData();
      }, [loadData]);

      return {
        ...data, // Spread accounts, entries, settings, otherExpenses
        loading,
        error,
        reloadData: loadData // Expose loadData as reloadData
      };
    }
  