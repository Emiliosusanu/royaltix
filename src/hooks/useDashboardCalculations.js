
    import { useMemo } from 'react';
    import { calculateDashboardMetrics } from '@/lib/calculations/dashboardCalculations';
    import { calculateUnpaidRoyalties } from '@/lib/calculations/royaltyCalculations';
    import { calculateAdditionalMetrics } from '@/lib/calculations/additionalWidgetCalculations';

    const useDashboardCalculations = (filteredEntries, filteredOtherExpenses, allEntries, settings) => {

      const dashboardMetrics = useMemo(() => {
        // Calculate all primary metrics based on filtered data (prioritizes EUR)
        // This now includes daysUsedForProjection
        const baseMetrics = calculateDashboardMetrics(filteredEntries, filteredOtherExpenses, settings);

        // Calculate unpaid royalties based on ALL entries (returns EUR)
        const unpaidRoyaltiesEUR = calculateUnpaidRoyalties(allEntries, settings);

        return {
            ...baseMetrics,
            unpaidRoyaltiesEUR // Add unpaid royalties in EUR
        };
      }, [filteredEntries, filteredOtherExpenses, allEntries, settings]);

      const additionalWidgetsData = useMemo(() => {
        // Calculate overall averages based on all data (returns EUR)
        return calculateAdditionalMetrics(allEntries, settings);
      }, [allEntries, settings]);

      return {
        dashboardMetrics, // Contains all metrics including gross/net profits (EUR), projections (EUR), unpaid royalties (EUR), and daysUsedForProjection
        additionalWidgetsData, // Contains averages in EUR
      };
    };

    export default useDashboardCalculations;
  