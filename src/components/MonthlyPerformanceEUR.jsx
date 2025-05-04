
    import React from 'react';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Calendar } from 'lucide-react';
    import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
    import { formatCurrency } from '@/lib/formatting';

    // Calculates performance for the current month in EUR
    const calculateCurrentMonthPerformanceEUR = (entries, rateUSDtoEUR) => {
      const now = new Date();
      const monthStart = startOfMonth(now);
      const monthEnd = endOfMonth(now);
      const interval = { start: monthStart, end: monthEnd };

      let income = 0;
      let spend = 0;

      entries.forEach(entry => {
        if (isWithinInterval(entry.date, interval)) {
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

    function MonthlyPerformanceEUR({ entries, settings }) {
      const rateUSDtoEUR = 1 / (settings?.eur_to_usd_rate || 1.1);
      const currentMonthPerformance = calculateCurrentMonthPerformanceEUR(entries, rateUSDtoEUR);
      const currentMonthLabel = format(new Date(), 'MMMM yyyy');

      return (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month ({currentMonthLabel}) Performance (Est. EUR)</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <p className="text-xs text-muted-foreground">
               Summary for the current month. Values converted to EUR.
             </p>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Income (Est. EUR)</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {formatCurrency(currentMonthPerformance.income, 'EUR')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Ad Spend (Est. EUR)</span>
                <span className="font-medium text-red-600 dark:text-red-400">
                  {formatCurrency(currentMonthPerformance.spend, 'EUR')}
                </span>
              </div>
               <div className="flex justify-between items-center border-t pt-1 mt-1 border-border/50">
                 <span className="text-sm font-semibold">Profit (Est. EUR)</span>
                 <span className={`font-semibold ${currentMonthPerformance.profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                   {formatCurrency(currentMonthPerformance.profit, 'EUR')}
                 </span>
               </div>
            </div>
             <p className="text-xs text-muted-foreground mt-2">Converted from original currencies</p>
          </CardContent>
        </Card>
      );
    }

    export default MonthlyPerformanceEUR;
  