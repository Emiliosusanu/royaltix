
    import React from 'react';

    // Calculates Net Profit (Income - Spend) per account in USD.
    export const calculateAccountProfitUSD = (entries, accounts, settings) => {
      const rateEURtoUSD = settings?.eur_to_usd_rate || 1.1;

      const profitByAccount = {}; // Store profit { accountId: profitUSD }

      if (!entries) return [];

      entries.forEach(entry => {
        const accountId = entry.account_id || 'unknown'; // Group entries without an account
        const income = entry.income || 0;
        const spend = entry.ad_spend || 0;
        const incomeCurrency = entry.income_currency || 'EUR';
        const spendCurrency = entry.ad_spend_currency || 'USD';

        // Convert to USD
        const incomeInUSD = incomeCurrency === 'USD' ? income : (incomeCurrency === 'EUR' ? income * rateEURtoUSD : 0);
        const spendInUSD = spendCurrency === 'USD' ? spend : (spendCurrency === 'EUR' ? spend * rateEURtoUSD : 0);

        const netProfitUSD = incomeInUSD - spendInUSD;

        if (!profitByAccount[accountId]) {
          profitByAccount[accountId] = 0;
        }
        profitByAccount[accountId] += netProfitUSD;
      });

      // Map results to include account details
      const result = Object.entries(profitByAccount).map(([accountId, profit]) => {
        const account = accounts?.find(acc => acc.id === accountId);
        return {
          id: accountId,
          name: account ? account.name : 'Unknown Account',
          color: account ? account.color : '#CCCCCC', // Default color for unknown
          value: profit // 'value' is standard for recharts data
        };
      });

      return result.sort((a, b) => b.value - a.value); // Sort descending by profit
    };
  