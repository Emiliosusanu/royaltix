
    import React from 'react';
         import { format } from 'date-fns';
         import { motion } from 'framer-motion';
         import { Button } from '@/components/ui/button';
         import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
         import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
         import { Trash2 } from 'lucide-react';
         import { currencySymbols } from '@/lib/data/constants';

         function OtherExpensesTable({ expenses, deleteOtherExpense, isLoading, settings }) { // Changed prop name to settings
           const rateEURtoUSD = settings?.eur_to_usd_rate || 1.1; // Get rate from settings

           // Ensure expenses is an array before using it
           const safeExpenses = expenses || [];

           const formatDisplayCurrency = (value, currencyCode) => {
             const symbol = currencySymbols[currencyCode] || currencyCode;
             if (typeof value === 'number' && !isNaN(value)) {
                 return `${symbol}${value.toFixed(2)}`;
             }
             return `${symbol}${value}`; // Return as is if not a valid number
           };

            // Calculate estimated USD value for display
            const getAmountUSD = (expense) => {
              const amount = expense.amount || 0;
              const currency = expense.currency || 'USD';
              // Convert EUR to USD if necessary
              return currency === 'USD' ? amount : (currency === 'EUR' ? amount * rateEURtoUSD : 0); // Treat unknown as 0
            };

           return (
             <Card className="shadow-xl border border-border/40 bg-card/80 backdrop-blur-lg overflow-hidden">
                <div className="bg-gradient-to-r from-rose-500 to-pink-500 dark:from-rose-700 dark:to-pink-700 p-1"></div>
               <CardHeader>
                 <CardTitle className="text-2xl font-semibold">Other Expenses Log</CardTitle>
                 <CardDescription>List of your recorded business expenses.</CardDescription>
               </CardHeader>
               <CardContent>
                 <Table>
                    <TableCaption>
                      {isLoading ? "Loading expenses..." : safeExpenses.length === 0 ? "No expenses recorded yet." : `Showing ${safeExpenses.length} expenses.`}
                    </TableCaption>
                   <TableHeader>
                     <TableRow className="hover:bg-muted/10 dark:hover:bg-muted/5">
                       <TableHead>Date</TableHead>
                       <TableHead>Description</TableHead>
                       <TableHead className="text-right">Amount</TableHead>
                       <TableHead className="text-right">Amount (Est. USD)</TableHead>
                       <TableHead className="text-right">Actions</TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                     {isLoading && (
                       <TableRow>
                         <TableCell colSpan={5} className="text-center text-muted-foreground">Loading...</TableCell>
                       </TableRow>
                     )}
                     {!isLoading && safeExpenses.map((expense) => {
                        // Check if date is valid before formatting
                        const formattedDate = expense.date instanceof Date && !isNaN(expense.date)
                           ? format(expense.date, 'yyyy-MM-dd')
                           : 'Invalid Date';

                        const amountUSD = getAmountUSD(expense);

                        return (
                           <motion.tr
                             key={expense.id}
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             exit={{ opacity: 0 }}
                             layout
                             className="hover:bg-muted/20 dark:hover:bg-muted/10 transition-colors duration-150"
                           >
                             <TableCell>{formattedDate}</TableCell>
                             <TableCell className="font-medium">{expense.description}</TableCell>
                             <TableCell className="text-right">{formatDisplayCurrency(expense.amount, expense.currency)}</TableCell>
                             <TableCell className="text-right text-muted-foreground">{currencySymbols.USD}{amountUSD.toFixed(2)}</TableCell>
                             <TableCell className="text-right">
                               <Button
                                 variant="ghost"
                                 size="icon"
                                 onClick={() => deleteOtherExpense(expense.id)}
                                 aria-label="Delete expense"
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
               </CardContent>
             </Card>
           );
         }

         export default OtherExpensesTable;
  