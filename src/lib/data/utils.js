
    import { format, parse, startOfDay, endOfDay } from 'date-fns';

    export const parseDateStringUTC = (dateString) => {
      if (!dateString) return null;
      try {
        const [year, month, day] = dateString.split('-').map(Number);
        // Create date in UTC to avoid timezone shifts affecting the date itself
        return new Date(Date.UTC(year, month - 1, day));
      } catch (e) {
        console.error("Failed to parse date string:", dateString, e);
        return null;
      }
    };

    export const formatDateForSupabase = (date) => {
        if (!date) return null;
        // Ensure we format the date part only, regardless of time/timezone
        return format(startOfDay(date), 'yyyy-MM-dd');
    };

    export const parseMonthYearString = (monthYear) => {
        if (!monthYear) return null;
        // Parse as the first day of the month
        return parse(monthYear, 'yyyy-MM', new Date());
    };

    export const parseYearString = (year) => {
        if (!year) return null;
        // Parse as the first day of the year
        return parse(year, 'yyyy', new Date());
    };

    // Helper to get the very start of a day (00:00:00)
    export const getStartOfDay = (date) => {
        return startOfDay(date);
    };

    // Helper to get the very end of a day (23:59:59.999)
    export const getEndOfDay = (date) => {
        return endOfDay(date);
    };
  