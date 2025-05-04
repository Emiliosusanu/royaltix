
    import { getDaysInMonth, getDaysInYear, isValid, startOfDay, subDays, format, parse } from 'date-fns';
    import { sumFinancials, getUniqueDates } from '@/lib/calculations/calculationUtils';

    // Calculates monthly and yearly projections based on a given average daily profit.
    export const calculateProjections = (avgDailyProfit) => {
      if (avgDailyProfit == null || !Number.isFinite(avgDailyProfit) || avgDailyProfit < 0) {
        avgDailyProfit = 0;
      }

      const today = new Date();
      if (!isValid(today)) {
          console.error("Could not get valid current date for projections.");
          return { monthlyEstimate: 0, yearlyEstimate: 0 };
      }

      let daysInCurrentMonth = 30;
      let daysInCurrentYear = 365;

      try {
          daysInCurrentMonth = getDaysInMonth(today);
          daysInCurrentYear = getDaysInYear(today);
      } catch (error) {
          console.error("Error getting days in month/year:", error);
      }

      const monthlyEstimate = avgDailyProfit * daysInCurrentMonth;
      const yearlyEstimate = avgDailyProfit * daysInCurrentYear;

      return {
          monthlyEstimate: Number.isFinite(monthlyEstimate) ? monthlyEstimate : 0,
          yearlyEstimate: Number.isFinite(yearlyEstimate) ? yearlyEstimate : 0
      };
    };


    // New: Calculates rolling average GROSS profit, handling single-entry months as monthly totals.
    export const calculateRollingAverageMetrics = (
        validEntries,
        latestDateOverall,
        earliestDateOverall,
        settings
    ) => {
        let avgDailyGrossProfitEUR_Rolling = 0;
        let daysUsedForProjection = 0; // Total days represented (actual daily + implied monthly)

        if (!latestDateOverall || !isValid(latestDateOverall)) {
            return { avgDailyGrossProfitEUR_Rolling, daysUsedForProjection };
        }

        const rangeStartDate = earliestDateOverall && isValid(earliestDateOverall) ? earliestDateOverall : startOfDay(subDays(latestDateOverall, 29));
        const thirtyDayWindowStart = startOfDay(subDays(latestDateOverall, 29));
        const projectionWindowStartDate = rangeStartDate > thirtyDayWindowStart ? rangeStartDate : thirtyDayWindowStart;

        const entriesInWindow = validEntries.filter(entry => {
            try {
                const entryDate = typeof entry.date === 'string' ? new Date(entry.date + 'T00:00:00Z') : entry.date;
                return isValid(entryDate) && startOfDay(entryDate) >= projectionWindowStartDate && startOfDay(entryDate) <= latestDateOverall;
            } catch (e) { return false; }
        });

        if (entriesInWindow.length === 0) {
             return { avgDailyGrossProfitEUR_Rolling: 0, daysUsedForProjection: 0 };
        }

        const entriesByMonth = {}; // Group by 'YYYY-MM'
        entriesInWindow.forEach(entry => {
            try {
                const entryDate = typeof entry.date === 'string' ? new Date(entry.date + 'T00:00:00Z') : entry.date;
                if (isValid(entryDate)) {
                    const monthKey = format(entryDate, 'yyyy-MM');
                    if (!entriesByMonth[monthKey]) {
                        entriesByMonth[monthKey] = [];
                    }
                    entriesByMonth[monthKey].push(entry);
                }
            } catch (e) {
                 console.error("Error grouping entry by month:", entry.date, e);
            }
        });

        let totalGrossProfitFromWindow = 0;
        let totalDaysRepresentedInWindow = 0;

        for (const monthKey in entriesByMonth) {
            const monthEntries = entriesByMonth[monthKey];
            const monthDate = parse(monthKey, 'yyyy-MM', new Date()); // Get a date object for the month

            if (monthEntries.length === 1) {
                // Treat as a monthly summary
                const summaryEntry = monthEntries[0];
                const summaryFinancials = sumFinancials([summaryEntry], [], settings); // Calculate financials for this single entry
                const monthlyGrossProfit = summaryFinancials.totalIncomeEUR - summaryFinancials.totalSpendEUR;
                const daysInThisMonth = getDaysInMonth(monthDate);

                totalGrossProfitFromWindow += monthlyGrossProfit;
                totalDaysRepresentedInWindow += daysInThisMonth;

            } else if (monthEntries.length > 1) {
                // Treat as daily entries
                const dailyFinancials = sumFinancials(monthEntries, [], settings); // Calculate financials for these daily entries
                const dailyGrossProfitSum = dailyFinancials.totalIncomeEUR - dailyFinancials.totalSpendEUR;

                // Calculate unique days ONLY for this month's daily entries
                 const uniqueDailyKdpActivityDatesInMonth = getUniqueDates(
                    monthEntries.filter(entry => (entry.income || 0) > 0 || (entry.ad_spend || 0) > 0)
                 );
                 const uniqueDaysCount = uniqueDailyKdpActivityDatesInMonth.size;

                totalGrossProfitFromWindow += dailyGrossProfitSum;
                totalDaysRepresentedInWindow += uniqueDaysCount; // Add only the actual days recorded
            }
        }


        // Calculate the final average daily gross profit based on the window's data
        avgDailyGrossProfitEUR_Rolling = totalDaysRepresentedInWindow > 0
            ? totalGrossProfitFromWindow / totalDaysRepresentedInWindow
            : 0;

        // Assign the total days represented to daysUsedForProjection
        daysUsedForProjection = totalDaysRepresentedInWindow;


        // Ensure result is a finite, non-negative number
        avgDailyGrossProfitEUR_Rolling = (Number.isFinite(avgDailyGrossProfitEUR_Rolling) && avgDailyGrossProfitEUR_Rolling > 0) ? avgDailyGrossProfitEUR_Rolling : 0;


        return {
            avgDailyGrossProfitEUR_Rolling,
            daysUsedForProjection // Reflects total days represented (actual daily + implied monthly)
        };
    };
  