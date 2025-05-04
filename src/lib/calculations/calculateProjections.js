
    import { getDaysInMonth, getDaysInYear, isValid } from 'date-fns';

    // Calculates monthly and yearly projections based on average daily profit.
    export const calculateProjections = (avgDailyProfit) => {
       if (avgDailyProfit == null || !Number.isFinite(avgDailyProfit) || avgDailyProfit === 0) {
         return { monthlyEstimate: 0, yearlyEstimate: 0 };
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
  