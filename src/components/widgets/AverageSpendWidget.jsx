
    import React from 'react';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { BadgeDollarSign } from 'lucide-react'; // Or another suitable icon
    import { formatCurrency } from '@/lib/formatting';

    function AverageSpendWidget({ averageDailySpendUSD, useMotion = false }) {
      const displayValue = formatCurrency(averageDailySpendUSD, 'USD');

      return (
        <Card useMotion={useMotion}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Daily Spend (USD)</CardTitle>
            <BadgeDollarSign className="h-5 w-5 text-orange-500 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${displayValue === 'N/A' ? 'text-muted-foreground' : 'text-orange-600 dark:text-orange-400'}`}>
              {displayValue}
            </div>
            <p className="text-xs text-muted-foreground">
              Average KDP ad spend per day based on all data.
            </p>
          </CardContent>
        </Card>
      );
    }

    export default AverageSpendWidget;
  