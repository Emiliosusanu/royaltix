
    import React from 'react';
    import DailyChartEUR from '@/components/DailyChartEUR';
    import MonthlyChart from '@/components/MonthlyChart';
    import { Card } from '@/components/ui/card';

    const ChartSkeleton = () => (
      <div className="h-80 rounded-xl bg-card/50 animate-pulse"></div>
    );

    function ChartsSection({ entries, otherExpenses, settings, filters, loading }) {
      const currentYear = new Date().getFullYear();
      const selectedYear = filters?.selectedPeriodKey?.startsWith('custom') || filters?.selectedPeriodKey === 'this_year' || filters?.selectedPeriodKey === 'all'
        ? currentYear // Default to current year for custom/all/this_year ranges spanning multiple years
        : (filters?.startDate ? filters.startDate.getFullYear() : currentYear); // Otherwise use start date year

      if (loading) {
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartSkeleton />
            <ChartSkeleton />
          </div>
        );
      }

      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-4 md:p-6 glassmorphic-card">
            <DailyChartEUR
              entries={entries}
              otherExpenses={otherExpenses}
              settings={settings}
              dateRange={{ start: filters?.startDate, end: filters?.endDate }}
            />
          </Card>
          <Card className="p-4 md:p-6 glassmorphic-card">
            <MonthlyChart
              entries={entries}
              otherExpenses={otherExpenses}
              settings={settings}
              year={selectedYear}
            />
          </Card>
        </div>
      );
    }

    export default ChartsSection;
  