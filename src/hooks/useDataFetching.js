
    import { useState, useCallback } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { fetchAllData } from '@/lib/data/helpers';
    import { defaultSettings } from '@/lib/data/constants';

    export function useDataFetching() {
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      const loadData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error("User not authenticated. Please log in again.");

          const fetchedData = await fetchAllData(user.id);
          setLoading(false);
          return fetchedData; // Return the fetched data

        } catch (err) {
          console.error("Error fetching data:", err);
          setError(err.message || "An unexpected error occurred while fetching data.");
          setLoading(false);
          // Return default structure on error to prevent crashes downstream
          return {
            settings: defaultSettings,
            accounts: [],
            entries: [],
            otherExpenses: []
          };
        }
      }, []);

      return { loading, error, loadData };
    }
  