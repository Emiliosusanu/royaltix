
    import { startOfMonth, endOfMonth, addMonths, subMonths, isValid, startOfDay } from 'date-fns';

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
                // Ensure entry.date is valid before comparison
                if (!entry.date || !isValid(entry.date)) return earliest;
                const entryDayStart = startOfDay(entry.date);
                return !earliest || entryDayStart < earliest ? entryDayStart : earliest;
            }, null);
        }

        // Determine the last month that should have been paid
        // Payment for month M is due end of M+2
        // If today is T, we need to find the latest month M such that endOfMonth(M+2) < T
        for (let i = 2; i < 120; i++) { // Check up to 10 years back
            try {
                const testMonthDate = startOfMonth(subMonths(today, i));
                // Calculate payment due date (end of month, 2 months after the sales month)
                const paymentDueDate = endOfMonth(addMonths(testMonthDate, 2));

                if (isValid(testMonthDate) && isValid(paymentDueDate) && today > paymentDueDate) {
                    lastPaidMonthDate = testMonthDate;
                    break; // Found the most recent paid month
                }
            } catch (error) {
                console.error("Error calculating payment due date in loop:", error);
                // Continue loop if one iteration fails
            }
        }

        // Determine the start of the first unpaid month
        if (lastPaidMonthDate && isValid(lastPaidMonthDate)) {
            try {
                firstUnpaidMonthStart = startOfMonth(addMonths(lastPaidMonthDate, 1));
            } catch (error) {
                 console.error("Error calculating first unpaid month start:", error);
                 firstUnpaidMonthStart = null; // Reset if calculation fails
            }
        } else if (earliestEntryDate && isValid(earliestEntryDate)) {
            // If no months have been paid yet (or calculation failed), start from the earliest entry month
            firstUnpaidMonthStart = startOfMonth(earliestEntryDate);
        } else {
            // No valid entries or dates found
            return 0;
        }

        // Ensure firstUnpaidMonthStart is valid before proceeding
        if (!firstUnpaidMonthStart || !isValid(firstUnpaidMonthStart)) {
             console.error("Could not determine a valid start date for unpaid royalties.");
             return 0;
        }


        let totalUnpaidIncomeEUR = 0;
        validAllEntries.forEach(entry => {
            // Ensure entry date is valid and falls within the unpaid period
            if (!entry.date || !isValid(entry.date) || startOfDay(entry.date) < firstUnpaidMonthStart) return;

            const income = entry.income || 0;
            const incomeCurrency = entry.income_currency || 'EUR';
            const incomeInEUR = incomeCurrency === 'EUR' ? income : (incomeCurrency === 'USD' ? income * rateUSDtoEUR : 0);
            totalUnpaidIncomeEUR += incomeInEUR;
        });

        return Number.isFinite(totalUnpaidIncomeEUR) ? totalUnpaidIncomeEUR : 0;
    };
  