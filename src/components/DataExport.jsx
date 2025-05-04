
import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Download, Filter, Loader2 } from 'lucide-react';
import { format, getYear, getMonth, parseISO } from 'date-fns';
import { Input } from '@/components/ui/input';

const currencySymbols = {
  USD: '$',
  EUR: '€',
};

const PLACEHOLDER_VALUE = "placeholder-disabled-value";

function DataExport({ entries, accounts, settings }) {
  const [filterType, setFilterType] = useState('all');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const conversionRate = settings?.eur_to_usd_rate || 1.1;

   const availableYears = useMemo(() => {
     if (!entries || entries.length === 0) return [];
     const years = new Set(entries.map(e => getYear(e.date)));
     return Array.from(years).sort((a, b) => b - a);
   }, [entries]);

   const availableMonths = useMemo(() => {
      if (!entries || entries.length === 0) return [];
      const months = new Set(entries.map(e => format(e.date, 'yyyy-MM')));
      return Array.from(months).sort((a, b) => b.localeCompare(a));
   }, [entries]);


  const handleExport = () => {
    setIsLoading(true);

    setTimeout(() => {
      try {
        let filteredEntries = [...entries];

        if (filterType === 'year' && selectedYear) {
          filteredEntries = filteredEntries.filter(e => getYear(e.date) === parseInt(selectedYear));
        } else if (filterType === 'month' && selectedMonth) {
          filteredEntries = filteredEntries.filter(e => format(e.date, 'yyyy-MM') === selectedMonth);
        } else if (filterType === 'account' && selectedAccount) {
          filteredEntries = filteredEntries.filter(e => e.account_id === selectedAccount);
        }

        if (filteredEntries.length === 0) {
          toast({ title: "No Data", description: "No entries found matching the selected filter.", variant: "destructive" });
          setIsLoading(false);
          return;
        }

        const dataToExport = filteredEntries.map(entry => {
           const accountName = entry.kdp_accounts?.name || 'Unknown';
           const income = entry.income || 0;
           const spend = entry.ad_spend || 0;
           const incomeCurrency = entry.income_currency || 'EUR';
           const spendCurrency = entry.ad_spend_currency || 'USD';

           const incomeInUSD = incomeCurrency === 'USD' ? income : income * conversionRate;
           const spendInUSD = spendCurrency === 'USD' ? spend : spend * conversionRate;
           const profitUSD = incomeInUSD - spendInUSD;

           return {
             Date: format(entry.date, 'yyyy-MM-dd'),
             Account: accountName,
             Income: income,
             'Income Currency': incomeCurrency,
             'Ad Spend': spend,
             'Ad Spend Currency': spendCurrency,
             'Profit (Est. USD)': profitUSD.toFixed(2),
           };
        });

        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'KDP Entries');

         let filename = 'royaltix_export_all.xlsx';
         if (filterType === 'year' && selectedYear) filename = `royaltix_export_${selectedYear}.xlsx`;
         else if (filterType === 'month' && selectedMonth) filename = `royaltix_export_${selectedMonth}.xlsx`;
         else if (filterType === 'account' && selectedAccount) {
            const accName = accounts.find(a => a.id === selectedAccount)?.name || 'account';
            filename = `royaltix_export_${accName.replace(/[^a-z0-9]/gi, '_')}.xlsx`;
         }

        XLSX.writeFile(wb, filename);

        toast({ title: "Export Successful", description: `Data exported to ${filename}.` });

      } catch (error) {
        console.error("Export failed:", error);
        toast({ title: "Export Failed", description: "An error occurred during export. Please try again.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    }, 50);
  };

  return (
    <Card className="shadow-lg border border-border/40 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Export Data</CardTitle>
        <CardDescription>Download your Royaltix entries log as an Excel (.xlsx) file. Apply filters as needed.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-1">
               <label className="text-sm font-medium">Filter By</label>
               <Select value={filterType} onValueChange={setFilterType}>
                 <SelectTrigger>
                   <SelectValue placeholder="Select filter type..." />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">All Data</SelectItem>
                   <SelectItem value="year">Year</SelectItem>
                   <SelectItem value="month">Month</SelectItem>
                   <SelectItem value="account">Account</SelectItem>
                 </SelectContent>
               </Select>
            </div>

            <div className="space-y-1 md:col-span-2">
               <label className="text-sm font-medium">Filter Value</label>
               {filterType === 'year' && (
                  <Select value={selectedYear} onValueChange={setSelectedYear} disabled={availableYears.length === 0}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year..." />
                    </SelectTrigger>
                    <SelectContent>
                       {availableYears.length === 0 ? (
                         <SelectItem value={PLACEHOLDER_VALUE} disabled>No data available</SelectItem>
                       ) : (
                         availableYears.map(year => <SelectItem key={year} value={String(year)}>{year}</SelectItem>)
                       )}
                    </SelectContent>
                  </Select>
               )}
               {filterType === 'month' && (
                  <Select value={selectedMonth} onValueChange={setSelectedMonth} disabled={availableMonths.length === 0}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select month..." />
                    </SelectTrigger>
                    <SelectContent>
                       {availableMonths.length === 0 ? (
                         <SelectItem value={PLACEHOLDER_VALUE} disabled>No data available</SelectItem>
                       ) : (
                         availableMonths.map(month => <SelectItem key={month} value={month}>{format(parseISO(month + '-01'), 'MMMM yyyy')}</SelectItem>)
                       )}
                    </SelectContent>
                  </Select>
               )}
               {filterType === 'account' && (
                 <Select value={selectedAccount} onValueChange={setSelectedAccount} disabled={accounts.length === 0}>
                   <SelectTrigger>
                     <SelectValue placeholder="Select account..." />
                   </SelectTrigger>
                   <SelectContent>
                     {accounts.length === 0 ? (
                       <SelectItem value={PLACEHOLDER_VALUE} disabled>No accounts available</SelectItem>
                     ) : (
                       accounts.map(account => (
                         <SelectItem key={account.id} value={account.id}>
                            <div className="flex items-center">
                               <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: account.color }}></span>
                               {account.name}
                            </div>
                         </SelectItem>
                       ))
                     )}
                   </SelectContent>
                 </Select>
               )}
               {filterType === 'all' && (
                  <Input value="All data will be exported" disabled className="bg-muted/50" />
               )}
            </div>
         </div>

        <Button onClick={handleExport} disabled={isLoading || entries.length === 0} className="w-full md:w-auto">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
          {isLoading ? 'Exporting...' : 'Export to Excel'}
        </Button>
         {entries.length === 0 && <p className="text-sm text-muted-foreground text-center mt-2">No data available to export.</p>}
      </CardContent>
    </Card>
  );
}

export default DataExport;
  