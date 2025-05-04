
    import { differenceInDays } from 'date-fns';

    // Calculates additional metrics like overall averages based on all entries.
    // Now calculates in EUR.
    export const calculateAdditionalMetrics = (allEntries, settings) => {
      const rateEURtoUSD = settings?.eur_to_usd_rate || 1.1;
      const rateUSDtoEUR = 1 / rateEURtoUSD;

      const initialState = {
        avgDailySpendEUR: 0,
        avgIncomePerEntryEUR: 0,
        totalEntriesCount: 0,
        totalDaysWithData: 0,
      };

      if (!allEntries || allEntries.length === 0) {
        return initialState;
      }

      let totalSpendEUR = 0;
      let totalIncomeEUR = 0;
      let earliestDate = null;
      let latestDate = null;

      allEntries.forEach(entry => {
        if (entry.date) {
           if (!earliestDate || entry.date < earliestDate) earliestDate = entry.date;
           if (!latestDate || entry.date > latestDate) latestDate = entry.date;
        }

        const income = entry.income || 0;
        const spend = entry.ad_spend || 0;
        const incomeCurrency = entry.income_currency || 'EUR';
        const spendCurrency = entry.ad_spend_currency || 'USD';

        const incomeInEUR = incomeCurrency === 'EUR' ? income : (incomeCurrency === 'USD' ? income * rateUSDtoEUR : 0);
        const spendInEUR = spendCurrency === 'EUR' ? spend : (spendCurrency === 'USD' ? spend * rateUSDtoEUR : 0);

        totalIncomeEUR += incomeInEUR;
        totalSpendEUR += spendInEUR;
      });

      const totalDaysWithData = earliestDate && latestDate ? differenceInDays(latestDate, earliestDate) + 1 : 0;
      const totalEntriesCount = allEntries.length;

      const avgDailySpendEUR = totalDaysWithData > 0 ? totalSpendEUR / totalDaysWithData : 0;
      const avgIncomePerEntryEUR = totalEntriesCount > 0 ? totalIncomeEUR / totalEntriesCount : 0;


      return {
        avgDailySpendEUR,
        avgIncomePerEntryEUR,
        totalEntriesCount,
        totalDaysWithData,
      };
    };
  