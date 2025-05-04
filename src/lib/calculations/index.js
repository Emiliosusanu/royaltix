
    import { calculateDashboardMetricsCore } from './calculateDashboardMetricsCore';
    import { calculateProjections } from './calculateProjections';
    import { calculateUnpaidRoyalties } from './calculateUnpaidRoyalties';
    import { calculatePerformanceForPeriod } from './calculatePerformanceForPeriod'; // If needed elsewhere

    export {
        calculateDashboardMetricsCore,
        calculateProjections,
        calculateUnpaidRoyalties,
        calculatePerformanceForPeriod
    };

    // Main function to assemble all dashboard metrics
    export const calculateAllDashboardMetrics = (entries, otherExpenses, allEntries, settings) => {

      const coreMetrics = calculateDashboardMetricsCore(entries, otherExpenses, settings);

      const {
          totalIncomeEUR,
          totalSpendEUR,
          totalOtherExpensesEUR,
          daysOfData,
          hasMixedCurrenciesInCalc,
          firstDate,
          lastDate,
          // Include USD totals if needed elsewhere, otherwise they can be omitted
          totalIncomeUSD,
          totalSpendUSD,
          totalOtherExpensesUSD
      } = coreMetrics;

      // Calculate derived metrics
      const totalGrossProfitEUR = totalIncomeEUR - totalSpendEUR;
      const totalNetProfitEUR = totalGrossProfitEUR - totalOtherExpensesEUR;
      const totalCostsEUR = totalSpendEUR + totalOtherExpensesEUR;

      const roiEUR = totalCostsEUR !== 0 ? (totalNetProfitEUR / totalCostsEUR) * 100 : (totalNetProfitEUR > 0 ? Infinity : 0);
      const roasEUR = totalSpendEUR !== 0 ? (totalIncomeEUR / totalSpendEUR) : (totalIncomeEUR > 0 ? Infinity : 0);

      const avgDailyGrossProfitEUR = daysOfData > 0 ? totalGrossProfitEUR / daysOfData : 0;
      const avgDailyNetProfitEUR = daysOfData > 0 ? totalNetProfitEUR / daysOfData : 0;

      // Calculate projections
      const { monthlyEstimate: monthlyEstimateGrossEUR, yearlyEstimate: yearlyEstimateGrossEUR } = calculateProjections(avgDailyGrossProfitEUR);
      const { monthlyEstimate: monthlyEstimateNetEUR, yearlyEstimate: yearlyEstimateNetEUR } = calculateProjections(avgDailyNetProfitEUR); // Added Net Monthly back

      // Calculate unpaid royalties (using allEntries)
      const unpaidRoyaltiesEUR = calculateUnpaidRoyalties(allEntries, settings);

      return {
        totalIncomeEUR,
        totalSpendEUR,
        totalOtherExpensesEUR,
        totalGrossProfitEUR, // Useful for Gross Profit widgets/projections
        totalNetProfitEUR,   // Main Net Profit widget
        roiEUR,
        roasEUR,
        avgDailyGrossProfitEUR, // Used for Gross projections
        avgDailyNetProfitEUR,   // Used for Net projections
        daysOfData,
        firstDate,
        lastDate,
        hasMixedCurrenciesInCalc,
        monthlyEstimateGrossEUR,
        yearlyEstimateGrossEUR,
        monthlyEstimateNetEUR, // Include Net Monthly projection
        yearlyEstimateNetEUR,
        unpaidRoyaltiesEUR,
        // Include USD values if they are needed by any component
        totalIncomeUSD,
        totalSpendUSD,
        totalOtherExpensesUSD,
        totalGrossProfitUSD: totalIncomeUSD - totalSpendUSD,
        totalNetProfitUSD: totalIncomeUSD - totalSpendUSD - totalOtherExpensesUSD,
      };
    };
  