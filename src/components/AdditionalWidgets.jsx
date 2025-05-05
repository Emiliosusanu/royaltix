
    import React from 'react';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { BarChart, Sigma } from 'lucide-react';
    import { formatCurrency } from '@/lib/formatting';

    function AdditionalWidgets({ data }) {
      if (!data) {
        return <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8"></div>;
      }

      const {
        avgDailySpendEUR,
        avgIncomePerEntryEUR,
      } = data;

      return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Average Daily Spend (EUR) */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Daily Spend (EUR)</CardTitle>
              <BarChart className="h-5 w-5 text-red-500 dark:text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(avgDailySpendEUR, 'EUR')}</div>
              <p className="text-xs text-muted-foreground">
                Average KDP ad spend per day based on all data.
              </p>
            </CardContent>
          </Card>

          {/* Average Income / Entry (EUR) */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Income / Entry (EUR)</CardTitle>
              <Sigma className="h-5 w-5 text-green-500 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(avgIncomePerEntryEUR, 'EUR')}</div>
              <p className="text-xs text-muted-foreground">
                Average KDP income across all saved entries.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    export default AdditionalWidgets;
  