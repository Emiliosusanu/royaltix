
    import { useState, useEffect, useCallback } from 'react';
    import { useMutations } from '@/hooks/useMutations';
    import { useDataFetching } from '@/hooks/useDataFetching'; // Import new hook
    import { useRealtimeUpdates } from '@/hooks/useRealtimeUpdates'; // Import new hook
    import { defaultSettings } from '@/lib/data/constants';

    // Main hook combining data fetching, realtime updates, and mutations
    export function useKdpData() {
      const [entries, setEntries] = useState([]);
      const [accounts, setAccounts] = useState([]);
      const [settings, setSettings] = useState(defaultSettings);
      const [otherExpenses, setOtherExpenses] = useState([]);

      // Use the data fetching hook
      const { loading: fetchLoading, error: fetchError, loadData } = useDataFetching();

      // Callback to update state after fetching or realtime event
      const updateLocalData = useCallback((fetchedData) => {
        if (fetchedData) {
          setSettings(fetchedData.settings || defaultSettings);
          setAccounts(fetchedData.accounts || []);
          setEntries(fetchedData.entries || []);
          setOtherExpenses(fetchedData.otherExpenses || []);
        } else {
           // Handle case where fetchedData might be null/undefined on error
           setSettings(defaultSettings);
           setAccounts([]);
           setEntries([]);
           setOtherExpenses([]);
        }
      }, []);

      // Function to trigger initial fetch and update state
      const initialFetch = useCallback(async () => {
        const data = await loadData();
        updateLocalData(data);
      }, [loadData, updateLocalData]);


      // Effect for initial data load
      useEffect(() => {
        initialFetch();
      }, [initialFetch]); // Run only once on mount

      // Use the realtime updates hook, passing a function to refetch and update state
      useRealtimeUpdates(initialFetch);

      // Get mutation functions, passing initialFetch as the success callback
      // This ensures data is refetched and state updated after any mutation
      const mutations = useMutations(initialFetch);

      return {
        entries,
        accounts,
        settings,
        otherExpenses,
        loading: fetchLoading, // Use loading state from fetch hook
        error: fetchError,     // Use error state from fetch hook
        fetchData: initialFetch, // Expose function to manually trigger refetch
        ...mutations
      };
    }
  