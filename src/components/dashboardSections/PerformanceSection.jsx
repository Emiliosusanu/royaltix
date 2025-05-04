
    import React from 'react';
    import DailyPerformance from '@/components/DailyPerformance';
    import MonthlyPerformanceEUR from '@/components/MonthlyPerformanceEUR';

    function PerformanceSection({ entries, settings, loading }) {
      if (loading) {
        // Optional: Add skeleton loaders for performance sections
        return (
          <div className="grid grid-cols-1 gap-6 mb-8">
            <div className="h-40 rounded-xl bg-card/50 animate-pulse"></div>
            <div className="h-40 rounded-xl bg-card/50 animate-pulse"></div>
          </div>
        );
      }

      return (
        <div className="grid grid-cols-1 gap-6 mb-8">
          {/* Yesterday's Performance */}
          <DailyPerformance entries={entries} settings={settings} />

          {/* This Month's Performance */}
          <MonthlyPerformanceEUR entries={entries} settings={settings} />
        </div>
      );
    }

    export default PerformanceSection;
  