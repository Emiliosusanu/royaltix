
    import React from 'react';
    import { TabsContent } from '@/components/ui/tabs';
    import DashboardTab from '@/components/DashboardTab';
    import AddEntryTab from '@/components/AddEntryTab';
    import LogTab from '@/components/LogTab';
    import AccountsTab from '@/components/AccountsTab';
    import ExportTab from '@/components/ExportTab';
    import SettingsTab from '@/components/SettingsTab';
    import AccountPerformanceTab from '@/components/AccountPerformanceTab';
    import OtherExpensesTab from '@/components/OtherExpensesTab';
    import { motion } from 'framer-motion';

    const tabContentVariants = {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
      exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: 'easeInOut' } },
    };


    function DashboardTabContent({ activeTab, ...props }) {
       // Destructure necessary props for each tab
       const {
         dashboardMetrics, additionalWidgetsData, entries, otherExpenses, settings, loading,
         filters, handleFilterChange, accounts, filteredEntries, filteredOtherExpenses,
         addEntry, deleteEntry, updateEntry, addAccount, updateAccount, updateSettings,
         addOtherExpense, deleteOtherExpense,
         clearMonthlyEntries, clearYearlyEntries, clearAllEntries,
         clearMonthlyOtherExpenses, clearYearlyOtherExpenses, clearAllOtherExpenses
       } = props;

      const renderTabContent = () => {
        switch (activeTab) {
          case 'dashboard':
            return (
              <DashboardTab
                metrics={dashboardMetrics}
                additionalWidgetsData={additionalWidgetsData}
                entries={entries} // Pass unfiltered for charts if needed
                otherExpenses={otherExpenses} // Pass unfiltered for charts if needed
                settings={settings}
                loading={loading}
                filters={filters} // Pass filters down
                onFilterChange={handleFilterChange} // Pass handler down
                accounts={accounts} // Pass accounts for filter options
              />
            );
          case 'add-entry':
            return <AddEntryTab addEntry={addEntry} accounts={accounts} isLoading={loading} />;
          case 'log':
            return <LogTab entries={filteredEntries} deleteEntry={deleteEntry} updateEntry={updateEntry} isLoading={loading} settings={settings} />;
          case 'other-expenses':
            return <OtherExpensesTab otherExpenses={filteredOtherExpenses} addOtherExpense={addOtherExpense} deleteOtherExpense={deleteOtherExpense} isLoading={loading} settings={settings} />;
          case 'accounts':
            return (
              <>
                <AccountsTab accounts={accounts} addAccount={addAccount} updateAccount={updateAccount} isLoading={loading} />
                <AccountPerformanceTab entries={filteredEntries} accounts={accounts} settings={settings} isLoading={loading} />
              </>
            );
          case 'export':
            return <ExportTab entries={entries} accounts={accounts} otherExpenses={otherExpenses} settings={settings} />;
          case 'settings':
            return (
              <SettingsTab
                 entries={entries} otherExpenses={otherExpenses} settings={settings} updateSettings={updateSettings}
                 clearMonthlyEntries={clearMonthlyEntries} clearYearlyEntries={clearYearlyEntries} clearAllEntries={clearAllEntries}
                 clearMonthlyOtherExpenses={clearMonthlyOtherExpenses} clearYearlyOtherExpenses={clearYearlyOtherExpenses} clearAllOtherExpenses={clearAllOtherExpenses}
                 isLoading={loading}
               />
            );
          default:
            return null;
        }
      };

      return (
         <motion.div
             key={activeTab} // Ensure Framer Motion detects content change
             variants={tabContentVariants}
             initial="initial"
             animate="animate"
             exit="exit"
         >
             {/* We need TabsContent wrapper for shadcn functionality, but animation on the inner content */}
             <TabsContent value={activeTab} forceMount={true} className="mt-0 data-[state=inactive]:hidden">
               {renderTabContent()}
             </TabsContent>
         </motion.div>
       );
    }

    export default DashboardTabContent;
  