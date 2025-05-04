
    import React from 'react';
         import SettingsManager from '@/components/SettingsManager';
         import DataClearing from '@/components/DataClearing';

         function SettingsTab({
           entries,
           otherExpenses,
           settings,
           updateSettings,
           clearMonthlyEntries,
           clearYearlyEntries,
           clearAllEntries,
           clearMonthlyOtherExpenses,
           clearYearlyOtherExpenses,
           clearAllOtherExpenses,
           isLoading
         }) {
           return (
             <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
               <SettingsManager
                 settings={settings}
                 updateSettings={updateSettings}
                 isLoading={isLoading}
               />
               <DataClearing
                 entries={entries}
                 otherExpenses={otherExpenses}
                 clearMonthlyEntries={clearMonthlyEntries}
                 clearYearlyEntries={clearYearlyEntries}
                 clearAllEntries={clearAllEntries}
                 clearMonthlyOtherExpenses={clearMonthlyOtherExpenses}
                 clearYearlyOtherExpenses={clearYearlyOtherExpenses}
                 clearAllOtherExpenses={clearAllOtherExpenses}
                 isLoading={isLoading}
               />
             </div>
           );
         }

         export default SettingsTab;
  