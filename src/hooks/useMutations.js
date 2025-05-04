
    import { useState, useCallback } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { useToast } from '@/components/ui/use-toast';
    import * as dataMutate from '@/lib/data/mutate'; // Import mutation functions
    import { format } from 'date-fns';

    // Hook to manage data mutations (add, update, delete)
    export function useMutations(onSuccessCallback) {
      const [loading, setLoading] = useState(false);
      const { toast } = useToast();

      // Generic handler for all mutations
      const handleMutation = useCallback(async (mutationFn, successTitle, successDescriptionFn, errorTitle) => {
        setLoading(true);
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error("User not authenticated. Please log in again.");

          // Execute the specific mutation function from dataService
          const result = await mutationFn(user.id);

          // Check for specific errors returned by the mutation function
          if (result && result.error) {
             throw result.error;
          }

          // Show success toast
          toast({
            title: successTitle,
            description: successDescriptionFn(result), // Generate description from result
          });

          // Call the success callback (e.g., fetchData) if provided
          if (onSuccessCallback) await onSuccessCallback();

          return { success: true, data: result }; // Return success status and data

        } catch (err) {
          console.error(`${errorTitle} error:`, err);
          // Show error toast
          toast({
            title: errorTitle,
            description: err.message || "An unexpected error occurred. Please try again.",
            variant: "destructive",
          });
          return { success: false, error: err }; // Return error status
        } finally {
          setLoading(false); // Ensure loading is always set to false
        }
      }, [toast, onSuccessCallback]); // Dependencies: toast and the success callback

      // --- Specific Mutation Functions ---

      // KDP Entries
      const addEntry = useCallback((newEntryData) => handleMutation(
        (userId) => dataMutate.addEntry(newEntryData, userId),
        "Entry Added",
        (result) => result?.data ? `Data for ${result.data.kdp_accounts?.name || 'selected account'} on ${format(result.data.date, 'PPP')} saved.` : 'Entry saved successfully.',
        "Error Saving Entry"
      ), [handleMutation]);

       const updateEntry = useCallback((entryId, updatedData) => handleMutation(
         (userId) => dataMutate.updateEntry(entryId, updatedData, userId),
         "Entry Updated",
         () => `Entry has been successfully updated.`,
         "Error Updating Entry"
       ), [handleMutation]);

      const deleteEntry = useCallback((idToDelete) => handleMutation(
        (userId) => dataMutate.deleteEntry(idToDelete, userId),
        "Entry Deleted",
        () => "The selected KDP entry has been removed.",
        "Error Deleting Entry"
      ), [handleMutation]);

      // Accounts
      const addAccount = useCallback((newAccountData) => handleMutation(
        (userId) => dataMutate.addAccount(newAccountData, userId),
        "Account Added",
        (result) => result?.data ? `Account "${result.data.name}" has been created.` : 'Account created successfully.',
        "Error Adding Account"
      ), [handleMutation]);

      const updateAccount = useCallback((accountId, updatedData) => handleMutation(
        (userId) => dataMutate.updateAccount(accountId, updatedData, userId),
        "Account Updated",
        (result) => result?.data ? `Account "${result.data.name}" has been updated.` : 'Account updated successfully.',
        "Error Updating Account"
      ), [handleMutation]);

      // Settings
      const updateSettings = useCallback((newSettingsData) => handleMutation(
        (userId) => dataMutate.updateSettings(newSettingsData, userId),
        "Settings Updated",
        () => "Currency conversion rate saved successfully.",
        "Error Saving Settings"
      ), [handleMutation]);

      // Other Expenses
      const addOtherExpense = useCallback((newExpenseData) => handleMutation(
        (userId) => dataMutate.addOtherExpense(newExpenseData, userId),
        "Expense Added",
        (result) => result?.data ? `Expense "${result.data.description}" on ${format(result.data.date, 'PPP')} saved.` : 'Expense saved successfully.',
        "Error Saving Expense"
      ), [handleMutation]);

      const deleteOtherExpense = useCallback((idToDelete) => handleMutation(
        (userId) => dataMutate.deleteOtherExpense(idToDelete, userId),
        "Expense Deleted",
        () => "The selected expense has been removed.",
        "Error Deleting Expense"
      ), [handleMutation]);

      // Data Clearing
      const clearEntriesHandler = useCallback((dataServiceName, filterType, value) => handleMutation(
        async (userId) => {
            if (dataServiceName === 'clearKdp') {
                return dataMutate.clearEntriesByFilter(filterType, value, userId);
            } else if (dataServiceName === 'clearOther') {
                return dataMutate.clearOtherExpensesByFilter(filterType, value, userId);
            }
            throw new Error("Invalid data type for clearing.");
        },
        "Data Cleared",
        (result) => result ? `Successfully deleted ${result}.` : 'Selected data cleared successfully.', // Result is the description string
        "Error Clearing Data"
      ), [handleMutation]);

      const clearMonthlyEntries = useCallback((monthYear) => clearEntriesHandler('clearKdp', 'month', monthYear), [clearEntriesHandler]);
      const clearYearlyEntries = useCallback((year) => clearEntriesHandler('clearKdp', 'year', year), [clearEntriesHandler]);
      const clearAllEntries = useCallback(() => clearEntriesHandler('clearKdp', 'all', null), [clearEntriesHandler]);

      const clearMonthlyOtherExpenses = useCallback((monthYear) => clearEntriesHandler('clearOther', 'month', monthYear), [clearEntriesHandler]);
      const clearYearlyOtherExpenses = useCallback((year) => clearEntriesHandler('clearOther', 'year', year), [clearEntriesHandler]);
      const clearAllOtherExpenses = useCallback(() => clearEntriesHandler('clearOther', 'all', null), [clearEntriesHandler]);

      // Return loading state and all mutation functions
      return {
        loading,
        addEntry,
        updateEntry, // Added updateEntry
        deleteEntry,
        addAccount,
        updateAccount,
        updateSettings,
        addOtherExpense,
        deleteOtherExpense,
        clearMonthlyEntries,
        clearYearlyEntries,
        clearAllEntries,
        clearMonthlyOtherExpenses,
        clearYearlyOtherExpenses,
        clearAllOtherExpenses,
      };
    }
  