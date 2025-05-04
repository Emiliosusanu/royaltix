
    import React, { useState, useMemo } from 'react';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { calculatePerformanceMetrics } from '@/lib/data/calculate'; // Updated import
    import { DollarSign, TrendingUp, Info, CalendarDays, CalendarDays as CalendarMonth, CalendarDays as CalendarYear, Infinity as InfinityIcon } from 'lucide-react';
    import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
    import { motion } from 'framer-motion';
    import { currencySymbols, PLACEHOLDER_VALUE } from '@/lib/data/constants';

    // Helper to format currency
    const formatCurrency = (value, currency = 'USD') => {
        const symbol = currencySymbols[currency] || currency;
        if (!Number.isFinite(value)) {
            if (value === Infinity) return `${symbol}∞`;
            return `${symbol}N/A`;
        }
        return `${symbol}${value.toFixed(2)}`;
    };

    // Helper to format percentage
    const formatPercentage = (value) => {
        if (!Number.isFinite(value)) {
            if (value === Infinity) return '∞%';
            return 'N/A%';
        }
        return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
    };


    function PerformanceCard({ title, profit, roi, income, spend, currency, icon: Icon }) {
      const profitColor = profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
      const roiColor = roi >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';

      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="shadow-md border border-border/40 bg-card/80 backdrop-blur-sm overflow-hidden h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-muted/30 dark:bg-muted/10">
              <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-4 flex-grow">
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={`text-2xl font-bold ${profitColor} cursor-help`}>
                      {formatCurrency(profit, currency)}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-popover text-popover-foreground border border-border shadow-lg rounded-md p-2 text-xs">
                    <p>Income: {formatCurrency(income, currency)}</p>
                    <p>Spend: {formatCurrency(spend, currency)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <p className={`text-xs ${roiColor}`}>
                {formatPercentage(roi)} ROI
              </p>
            </CardContent>
          </Card>
        </motion.div>
      );
    }


    function AccountPerformanceTab({ entries, accounts, settings }) {
      const [selectedAccountId, setSelectedAccountId] = useState('');
      const rateEURtoUSD = settings?.eur_to_usd_rate || 1.1; // Get EUR to USD rate

      // Calculate performance metrics for the selected account
      const performanceData = useMemo(() => {
        if (!selectedAccountId || !entries) return null;
        // Pass the EUR to USD rate to the calculation function
        return calculatePerformanceMetrics(entries, rateEURtoUSD, selectedAccountId);
      }, [entries, rateEURtoUSD, selectedAccountId]);

      const selectedAccount = accounts.find(acc => acc.id === selectedAccountId);

      return (
        <div className="space-y-6">
          {/* Account Selection Card */}
          <Card className="shadow-lg border border-border/40 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Select Account</CardTitle>
              <CardDescription>Choose an account to view its specific performance metrics.</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedAccountId} onValueChange={setSelectedAccountId} disabled={accounts.length === 0}>
                <SelectTrigger className="w-full md:w-[300px]">
                  <SelectValue placeholder="Select an account..." />
                </SelectTrigger>
                <SelectContent>
                  {accounts.length === 0 ? (
                     <SelectItem value={PLACEHOLDER_VALUE} disabled>No accounts available</SelectItem>
                  ) : (
                     accounts.map(account => (
                       <SelectItem key={account.id} value={account.id}>
                         <div className="flex items-center">
                           <span className="w-3 h-3 rounded-full mr-2 shrink-0" style={{ backgroundColor: account.color || '#888888' }}></span>
                           {account.name}
                         </div>
                       </SelectItem>
                     ))
                  )}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Performance Cards Display */}
          {selectedAccountId && performanceData && selectedAccount && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="space-y-4"
            >
               <h2 className="text-2xl font-semibold flex items-center">
                  <span className="w-4 h-4 rounded-full mr-2 shrink-0" style={{ backgroundColor: selectedAccount.color || '#888888' }}></span>
                  Performance for: {selectedAccount.name} (Est. USD)
               </h2>
               <p className="text-sm text-muted-foreground">All values converted to USD using rate: 1 EUR = {formatCurrency(rateEURtoUSD, 'USD')}</p>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <PerformanceCard
                  title="Today"
                  profit={performanceData.today.profit}
                  roi={performanceData.today.roi}
                  income={performanceData.today.income}
                  spend={performanceData.today.spend}
                  currency="USD"
                  icon={CalendarDays}
                />
                <PerformanceCard
                  title="This Month"
                  profit={performanceData.thisMonth.profit}
                  roi={performanceData.thisMonth.roi}
                  income={performanceData.thisMonth.income}
                  spend={performanceData.thisMonth.spend}
                  currency="USD"
                  icon={CalendarMonth}
                />
                <PerformanceCard
                  title="This Year"
                  profit={performanceData.thisYear.profit}
                  roi={performanceData.thisYear.roi}
                  income={performanceData.thisYear.income}
                  spend={performanceData.thisYear.spend}
                  currency="USD"
                  icon={CalendarYear}
                />
                <PerformanceCard
                  title="All Time"
                  profit={performanceData.allTime.profit}
                  roi={performanceData.allTime.roi}
                  income={performanceData.allTime.income}
                  spend={performanceData.allTime.spend}
                  currency="USD"
                  icon={InfinityIcon}
                />
              </div>
            </motion.div>
          )}

          {/* Placeholder messages */}
          {!selectedAccountId && accounts.length > 0 && (
             <div className="text-center text-muted-foreground py-8">
                <Info className="mx-auto h-8 w-8 mb-2"/>
                <p>Please select an account above to see its performance breakdown.</p>
             </div>
          )}
           {accounts.length === 0 && (
             <div className="text-center text-muted-foreground py-8">
                <Info className="mx-auto h-8 w-8 mb-2"/>
                <p>No accounts found. Please add an account in the 'Accounts' tab first.</p>
             </div>
           )}
        </div>
      );
    }

    export default AccountPerformanceTab;
  