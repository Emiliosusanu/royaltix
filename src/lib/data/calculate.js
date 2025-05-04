
    import { isToday, isWithinInterval, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

    // Helper to parse DB date string (YYYY-MM-DD) into a Date object at UTC midnight
    // Moved to utils.js

    // Calculates performance metrics (income, spend, profit, ROI) for different periods in USD.
    export const calculatePerformanceMetrics = (entries, rateEURtoUSD, accountId = null) => {
      const now = new Date();
      // Ensure comparisons happen against UTC dates if entry dates are UTC
      const utcNow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
      const monthStartUTC = startOfMonth(utcNow);
      const monthEndUTC = endOfMonth(utcNow);
      const yearStartUTC = startOfYear(utcNow);
      const yearEndUTC = endOfYear(utcNow);

      const monthInterval = { start: monthStartUTC, end: monthEndUTC };
      const yearInterval = { start: yearStartUTC, end: yearEndUTC };

      const metrics = {
        today: { income: 0, spend: 0, profit: 0, roi: 0 },
        thisMonth: { income: 0, spend: 0, profit: 0, roi: 0 },
        thisYear: { income: 0, spend: 0, profit: 0, roi: 0 },
        allTime: { income: 0, spend: 0, profit: 0, roi: 0 },
      };

      // Filter entries for the selected account (if any) and ensure they have a valid date
      const relevantEntries = entries.filter(entry =>
        entry.date && (!accountId || entry.account_id === accountId)
      );

      relevantEntries.forEach(entry => {
        const income = entry.income || 0;
        const spend = entry.ad_spend || 0;
        const incomeCurrency = entry.income_currency || 'EUR';
        const spendCurrency = entry.ad_spend_currency || 'USD';

        // Convert all amounts to USD using the provided EUR to USD rate
        const incomeUSD = incomeCurrency === 'USD' ? income : (incomeCurrency === 'EUR' ? income * rateEURtoUSD : 0);
        const spendUSD = spendCurrency === 'USD' ? spend : (spendCurrency === 'EUR' ? spend * rateEURtoUSD : 0);

        // Accumulate for All Time
        metrics.allTime.income += incomeUSD;
        metrics.allTime.spend += spendUSD;

        // Accumulate for specific periods based on UTC date comparison
        if (entry.date.getTime() === utcNow.getTime()) { // Check if date is today (UTC)
            metrics.today.income += incomeUSD;
            metrics.today.spend += spendUSD;
        }
        if (isWithinInterval(entry.date, monthInterval)) {
          metrics.thisMonth.income += incomeUSD;
          metrics.thisMonth.spend += spendUSD;
        }
        if (isWithinInterval(entry.date, yearInterval)) {
          metrics.thisYear.income += incomeUSD;
          metrics.thisYear.spend += spendUSD;
        }
      });

      // Calculate profit and ROI for each period
      for (const period in metrics) {
        const current = metrics[period];
        current.profit = current.income - current.spend;
        // Handle ROI calculation: avoid division by zero, return Infinity if spend is 0 but profit > 0
        current.roi = current.spend !== 0
          ? (current.profit / current.spend) * 100
          : (current.profit > 0 ? Infinity : 0);
      }

      return metrics;
    };
  