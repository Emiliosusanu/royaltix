
    import React, { useState, useMemo, useEffect } from 'react';
              import { Button } from '@/components/ui/button';
              import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
              import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
              import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
              import { Trash2 } from 'lucide-react';
              import { format, getYear } from 'date-fns';

              function DataClearing({
                  entries,
                  otherExpenses,
                  clearMonthlyEntries,
                  clearYearlyEntries,
                  clearAllEntries,
                  clearMonthlyOtherExpenses,
                  clearYearlyOtherExpenses,
                  clearAllOtherExpenses,
                  isLoading
              }) {
                const [selectedMonth, setSelectedMonth] = useState('');
                const [selectedYear, setSelectedYear] = useState('');
                const [dataTypeToClear, setDataTypeToClear] = useState('kdp'); // 'kdp' or 'other'

                 const safeEntries = entries || [];
                 const safeOtherExpenses = otherExpenses || [];

                const availableMonths = useMemo(() => {
                   const data = dataTypeToClear === 'kdp' ? safeEntries : safeOtherExpenses;
                   const months = new Set();
                   data.forEach(e => {
                     if (e.date instanceof Date && !isNaN(e.date)) { // Check if date is valid
                       months.add(format(e.date, 'yyyy-MM'));
                     }
                   });
                   return Array.from(months).sort().reverse();
                 }, [safeEntries, safeOtherExpenses, dataTypeToClear]);

                const availableYears = useMemo(() => {
                  const data = dataTypeToClear === 'kdp' ? safeEntries : safeOtherExpenses;
                  const years = new Set();
                  data.forEach(e => {
                    if (e.date instanceof Date && !isNaN(e.date)) { // Check if date is valid
                      years.add(getYear(e.date).toString());
                    }
                  });
                  return Array.from(years).sort().reverse();
                }, [safeEntries, safeOtherExpenses, dataTypeToClear]);

                // Reset selections when data type changes
                 useEffect(() => {
                   setSelectedMonth('');
                   setSelectedYear('');
                 }, [dataTypeToClear]);

                const getActionFunction = (type, value) => {
                    if (dataTypeToClear === 'kdp') {
                        switch(type) {
                            case 'month': return () => clearMonthlyEntries(value);
                            case 'year': return () => clearYearlyEntries(value);
                            case 'all': return clearAllEntries;
                            default: return null;
                        }
                    } else { // 'other'
                         switch(type) {
                            case 'month': return () => clearMonthlyOtherExpenses(value);
                            case 'year': return () => clearYearlyOtherExpenses(value);
                            case 'all': return clearAllOtherExpenses;
                            default: return null;
                        }
                    }
                };

                const formatMonthDisplay = (monthYear) => {
                  if (!monthYear || !monthYear.includes('-')) return '';
                  try {
                      const [year, month] = monthYear.split('-');
                      return format(new Date(parseInt(year), parseInt(month) - 1), 'MMMM yyyy');
                  } catch (e) {
                      console.error("Error formatting month display:", e);
                      return monthYear; // Fallback
                  }
                };

                const renderClearButton = (type, value, label, disabledCondition, description) => {
                    const action = getActionFunction(type, value);
                    if (!action) return null;

                    const typeLabel = dataTypeToClear === 'kdp' ? 'KDP Entries' : 'Other Expenses';
                    const finalDisabledCondition = disabledCondition || isLoading;

                    return (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" disabled={finalDisabledCondition} className="w-full justify-start text-left">
                              <Trash2 className="mr-2 h-4 w-4" /> {label}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete {description} {typeLabel}.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={action} disabled={isLoading}>
                                {isLoading ? 'Deleting...' : 'Continue'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                    );
                };

                const noDataAvailable = (dataTypeToClear === 'kdp' ? safeEntries.length === 0 : safeOtherExpenses.length === 0);
                const noMonthsAvailable = availableMonths.length === 0;
                const noYearsAvailable = availableYears.length === 0;

                return (
                  <Card className="shadow-xl border border-destructive/40 bg-destructive/5 backdrop-blur-lg overflow-hidden">
                     <div className="bg-gradient-to-r from-red-500 to-pink-500 dark:from-red-700 dark:to-pink-700 p-1"></div>
                    <CardHeader>
                      <CardTitle className="text-2xl font-semibold text-destructive">Data Clearing</CardTitle>
                      <CardDescription className="text-destructive/90">Permanently delete recorded data. Use with caution!</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                       <div className="space-y-2">
                         <label htmlFor="data-type-select" className="text-sm font-medium">Select Data Type to Clear:</label>
                         <Select value={dataTypeToClear} onValueChange={setDataTypeToClear}>
                           <SelectTrigger id="data-type-select" className="bg-background/70">
                             <SelectValue placeholder="Select data type..." />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="kdp">KDP Entries (Income/Ad Spend)</SelectItem>
                             <SelectItem value="other">Other Expenses</SelectItem>
                           </SelectContent>
                         </Select>
                       </div>

                       <div className="space-y-4 p-4 border border-destructive/20 rounded-md bg-background/30">
                          <h4 className="font-medium text-destructive">Clear by Month</h4>
                          <div className="flex items-end gap-2">
                             <div className="flex-grow space-y-1">
                                 <label htmlFor="month-select" className="text-xs text-muted-foreground">Select Month</label>
                                 <Select value={selectedMonth} onValueChange={setSelectedMonth} disabled={noMonthsAvailable}>
                                   <SelectTrigger id="month-select" className="bg-background/70">
                                     <SelectValue placeholder={noMonthsAvailable ? "No data" : "Select month..."} />
                                   </SelectTrigger>
                                   <SelectContent>
                                      {availableMonths.map(month => (
                                        <SelectItem key={month} value={month}>
                                          {formatMonthDisplay(month)}
                                        </SelectItem>
                                      ))}
                                      {noMonthsAvailable && <SelectItem value="nodata" disabled>No data available</SelectItem>}
                                   </SelectContent>
                                 </Select>
                             </div>
                             {renderClearButton('month', selectedMonth, `Clear ${formatMonthDisplay(selectedMonth)}`, !selectedMonth || noMonthsAvailable, `all data for ${formatMonthDisplay(selectedMonth)} from`)}
                          </div>
                       </div>

                        <div className="space-y-4 p-4 border border-destructive/20 rounded-md bg-background/30">
                          <h4 className="font-medium text-destructive">Clear by Year</h4>
                           <div className="flex items-end gap-2">
                             <div className="flex-grow space-y-1">
                                 <label htmlFor="year-select" className="text-xs text-muted-foreground">Select Year</label>
                                 <Select value={selectedYear} onValueChange={setSelectedYear} disabled={noYearsAvailable}>
                                   <SelectTrigger id="year-select" className="bg-background/70">
                                     <SelectValue placeholder={noYearsAvailable ? "No data" : "Select year..."}/>
                                   </SelectTrigger>
                                   <SelectContent>
                                      {availableYears.map(year => (
                                       <SelectItem key={year} value={year}>{year}</SelectItem>
                                     ))}
                                     {noYearsAvailable && <SelectItem value="nodata" disabled>No data available</SelectItem>}
                                   </SelectContent>
                                 </Select>
                             </div>
                             {renderClearButton('year', selectedYear, `Clear Year ${selectedYear}`, !selectedYear || noYearsAvailable, `all data for the year ${selectedYear} from`)}
                          </div>
                        </div>

                       <div className="space-y-4 p-4 border border-destructive/20 rounded-md bg-background/30">
                         <h4 className="font-medium text-destructive">Clear All Data</h4>
                          {renderClearButton(
                              'all',
                              null,
                              'Clear All Data',
                              noDataAvailable,
                              'ALL recorded data from'
                          )}
                       </div>

                    </CardContent>
                  </Card>
                );
              }

              export default DataClearing;
  