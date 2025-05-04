
    import { isValid, startOfDay } from 'date-fns';

    // Calculates Income, Spend, and Profit in EUR for a given period (start and end dates).
    export const calculatePerformanceForPeriod = (entries, startDate, endDate, rateUSDtoEUR) => {
      let incomeEUR = 0;
      let spendEUR = 0;

      (entries || []).forEach(entry => {
        if (!entry.date || !isValid(entry.date)) return;

        // Ensure comparison uses start of day for consistency if needed,
        // or compare directly if full date objects are expected.
        // Here assuming direct comparison is okay if startDate/endDate are precise.
        // If using date strings, convert to Date first.
        const entryDate = entry.date; // Assuming entry.date is already a Date object

        if (entryDate >= startDate && entryDate <= endDate) {
          const entryIncome = entry.income || 0;
          const entrySpend = entry.ad_spend || 0;
          const incomeCurrency = entry.income_currency || 'EUR';
          const spendCurrency = entry.ad_spend_currency || 'USD';

          const incomeInEUR = incomeCurrency === 'EUR' ? entryIncome : (incomeCurrency === 'USD' ? entryIncome * rateUSDtoEUR : 0);
          const spendInEUR = spendCurrency === 'EUR' ? entrySpend : (spendCurrency === 'USD' ? entrySpend * rateUSDtoEUR : 0);

          incomeEUR += incomeInEUR;
          spendEUR += spendInEUR;
        }
      });

      const profitEUR = incomeEUR - spendEUR;

      return {
        income: Number.isFinite(incomeEUR) ? incomeEUR : 0,
        spend: Number.isFinite(spendEUR) ? spendEUR : 0,
        profit: Number.isFinite(profitEUR) ? profitEUR : 0,
      };
    };
  