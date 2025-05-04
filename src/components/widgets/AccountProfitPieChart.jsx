
    import React, { useMemo } from 'react';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
    import { calculateAccountProfitUSD } from '@/lib/calculations/accountCalculations';
    import { formatCurrency } from '@/lib/formatting';

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
      if (percent < 0.03) return null; // Don't render label if slice is too small

      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);

      return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="12">
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      );
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-background border border-border shadow-lg rounded-md p-2 text-sm">
                    <p className="font-semibold">{data.name}</p>
                    <p>{`Profit: ${formatCurrency(data.value, 'USD')}`}</p>
                    <p>{`Percentage: ${(data.percent * 100).toFixed(1)}%`}</p>
                </div>
            );
        }
        return null;
    };


    function AccountProfitPieChart({ entries, accounts, settings }) {
      const accountProfitData = useMemo(() => {
        return calculateAccountProfitUSD(entries, accounts, settings);
      }, [entries, accounts, settings]);

      // Filter out accounts with zero or negative profit for cleaner pie chart
      const positiveProfitData = accountProfitData.filter(d => d.value > 0);
      const totalPositiveProfit = positiveProfitData.reduce((sum, d) => sum + d.value, 0);

       // Add percentages to data for tooltip/legend
       const chartData = positiveProfitData.map(d => ({
           ...d,
           percent: totalPositiveProfit > 0 ? d.value / totalPositiveProfit : 0,
       }));


      return (
        <Card className="shadow-lg border border-border/40 bg-card/80 backdrop-blur-sm col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Account Net Profit Distribution (USD)</CardTitle>
            <CardDescription>Breakdown of total net profit by account (USD). Only shows accounts with positive profit.</CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                  >
                    {chartData.map((entry) => (
                      <Cell key={`cell-${entry.id}`} fill={entry.color || '#888888'} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                   <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      wrapperStyle={{ paddingTop: '20px' }}
                      formatter={(value, entry) => {
                        const { color, payload } = entry;
                        return <span style={{ color: '#888' }}>{payload.name} ({formatCurrency(payload.value, 'USD')})</span>;
                      }}
                    />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-muted-foreground">No positive account profit data available for the selected period.</p>
              </div>
            )}
          </CardContent>
        </Card>
      );
    }

    export default AccountProfitPieChart;
  