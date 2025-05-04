
    import { subMonths, startOfMonth, endOfMonth, addMonths, isValid, startOfDay } from 'date-fns';

    // Calculates the estimated total KDP royalties earned but not yet paid by Amazon, in EUR.
    export const calculateUnpaidRoyalties = (allEntries, settings) => {
        const rateEURtoUSD = settings?.eur_to_usd_rate || 1.1;
        const rateUSDtoEUR = 1 / rateEURtoUSD;
        const today = new Date();
        let firstUnpaidMonthStart = null;
        let lastPaidMonthDate = null;

        if (!isValid(today)) {
            console.error("Could not get valid current date for unpaid royalties calculation.");
            return 0;
        }

        const validAllEntries = Array.isArray(allEntries) ? allEntries : [];
        let earliestEntryDate = null;
        if (validAllEntries.length > 0) {
            earliestEntryDate = validAllEntries.reduce((earliest, entry) => {
                if (!entry.date || !isValid(entry.date)) return earliest;
                const entryDayStart = startOfDay(entry.date);
                return !earliest || entryDayStart < earliest ? entryDayStart : earliest;
            }, null);
        }

        // Determine the last month that should have been paid
        for (let i = 2; i < 120; i++) { // Check up to 10 years back
            try {
                const testMonthDate = startOfMonth(subMonths(today, i));
                const paymentDueDate = endOfMonth(addMonths(testMonthDate, 2));

                if (isValid(testMonthDate) && isValid(paymentDueDate) && today > paymentDueDate) {
                    lastPaidMonthDate = testMonthDate;
                    break;
                }
            } catch (error) {
                console.error("Error calculating payment due date in loop:", error);
            }
        }

        // Determine the start of the first unpaid month
        if (lastPaidMonthDate && isValid(lastPaidMonthDate)) {
            try {
                firstUnpaidMonthStart = startOfMonth(addMonths(lastPaidMonthDate, 1));
            } catch (error) {
                 console.error("Error calculating first unpaid month start:", error);
                 firstUnpaidMonthStart = null;
            }
        } else if (earliestEntryDate && isValid(earliestEntryDate)) {
            firstUnpaidMonthStart = startOfMonth(earliestEntryDate);
        } else {
            return 0;
        }

        if (!firstUnpaidMonthStart || !isValid(firstUnpaidMonthStart)) {
             console.error("Could not determine a valid start date for unpaid royalties.");
             return 0;
        }

        let totalUnpaidIncomeEUR = 0;
        validAllEntries.forEach(entry => {
            if (!entry.date || !isValid(entry.date) || startOfDay(entry.date) < firstUnpaidMonthStart) return;

            const income = entry.income || 0;
            const incomeCurrency = entry.income_currency || 'EUR';
            const incomeInEUR = incomeCurrency === 'EUR' ? income : (incomeCurrency === 'USD' ? income * rateUSDtoEUR : 0);
            totalUnpaidIncomeEUR += incomeInEUR;
        });

        return Number.isFinite(totalUnpaidIncomeEUR) ? totalUnpaidIncomeEUR : 0;
    };
  