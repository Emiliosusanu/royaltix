
    import { differenceInDays, isValid, startOfDay } from 'date-fns';

    // Calculates core financial totals (income, spend, expenses) in both USD and EUR.
    // This function aggregates data but doesn't calculate ROI, ROAS, or projections.
    export const calculateDashboardMetricsCore = (entries, otherExpenses, settings) => {
      const rateEURtoUSD = settings?.eur_to_usd_rate || 1.1;
      const rateUSDtoEUR = 1 / rateEURtoUSD;

      let totalIncomeUSD = 0;
      let totalSpendUSD = 0;
      let totalIncomeEUR = 0;
      let totalSpendEUR = 0;
      let totalOtherExpensesUSD = 0;
      let totalOtherExpensesEUR = 0;
      let hasMixedCurrenciesInCalc = false;
      let earliestDate = null;
      let latestDate = null;

      const updateDateRange = (date) => {
          if (!date || !isValid(date)) return;
          const dayStart = startOfDay(date);
          if (!earliestDate || dayStart < earliestDate) earliestDate = dayStart;
          if (!latestDate || dayStart > latestDate) latestDate = dayStart;
      };

      (entries || []).forEach(entry => {
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
          hasMixedCurrenciesInCalc = true;
        }
      });

      (otherExpenses || []).forEach(expense => {
        updateDateRange(expense.date);
        const amount = expense.amount || 0;
        const currency = expense.currency || 'USD';

        const expenseInUSD = currency === 'USD' ? amount : (currency === 'EUR' ? amount * rateEURtoUSD : 0);
        totalOtherExpensesUSD += expenseInUSD;

        const expenseInEUR = currency === 'EUR' ? amount : (currency === 'USD' ? amount * rateUSDtoEUR : 0);
        totalOtherExpensesEUR += expenseInEUR;

        if (currency !== 'USD' && currency !== 'EUR' && amount > 0) {
          hasMixedCurrenciesInCalc = true;
        }
      });

      const daysOfData = earliestDate && latestDate && isValid(earliestDate) && isValid(latestDate)
          ? differenceInDays(latestDate, earliestDate) + 1
          : 0;

      return {
        totalIncomeUSD,
        totalSpendUSD,
        totalOtherExpensesUSD,
        totalIncomeEUR,
        totalSpendEUR,
        totalOtherExpensesEUR,
        daysOfData,
        firstDate: earliestDate,
        lastDate: latestDate,
        hasMixedCurrenciesInCalc,
      };
    };
  