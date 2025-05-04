
    import React, { useMemo } from 'react';
    import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
    import { format, parseISO, startOfDay, endOfDay, eachDayOfInterval } from 'date-fns';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { AlertTriangle } from 'lucide-react';
    import { currencySymbols } from '@/lib/data/constants';

    // Custom Tooltip for better styling
    const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        const formattedLabel = format(parseISO(label), 'MMM dd, yyyy');
        return (
          <div className="p-3 bg-background/90 border border-border rounded-lg shadow-lg backdrop-blur-sm">
            <p className="font-semibold text-foreground mb-2">{formattedLabel}</p>
            {payload.map((pld, index) => (
              <p key={index} style={{ color: pld.stroke }} className="text-sm">
                {`${pld.name}: ${currencySymbols.EUR}${pld.value.toFixed(2)}`}
              </p>
            ))}
          </div>
        );
      }
      return null;
    };

    function DailyChartEUR({ entries, settings }) {
      const rateEURtoUSD = settings?.eur_to_usd_rate || 1.1;
      const rateUSDtoEUR = 1 / rateEURtoUSD; // Calculate USD to EUR rate

      const processChartData = useMemo(() => {
        if (!entries || entries.length === 0) {
          return { data: [], hasMixedCurrencies: false };
        }

        let hasMixedCurrencies = false;
        const baseCurrency = 'EUR';

        // Find date range
        const sortedEntries = [...entries].sort((a, b) => a.date - b.date);
        const firstDate = sortedEntries[0]?.date ? startOfDay(sortedEntries[0].date) : null;
        const lastDate = sortedEntries[sortedEntries.length - 1]?.date ? endOfDay(sortedEntries[sortedEntries.length - 1].date) : null;

        if (!firstDate || !lastDate || isNaN(firstDate.getTime()) || isNaN(lastDate.getTime())) {
           return { data: [], hasMixedCurrencies: false };
        }

        // Create a map for quick lookup
        const dailyDataMap = new Map();

        // Aggregate data by day
        entries.forEach(entry => {
          const date = entry.date;
          if (!date || isNaN(date.getTime())) return;

          const dayKey = format(startOfDay(date), 'yyyy-MM-dd');

          const income = entry.income || 0;
          const spend = entry.ad_spend || 0;
          const incomeCurrency = entry.income_currency || 'EUR';
          const spendCurrency = entry.ad_spend_currency || 'USD';

          // Convert to base currency (EUR)
          const incomeInBase = incomeCurrency === baseCurrency ? income : (incomeCurrency === 'USD' ? income * rateUSDtoEUR : 0);
          const spendInBase = spendCurrency === baseCurrency ? spend : (spendCurrency === 'USD' ? spend * rateUSDtoEUR : 0);

          // Flag if non-standard currencies are used
          if ((incomeCurrency !== 'USD' && incomeCurrency !== 'EUR' && income > 0) ||
              (spendCurrency !== 'USD' && spendCurrency !== 'EUR' && spend > 0)) {
            hasMixedCurrencies = true;
          }

          if (!dailyDataMap.has(dayKey)) {
            dailyDataMap.set(dayKey, { day: dayKey, income: 0, adSpend: 0, profit: 0 });
          }

          const dayData = dailyDataMap.get(dayKey);
          dayData.income += incomeInBase;
          dayData.adSpend += spendInBase;
          dayData.profit += (incomeInBase - spendInBase);
        });

         // Generate all days in the interval to ensure continuity
         const allDays = eachDayOfInterval({ start: firstDate, end: lastDate });
         const data = allDays.map(day => {
           const dayKey = format(day, 'yyyy-MM-dd');
           return dailyDataMap.get(dayKey) || { day: dayKey, income: 0, adSpend: 0, profit: 0 };
         });

        return { data, hasMixedCurrencies };

      }, [entries, rateUSDtoEUR]); // Use rateUSDtoEUR dependency

      const { data: chartData, hasMixedCurrencies } = processChartData;
      const symbol = currencySymbols.EUR;

      const formatAxisTick = (tickItem) => {
          if (typeof tickItem !== 'number') return '';
          return `${symbol}${tickItem.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
      };
      const formatXAxisTick = (day) => format(parseISO(day), 'MMM dd');

      // Define colors for areas/lines
      const incomeColor = "hsl(var(--chart-1, 142 70% 50%))"; // Greenish
      const spendColor = "hsl(var(--chart-2, 355 70% 60%))"; // Reddish
      const profitColor = "hsl(var(--chart-3, 210 80% 65%))"; // Blueish

      return (
        <Card className="shadow-lg border border-border/40 bg-card/80 backdrop-blur-sm mt-8 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Daily Performance Trend (Est. EUR)</CardTitle>
            <CardDescription>Income, Ad Spend, and Profit trends over time (converted to EUR).</CardDescription>
            {hasMixedCurrencies && (
              <div className="flex items-center text-xs text-destructive mt-1">
                <AlertTriangle className="h-4 w-4 mr-1" /> Warning: Entries with unknown currencies are excluded from chart totals.
              </div>
            )}
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart
                  data={chartData}
                  margin={{ top: 5, right: 5, left: 15, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="gradientIncomeDailyEUR" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={incomeColor} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={incomeColor} stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="gradientSpendDailyEUR" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={spendColor} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={spendColor} stopOpacity={0.1}/>
                    </linearGradient>
                     <linearGradient id="gradientProfitDailyEUR" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={profitColor} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={profitColor} stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} vertical={false} />
                  <XAxis
                    dataKey="day"
                    tickFormatter={formatXAxisTick}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    interval="preserveStartEnd" // Adjust interval for better readability if needed
                  />
                  <YAxis
                    tickFormatter={formatAxisTick}
                    width={70}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--accent))', strokeWidth: 1, strokeDasharray: '3 3' }} />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Area type="monotone" dataKey="income" stroke={incomeColor} fill="url(#gradientIncomeDailyEUR)" name="Income (EUR)" strokeWidth={2} />
                  <Area type="monotone" dataKey="adSpend" stroke={spendColor} fill="url(#gradientSpendDailyEUR)" name="Ad Spend (EUR)" strokeWidth={2} />
                  <Area type="monotone" dataKey="profit" stroke={profitColor} fill="url(#gradientProfitDailyEUR)" name="Profit (EUR)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground py-10">No data available to display the chart. Add some entries first.</p>
            )}
          </CardContent>
        </Card>
      );
    }

    export default DailyChartEUR;
  