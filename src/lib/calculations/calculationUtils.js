
    import { isValid, startOfDay, format } from 'date-fns';

    // Helper function to get unique dates from a list of items
    export const getUniqueDates = (items) => {
        const dateSet = new Set();
        items.forEach(item => {
            try {
                if (!item.date) return;
                // Ensure date is treated consistently, assuming UTC if string YYYY-MM-DD
                const date = typeof item.date === 'string' ? new Date(item.date + 'T00:00:00Z') : item.date;
                if (isValid(date)) {
                    // Format to YYYY-MM-DD string to ensure uniqueness based on day, not time
                    const dateString = format(startOfDay(date), 'yyyy-MM-dd');
                    dateSet.add(dateString);
                }
            } catch (e) {
                console.error("Error processing date for unique count:", item.date, e);
            }
        });
        return dateSet;
    };


    // Helper function to sum up entries and expenses, converting to EUR and USD
    export const sumFinancials = (entries, otherExpenses, settings) => {
      const rateEURtoUSD = settings?.eur_to_usd_rate || 1.1;
      const rateUSDtoEUR = 1 / rateEURtoUSD;

      let totalIncomeUSD = 0;
      let totalSpendUSD = 0;
      let totalIncomeEUR = 0;
      let totalSpendEUR = 0;
      let totalOtherExpensesUSD = 0;
      let totalOtherExpensesEUR = 0;
      let hasMixedCurrencies = false;
      let earliestDate = null;
      let latestDate = null;

      const updateDateRange = (dateStr) => {
          try {
              if (!dateStr) return;
              const date = typeof dateStr === 'string' ? new Date(dateStr + 'T00:00:00Z') : dateStr; // Assume UTC if string
              if (!isValid(date)) return;
              const dayStart = startOfDay(date);
              if (!earliestDate || dayStart < earliestDate) earliestDate = dayStart;
              if (!latestDate || dayStart > latestDate) latestDate = dayStart;
          } catch (e) {
              console.error("Error parsing date in updateDateRange:", dateStr, e);
          }
      };


      entries.forEach(entry => {
        updateDateRange(entry.date);
        const income = entry.income || 0;
        const spend = entry.ad_spend || 0;
        const incomeCurrency = entry.income_currency || 'EUR';
        const spendCurrency = entry.ad_spend_currency || 'USD';

        const incomeInUSD = incomeCurrency === 'USD' ? income : (incomeCurrency === 'EUR' ? income * rateEURtoUSD : 0);
        const spendInUSD = spendCurrency === 'USD' ? spend : (spendCurrency === 'EUR' ? spend * rateEURtoUSD : 0);
        totalIncomeUSD += incomeInUSD;
        totalSpendUSD += spendInUSD;

        const incomeInEUR = incomeCurrency === 'EUR' ? income : (incomeCurrency === 'USD' ? income * rateUSDtoEUR : 0);
        const spendInEUR = spendCurrency === 'EUR' ? spend : (spendCurrency === 'USD' ? spend * rateUSDtoEUR : 0);
        totalIncomeEUR += incomeInEUR;
        totalSpendEUR += spendInEUR;

        if ((incomeCurrency !== 'EUR' && incomeCurrency !== 'USD' && income > 0) ||
            (spendCurrency !== 'USD' && spendCurrency !== 'EUR' && spend > 0)) {
          hasMixedCurrencies = true;
        }
      });

      otherExpenses.forEach(expense => {
        updateDateRange(expense.date);
        const amount = expense.amount || 0;
        const currency = expense.currency || 'USD';

        const expenseInUSD = currency === 'USD' ? amount : (currency === 'EUR' ? amount * rateEURtoUSD : 0);
        totalOtherExpensesUSD += expenseInUSD;

        const expenseInEUR = currency === 'EUR' ? amount : (currency === 'USD' ? amount * rateUSDtoEUR : 0);
        totalOtherExpensesEUR += expenseInEUR;

        if (currency !== 'USD' && currency !== 'EUR' && amount > 0) {
          hasMixedCurrencies = true;
        }
      });

       return {
         totalIncomeUSD,
         totalSpendUSD,
         totalIncomeEUR,
         totalSpendEUR,
         totalOtherExpensesUSD,
         totalOtherExpensesEUR,
         hasMixedCurrencies,
         earliestDate,
         latestDate,
       };
    };

    // Helper function to calculate ROI and ROAS
    export const calculateRatios = (totalNetProfitEUR, totalIncomeEUR, totalSpendEUR, totalOtherExpensesEUR) => {
        const totalCostsEUR = totalSpendEUR + totalOtherExpensesEUR;
        const roiEUR = totalCostsEUR !== 0 ? (totalNetProfitEUR / totalCostsEUR) * 100 : (totalNetProfitEUR > 0 ? Infinity : 0);
        const roasEUR = totalSpendEUR !== 0 ? (totalIncomeEUR / totalSpendEUR) : (totalIncomeEUR > 0 ? Infinity : 0);
        return { roiEUR, roasEUR };
    };

    // Helper function to calculate overall daily averages
    export const calculateOverallAverages = (totalGrossProfitEUR, totalNetProfitEUR, daysOfData) => {
        const avgDailyGrossProfitEUR_Overall = daysOfData > 0 ? totalGrossProfitEUR / daysOfData : 0;
        const avgDailyNetProfitEUR_Overall = daysOfData > 0 ? totalNetProfitEUR / daysOfData : 0;
        return { avgDailyGrossProfitEUR_Overall, avgDailyNetProfitEUR_Overall };
    };
  