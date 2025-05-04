
    import React from 'react';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
    import { format, eachMonthOfInterval, startOfMonth, endOfMonth, getMonth, getYear, isValid, startOfYear, endOfYear } from 'date-fns';
    import { currencySymbols } from '@/lib/formatting';

    const aggregateMonthlyData = (entries, settings, year) => {
      const rateEURtoUSD = settings?.eur_to_usd_rate || 1.1;

      // Validate year and create Date objects
      const currentYear = getYear(new Date());
      const targetYear = typeof year === 'number' && year > 1900 && year < 3000 ? year : currentYear; // Default to current year if invalid

      const yearStart = startOfYear(new Date(targetYear, 0, 1));
      const yearEnd = endOfYear(new Date(targetYear, 11, 31));

      // Ensure dates are valid before proceeding
      if (!isValid(yearStart) || !isValid(yearEnd)) {
          console.error("Invalid year provided to MonthlyChart, defaulting to current year or returning empty data.");
          return []; // Return empty data if dates are invalid
      }


      let months = [];
      try {
          months = eachMonthOfInterval({ start: yearStart, end: yearEnd });
      } catch (error) {
          console.error("Error calculating months interval:", error);
          return []; // Return empty data if interval calculation fails
      }


      const monthlyData = months.map(monthStart => ({
        name: format(monthStart, 'MMM yyyy'),
        'Income (USD)': 0,
        'Ad Spend (USD)': 0,
        'Profit (USD)': 0,
      }));

      entries.forEach(entry => {
        // Ensure entry.date is a valid Date object before using getYear/getMonth
        if (entry.date && isValid(entry.date) && getYear(entry.date) === targetYear) {
          const monthIndex = getMonth(entry.date);
          // Ensure monthIndex is valid before accessing monthlyData
           if (monthIndex >= 0 && monthIndex < monthlyData.length) {
              const income = entry.income || 0;
              const spend = entry.ad_spend || 0;
              const incomeCurrency = entry.income_currency || 'EUR';
              const spendCurrency = entry.ad_spend_currency || 'USD';

              const incomeUSD = incomeCurrency === 'USD' ? income : (incomeCurrency === 'EUR' ? income * rateEURtoUSD : 0);
              const spendUSD = spendCurrency === 'USD' ? spend : (spendCurrency === 'EUR' ? spend * rateEURtoUSD : 0);
              const profitUSD = incomeUSD - spendUSD;

              monthlyData[monthIndex]['Income (USD)'] += incomeUSD;
              monthlyData[monthIndex]['Ad Spend (USD)'] += spendUSD;
              monthlyData[monthIndex]['Profit (USD)'] += profitUSD;
           } else {
              console.warn("Invalid month index calculated for entry:", entry);
           }
        }
      });

      // Round values for display
      return monthlyData.map(data => ({
          ...data,
          'Income (USD)': Math.round(data['Income (USD)'] * 100) / 100,
          'Ad Spend (USD)': Math.round(data['Ad Spend (USD)'] * 100) / 100,
          'Profit (USD)': Math.round(data['Profit (USD)'] * 100) / 100,
      }));
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
          return (
            <div className="bg-background border border-border shadow-lg p-3 rounded-md">
              <p className="label font-semibold">{`${label}`}</p>
              {payload.map((entry, index) => (
                <p key={`item-${index}`} style={{ color: entry.color }}>
                  {`${entry.name} : ${currencySymbols['USD']}${entry.value.toFixed(2)}`}
                </p>
              ))}
            </div>
          );
        }
        return null;
    };


    function MonthlyChart({ entries, settings, year }) {
       // Pass the potentially validated year to aggregateMonthlyData
       const currentYear = getYear(new Date());
       const targetYear = typeof year === 'number' && year > 1900 && year < 3000 ? year : currentYear;
      const data = aggregateMonthlyData(entries, settings, targetYear);

      if (!data || data.length === 0) {
          return (
             <Card className="shadow-lg border border-border/40 bg-card/80 backdrop-blur-lg">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-purple-700 dark:to-indigo-700 p-1"></div>
                <CardHeader>
                    <CardTitle>Monthly Performance Trend (Est. USD)</CardTitle>
                     <CardDescription>No data available for the selected year ({targetYear}).</CardDescription>
                </CardHeader>
                 <CardContent className="flex items-center justify-center h-[300px]">
                    <p className="text-muted-foreground">No data to display.</p>
                 </CardContent>
             </Card>
          );
      }

      return (
        <Card className="shadow-lg border border-border/40 bg-card/80 backdrop-blur-lg">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-purple-700 dark:to-indigo-700 p-1"></div>
          <CardHeader>
            <CardTitle>Monthly Performance Trend (Est. USD)</CardTitle>
            <CardDescription>Income, Ad Spend, and Profit trends for {targetYear} (converted to USD).</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                   fontSize={12}
                   tickLine={false}
                   axisLine={false}
                   tickFormatter={(value) => `${currencySymbols['USD']}${value}`}
                 />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(150, 150, 150, 0.1)' }}/>
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                 <ReferenceLine y={0} stroke="#a0a0a0" strokeDasharray="3 3" />
                <Bar dataKey="Income (USD)" fill="var(--chart-income, #82ca9d)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Ad Spend (USD)" fill="var(--chart-spend, #ff7300)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Profit (USD)" fill="var(--chart-profit, #8884d8)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      );
    }

    export default MonthlyChart;
  