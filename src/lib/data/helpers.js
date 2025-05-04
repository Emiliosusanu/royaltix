
    import { defaultSettings } from '@/lib/data/constants';
    import * as dataFetch from '@/lib/data/fetch';

    // Helper function to fetch all core data
    export const fetchAllData = async (userId) => {
      const [settingsData, accountsData, entriesData, expensesData] = await Promise.all([
        dataFetch.fetchSettings(userId),
        dataFetch.fetchAccounts(userId),
        dataFetch.fetchEntries(userId),
        dataFetch.fetchOtherExpenses(userId)
      ]);
      return {
        settings: settingsData || defaultSettings,
        accounts: accountsData || [],
        entries: entriesData || [],
        otherExpenses: expensesData || []
      };
    };
  