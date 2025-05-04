
    import React from 'react';
    import { format } from 'date-fns';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
    import { Trash2 } from 'lucide-react';
    import { currencySymbols } from '@/lib/data/constants';
    import EditableCell from '@/components/EditableCell';
    import { formatCurrency, formatRatio } from '@/lib/formatting'; // Import formatCurrency and formatRatio

    function EntriesTable({ entries, deleteEntry, updateEntry, isLoading, settings }) {
      const rateEURtoUSD = settings?.eur_to_usd_rate || 1.1;
      const rateUSDtoEUR = 1 / rateEURtoUSD; // Needed if we calculate EUR profit/ROAS later

      // Calculate estimated USD values and ROAS for display
      const getCalculatedValues = (entry) => {
        const income = parseFloat(entry.income) || 0;
        const spend = parseFloat(entry.ad_spend) || 0;
        const incomeCurrency = entry.income_currency || 'EUR';
        const spendCurrency = entry.ad_spend_currency || 'USD';

        // Always calculate in USD for this table's display columns
        const incomeUSD = incomeCurrency === 'USD' ? income : (incomeCurrency === 'EUR' ? income * rateEURtoUSD : 0);
        const spendUSD = spendCurrency === 'USD' ? spend : (spendCurrency === 'EUR' ? spend * rateEURtoUSD : 0);

        // Correct Profit Calculation (USD)
        const profitUSD = incomeUSD - spendUSD;

        // Correct ROAS Calculation
        const roas = spendUSD !== 0 ? (incomeUSD / spendUSD) : (incomeUSD > 0 ? Infinity : 0);

        return { profitUSD, roas };
      };

      // Handle saving the updated income or spend
      const handleSave = (entryId, field, newValue) => {
         const numericValue = parseFloat(newValue);
         const valueToSave = !isNaN(numericValue) ? numericValue : 0;

        if (updateEntry) {
          updateEntry(entryId, { [field]: valueToSave });
        }
      };


      return (
        <Table>
          <TableCaption>
            {isLoading ? "Loading entries..." : entries.length === 0 ? "No KDP entries recorded yet." : `Showing ${entries.length} KDP entries.`}
          </TableCaption>
          <TableHeader>
            <TableRow className="hover:bg-muted/10 dark:hover:bg-muted/5">
              <TableHead>Date</TableHead>
              <TableHead>Account</TableHead>
              <TableHead className="text-right">Income</TableHead>
              <TableHead className="text-right">Ad Spend</TableHead>
              <TableHead className="text-right">Profit (Est. USD)</TableHead>
              <TableHead className="text-right">ROAS</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">Loading...</TableCell>
              </TableRow>
            )}
            {!isLoading && entries.map((entry) => {
              const { profitUSD, roas } = getCalculatedValues(entry); // Use corrected calculations
              const profitColor = profitUSD >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
              const account = entry.kdp_accounts || { name: 'Unknown', color: '#888888' };
              // Use formatRatio for ROAS display
              const displayRoas = formatRatio(roas);

              return (
                <motion.tr
                  key={entry.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  layout
                  className="hover:bg-muted/20 dark:hover:bg-muted/10 transition-colors duration-150"
                >
                  <TableCell>{format(entry.date, 'yyyy-MM-dd')}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="w-3 h-3 rounded-full mr-2 shrink-0" style={{ backgroundColor: account.color }}></span>
                      {account.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                     <EditableCell
                       value={entry.income}
                       onSave={(newValue) => handleSave(entry.id, 'income', newValue)}
                       type="number"
                       currencySymbol={currencySymbols[entry.income_currency] || entry.income_currency}
                       inputClassName="bg-background/70"
                     />
                  </TableCell>
                  <TableCell className="text-right">
                     <EditableCell
                       value={entry.ad_spend}
                       onSave={(newValue) => handleSave(entry.id, 'ad_spend', newValue)}
                       type="number"
                       currencySymbol={currencySymbols[entry.ad_spend_currency] || entry.ad_spend_currency}
                       inputClassName="bg-background/70"
                     />
                  </TableCell>
                  {/* Use formatCurrency for Profit */}
                  <TableCell className={`text-right font-medium ${profitColor}`}>{formatCurrency(profitUSD, 'USD')}</TableCell>
                  {/* Display formatted ROAS */}
                  <TableCell className="text-right">{displayRoas}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteEntry(entry.id)}
                      aria-label="Delete entry"
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </motion.tr>
              );
            })}
          </TableBody>
        </Table>
      );
    }

    export default EntriesTable;
  