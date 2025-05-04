
    import React from 'react';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { DollarSign } from 'lucide-react';
    import { formatCurrency } from '@/lib/formatting';

    // This component is no longer used in DashboardWidgets but kept for potential future use or reference.
    function KdpProfitWidget({ totalGrossProfitUSD, useMotion = false }) {
      return (
        <Card useMotion={useMotion}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total KDP Profit (USD)</CardTitle>
            <DollarSign className="h-5 w-5 text-blue-500 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(totalGrossProfitUSD, 'USD')}</div>
            <p className="text-xs text-muted-foreground">
              Income - Ad Spend
            </p>
          </CardContent>
        </Card>
      );
    }

    export default KdpProfitWidget;
  