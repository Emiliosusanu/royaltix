
import React from 'react';
import EntryForm from '@/components/EntryForm';

function AddEntryTab({ accounts, addEntry, isLoading }) {
  return (
    <EntryForm accounts={accounts} addEntry={addEntry} isLoading={isLoading} />
  );
}

export default AddEntryTab;
  