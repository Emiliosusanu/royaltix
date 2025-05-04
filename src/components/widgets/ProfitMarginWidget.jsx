
    import React from 'react';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Percent } from 'lucide-react';
    import { formatPercentage } from '@/lib/formatting';

    function ProfitMarginWidget({ totalProfitUSD, totalIncomeUSD }) {
      const profitMargin = totalIncomeUSD !== 0 ? (totalProfitUSD / totalIncomeUSD) * 100 : 0;

      return (
        <Card className="shadow-lg border border-border/40 bg-card/80 backdrop-blur-sm col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Profit Margin (USD)</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(profitMargin)}</div>
            <p className="text-xs text-muted-foreground">
              (Total Net Profit / Total KDP Income)
            </p>
          </CardContent>
        </Card>
      );
    }

    export default ProfitMarginWidget;
  