
    import { isValid } from 'date-fns';
    import {
        calculateProjections,
        calculateRollingAverageMetrics
    } from '@/lib/calculations/projectionCalculations';
    import {
        sumFinancials,
        getUniqueDates,
        calculateRatios,
        calculateOverallAverages
    } from '@/lib/calculations/calculationUtils';

    // --- Refactored Helper Functions ---

    // Calculate summed totals (EUR & USD) and date ranges
    const calculateFilteredTotals = (validEntries, validOtherExpenses, settings) => {
        const totals = sumFinancials(validEntries, validOtherExpenses, settings);
        const totalGrossProfitEUR = totals.totalIncomeEUR - totals.totalSpendEUR;
        const totalNetProfitEUR = totalGrossProfitEUR - totals.totalOtherExpensesEUR;
        const totalGrossProfitUSD = totals.totalIncomeUSD - totals.totalSpendUSD;
        const totalNetProfitUSD = totalGrossProfitUSD - totals.totalOtherExpensesUSD;

        return {
            ...totals,
            totalGrossProfitEUR,
            totalNetProfitEUR,
            totalGrossProfitUSD,
            totalNetProfitUSD
        };
    };

    // Calculate ratios (ROI, ROAS) and overall daily averages
    const calculateFilteredRatiosAndAverages = (totals, validEntries, validOtherExpenses) => {
        const { roiEUR, roasEUR } = calculateRatios(
            totals.totalNetProfitEUR,
            totals.totalIncomeEUR,
            totals.totalSpendEUR,
            totals.totalOtherExpensesEUR
        );

        const uniqueDatesFiltered = getUniqueDates([...validEntries, ...validOtherExpenses]);
        const daysOfData = uniqueDatesFiltered.size;

        const { avgDailyGrossProfitEUR_Overall, avgDailyNetProfitEUR_Overall } = calculateOverallAverages(
            totals.totalGrossProfitEUR,
            totals.totalNetProfitEUR,
            daysOfData
        );

        const avgDailyOtherExpensesEUR_Overall = daysOfData > 0 ? totals.totalOtherExpensesEUR / daysOfData : 0;

        return {
            roiEUR,
            roasEUR,
            daysOfData,
            avgDailyGrossProfitEUR_Overall,
            avgDailyNetProfitEUR_Overall,
            avgDailyOtherExpensesEUR_Overall
        };
    };

    // Calculate rolling averages and projections
    const calculateRollingAndProjectionMetrics = (
        validEntries,
        totals, // Use totals calculated earlier
        avgDailyOtherExpensesEUR_Overall, // Use overall expense average
        settings
    ) => {
         // Calculate Rolling Average Gross Profit (Handles single-entry months)
        const {
          avgDailyGrossProfitEUR_Rolling, // Based on weighted daily/monthly logic
          daysUsedForProjection // Total days represented (actual + implied)
        } = calculateRollingAverageMetrics(
            validEntries,
            totals.latestDate,
            totals.earliestDate,
            settings
        );

        // Calculate Projected Average Daily Net Profit
        let projectedAvgDailyNetProfit = avgDailyGrossProfitEUR_Rolling - avgDailyOtherExpensesEUR_Overall;

        // Apply Safeguard
        if (projectedAvgDailyNetProfit < 0 && avgDailyGrossProfitEUR_Rolling > 0) {
            projectedAvgDailyNetProfit = 0;
        }
        projectedAvgDailyNetProfit = (Number.isFinite(projectedAvgDailyNetProfit) && projectedAvgDailyNetProfit > 0) ? projectedAvgDailyNetProfit : 0;

        // Calculate Projections
        const grossProjections = calculateProjections(avgDailyGrossProfitEUR_Rolling);
        const netProjections = calculateProjections(projectedAvgDailyNetProfit);

        return {
            monthlyEstimateGrossEUR: grossProjections.monthlyEstimate,
            yearlyEstimateGrossEUR: grossProjections.yearlyEstimate,
            monthlyEstimateNetEUR: netProjections.monthlyEstimate,
            yearlyEstimateNetEUR: netProjections.yearlyEstimate,
            daysUsedForProjection
        };
    };


    // --- Main Calculation Function ---

    export const calculateDashboardMetrics = (filteredEntries, filteredOtherExpenses, settings) => {

      const initialState = {
        totalIncomeUSD: 0, totalSpendUSD: 0, totalOtherExpensesUSD: 0,
        totalGrossProfitUSD: 0, totalNetProfitUSD: 0,
        totalIncomeEUR: 0, totalSpendEUR: 0, totalOtherExpensesEUR: 0,
        totalGrossProfitEUR: 0, totalNetProfitEUR: 0,
        roiEUR: 0, roasEUR: 0,
        avgDailyGrossProfitEUR: 0, // Overall average for the filtered period
        avgDailyNetProfitEUR: 0,   // Overall average for the filtered period
        daysOfData: 0,             // Total unique days in the filtered period (any activity)
        firstDate: null, lastDate: null, hasMixedCurrenciesInCalc: false,
        monthlyEstimateGrossEUR: 0, yearlyEstimateGrossEUR: 0,
        monthlyEstimateNetEUR: 0, yearlyEstimateNetEUR: 0,
        daysUsedForProjection: 0 // Total days represented in rolling average (actual + implied)
      };

      const validEntries = Array.isArray(filteredEntries) ? filteredEntries : [];
      const validOtherExpenses = Array.isArray(filteredOtherExpenses) ? filteredOtherExpenses : [];

      if (validEntries.length === 0 && validOtherExpenses.length === 0) return initialState;

      // 1. Calculate Filtered Totals
      const totals = calculateFilteredTotals(validEntries, validOtherExpenses, settings);

      // 2. Calculate Ratios & Overall Averages
      const {
          roiEUR,
          roasEUR,
          daysOfData,
          avgDailyGrossProfitEUR_Overall,
          avgDailyNetProfitEUR_Overall,
          avgDailyOtherExpensesEUR_Overall
      } = calculateFilteredRatiosAndAverages(totals, validEntries, validOtherExpenses);

      // 3. Calculate Rolling Averages & Projections
      const projectionResults = calculateRollingAndProjectionMetrics(
          validEntries,
          totals,
          avgDailyOtherExpensesEUR_Overall,
          settings
      );

      // 4. Consolidate Results
      return {
        ...totals, // Includes summed totals, gross/net profits (EUR/USD), date ranges
        roiEUR,
        roasEUR,
        avgDailyGrossProfitEUR: avgDailyGrossProfitEUR_Overall, // Overall average for display
        avgDailyNetProfitEUR: avgDailyNetProfitEUR_Overall,     // Overall average for display
        daysOfData, // Total unique days in filter (any activity)
        ...projectionResults // Includes gross/net estimates (EUR), daysUsedForProjection
      };
    };
  