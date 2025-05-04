
    import React from 'react';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Clock } from 'lucide-react';
    import { format, subDays, startOfDay } from 'date-fns';
    import { formatCurrency } from '@/lib/formatting'; // Use EUR formatting

    // Function to calculate performance for a specific day
    const calculateDailyPerformance = (entries, date, rateUSDtoEUR) => {
      const targetDateStart = startOfDay(date);
      let income = 0;
      let spend = 0;

      entries.forEach(entry => {
        // Ensure comparison is done with Date objects
        const entryDateStart = startOfDay(entry.date);
        if (entryDateStart.getTime() === targetDateStart.getTime()) {
          const entryIncome = entry.income || 0;
          const entrySpend = entry.ad_spend || 0;
          const incomeCurrency = entry.income_currency || 'EUR';
          const spendCurrency = entry.ad_spend_currency || 'USD';

          const incomeInEUR = incomeCurrency === 'EUR' ? entryIncome : (incomeCurrency === 'USD' ? entryIncome * rateUSDtoEUR : 0);
          const spendInEUR = spendCurrency === 'EUR' ? entrySpend : (spendCurrency === 'USD' ? entrySpend * rateUSDtoEUR : 0);

          income += incomeInEUR;
          spend += spendInEUR;
        }
      });

      return { income, spend, profit: income - spend };
    };

    function DailyPerformance({ entries, settings }) {
        const rateUSDtoEUR = 1 / (settings?.eur_to_usd_rate || 1.1);
        const today = new Date();
        const yesterday = subDays(today, 1);

        // Calculate for Yesterday
        const yesterdayPerformance = calculateDailyPerformance(entries, yesterday, rateUSDtoEUR);

      return (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yesterday's Performance (Est. EUR)</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
               Snapshot for {format(yesterday, 'MMMM do, yyyy')}. Values converted to EUR.
            </p>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Income (Est. EUR)</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {formatCurrency(yesterdayPerformance.income, 'EUR')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Ad Spend (Est. EUR)</span>
                <span className="font-medium text-red-600 dark:text-red-400">
                  {formatCurrency(yesterdayPerformance.spend, 'EUR')}
                </span>
              </div>
               <div className="flex justify-between items-center border-t pt-1 mt-1 border-border/50">
                 <span className="text-sm font-semibold">Profit (Est. EUR)</span>
                 <span className={`font-semibold ${yesterdayPerformance.profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                   {formatCurrency(yesterdayPerformance.profit, 'EUR')}
                 </span>
               </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Converted from original currencies</p>
          </CardContent>
        </Card>
      );
    }

    export default DailyPerformance;
  