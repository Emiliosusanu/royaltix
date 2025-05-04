
    import React from 'react';
    import OtherExpensesForm from '@/components/OtherExpensesForm';
    import OtherExpensesTable from '@/components/OtherExpensesTable';

    // Pass the whole settings object down
    function OtherExpensesTab({ otherExpenses, addOtherExpense, deleteOtherExpense, isLoading, settings }) {
      return (
        <>
          <OtherExpensesForm
            addOtherExpense={addOtherExpense}
            isLoading={isLoading}
          />
          <OtherExpensesTable
            expenses={otherExpenses}
            deleteOtherExpense={deleteOtherExpense}
            isLoading={isLoading}
            settings={settings} // Pass settings down
          />
        </>
      );
    }

    export default OtherExpensesTab;
  