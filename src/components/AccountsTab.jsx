
import React from 'react';
import AccountsManager from '@/components/AccountsManager';

function AccountsTab({ accounts, addAccount, updateAccount, isLoading }) {
  return (
    <AccountsManager
      accounts={accounts}
      addAccount={addAccount}
      updateAccount={updateAccount} // Pass updateAccount down
      isLoading={isLoading}
    />
  );
}

export default AccountsTab;
  