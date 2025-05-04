
import React from 'react';
import DataExport from '@/components/DataExport';

function ExportTab({ entries, accounts, settings }) {
  return (
    <DataExport entries={entries} accounts={accounts} settings={settings} />
  );
}

export default ExportTab;
  