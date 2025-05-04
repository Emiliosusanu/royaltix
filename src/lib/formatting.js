
    import { format as formatDateFns } from 'date-fns';

    export const currencySymbols = {
        USD: '$',
        EUR: '€',
        GBP: '£',
        // Add other common currencies if needed
    };

    export function formatCurrency(value, currency = 'EUR') { // Default to EUR
      if (value == null || Number.isNaN(value)) {
        return "N/A";
      }
      if (!Number.isFinite(value)) {
         return value > 0 ? "∞" : "-∞";
      }

      const symbol = currencySymbols[currency] || currency;

      if (value === 0) {
           const zeroFormatted = (0).toLocaleString(undefined, {
               style: 'decimal',
               minimumFractionDigits: 2,
               maximumFractionDigits: 2,
             });
           return `${symbol}${zeroFormatted}`;
      }

      try {
        const numberPart = new Intl.NumberFormat(undefined, {
          style: 'decimal',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(value);
        return `${symbol}${numberPart}`;
      } catch (error) {
        console.error("Error formatting currency:", error);
         const fixedValue = Math.abs(value).toFixed(2);
         return `${value < 0 ? '-' : ''}${symbol}${fixedValue}`;
      }
    }

    // This function formats numbers without a currency symbol, used by projections
    export function formatNumber(value) {
        if (value == null || Number.isNaN(value)) {
          return "N/A";
        }
        if (!Number.isFinite(value)) {
           return value > 0 ? "∞" : "-∞";
        }

         try {
            return new Intl.NumberFormat(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(value);
         } catch(error) {
             console.error("Error formatting number:", error);
             return value.toFixed(2);
         }
    }


    export function formatPercentage(value) {
      if (value == null || Number.isNaN(value)) {
        return "N/A";
      }
      if (!Number.isFinite(value)) {
         return value > 0 ? "∞%" : "-∞%";
      }
      try {
          // ROI is already calculated as percentage (e.g., 50 for 50%)
          // Intl expects decimal (0.5 for 50%)
          return new Intl.NumberFormat(undefined, {
            style: 'percent',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(value / 100);
      } catch(error) {
           console.error("Error formatting percentage:", error);
          return value.toFixed(2) + '%';
      }
    }

    export function formatRatio(value) {
        if (value == null || Number.isNaN(value)) {
            return "N/A";
        }
         if (!Number.isFinite(value)) {
             return value > 0 ? "∞" : "-∞";
         }
        try {
            // ROAS is a ratio
            return new Intl.NumberFormat(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(value);
        } catch(error) {
            console.error("Error formatting ratio:", error);
            return value.toFixed(2);
        }
    }

    export function formatDate(date, formatString = 'PP') {
      if (!date || !(date instanceof Date) || Number.isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      try {
        return formatDateFns(date, formatString);
      } catch (error) {
        console.error("Error formatting date:", error);
        return 'Invalid Date';
      }
    }
  