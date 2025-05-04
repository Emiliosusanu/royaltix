
    import React from 'react';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Library } from 'lucide-react'; // Or another suitable icon
    import { formatCurrency } from '@/lib/formatting';

    function AverageIncomeWidget({ averageIncomePerEntryUSD, useMotion = false }) {
      const displayValue = formatCurrency(averageIncomePerEntryUSD, 'USD');

      return (
        <Card useMotion={useMotion}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Income / Entry (USD)</CardTitle>
            <Library className="h-5 w-5 text-cyan-500 dark:text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${displayValue === 'N/A' ? 'text-muted-foreground' : 'text-cyan-600 dark:text-cyan-400'}`}>
              {displayValue}
            </div>
            <p className="text-xs text-muted-foreground">
              Average KDP income across all saved entries.
            </p>
          </CardContent>
        </Card>
      );
    }

    export default AverageIncomeWidget;
  