
    import React, { useState, useMemo } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { Button } from '@/components/ui/button';
    import { Tabs } from '@/components/ui/tabs'; // Removed TabsList, TabsTrigger
    import { useKdpData } from '@/hooks/useKdpData';
    import { useToast } from '@/components/ui/use-toast';
    import DashboardHeader from '@/components/DashboardHeader';
    import NavigationTabs from '@/components/NavigationTabs'; // Import the new tabs component
    import DashboardTabContent from '@/components/DashboardTabContent';
    import useDashboardFilters from '@/hooks/useDashboardFilters';
    import useDashboardCalculations from '@/hooks/useDashboardCalculations';
    import { motion } from 'framer-motion';


    function KdpDashboard({ session }) {
      const {
        entries,
        accounts,
        settings,
        otherExpenses,
        loading,
        error,
        fetchData,
        // Mutations passed down
        addEntry, deleteEntry, updateEntry,
        addAccount, updateAccount, updateSettings,
        addOtherExpense, deleteOtherExpense,
        clearMonthlyEntries, clearYearlyEntries, clearAllEntries,
        clearMonthlyOtherExpenses, clearYearlyOtherExpenses, clearAllOtherExpenses
      } = useKdpData();

      const { toast } = useToast();
      const [activeTab, setActiveTab] = useState("dashboard");

      const {
        filters,
        // dateRange, // Not directly used here anymore
        handleFilterChange,
        filteredEntries,
        filteredOtherExpenses
      } = useDashboardFilters(entries, otherExpenses);

      // Recalculates metrics whenever filtered data changes
      const { dashboardMetrics, additionalWidgetsData } = useDashboardCalculations(
        filteredEntries,
        filteredOtherExpenses,
        entries, // Pass unfiltered for some calcs like AdditionalWidgets
        settings
      );

      const handleLogout = async () => {
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) {
          toast({ title: "Logout Failed", description: signOutError.message, variant: "destructive" });
        } else {
          toast({ title: "Logged Out", description: "You have been successfully logged out." });
        }
      };

      if (error) {
        return (
          <div className="container mx-auto p-4 text-center text-red-600">
            <p>Error loading data: {error}</p>
            <Button onClick={fetchData} className="mt-4">Retry</Button>
          </div>
        );
      }

      // Props bundle for tabs content - everything needed by any tab
      const tabProps = {
        entries, // Pass unfiltered for export/certain charts
        filteredEntries, // Pass filtered for logs/performance tabs
        accounts,
        settings,
        otherExpenses, // Pass unfiltered for export/certain charts
        filteredOtherExpenses, // Pass filtered for logs/performance tabs
        loading,
        addEntry, deleteEntry, updateEntry,
        addAccount, updateAccount, updateSettings,
        addOtherExpense, deleteOtherExpense,
        clearMonthlyEntries, clearYearlyEntries, clearAllEntries,
        clearMonthlyOtherExpenses, clearYearlyOtherExpenses, clearAllOtherExpenses,
        dashboardMetrics, // Pass calculated metrics for the filtered period
        additionalWidgetsData, // Pass overall averages
        filters, // Pass current filter state
        handleFilterChange // Pass filter update handler
      };

      return (
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           transition={{ duration: 0.3 }}
           className="min-h-screen p-4 md:p-8"
        >
          <DashboardHeader session={session} handleLogout={handleLogout} />

          {/* Use Tabs wrapper, but NavigationTabs for the list */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Render the navigation tabs using the new component */}
            <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Render tab content using the refactored component */}
            {/* Pass down all necessary props */}
            <DashboardTabContent activeTab={activeTab} {...tabProps} />

          </Tabs>
        </motion.div>
      );
    }

    export default KdpDashboard;
  