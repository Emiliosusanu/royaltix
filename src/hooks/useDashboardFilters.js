
      import { useState, useMemo } from 'react';
          import { startOfMonth, endOfMonth, startOfYear, endOfYear, subDays, startOfDay, endOfDay, format, isValid, subMonths, isEqual } from 'date-fns';

          const useDashboardFilters = (entries, otherExpenses) => {
              const [filters, setFilters] = useState(() => {
                  // Initialize with 'this_month' as default
                  const now = new Date();
                  return {
                    selectedPeriodKey: 'this_month',
                    startDate: startOfMonth(now),
                    endDate: endOfMonth(now),
                    accountIds: [], // Empty array means all accounts
                  };
              });

              // This function receives the desired state from DashboardFilters component
              const handleFilterChange = (newFilterSettings) => {
                  // Simply update the state. The memoized calculations will use this.
                  setFilters(newFilterSettings);
              };

              // Date range calculation logic remains the same, based on filters state
              const dateRange = useMemo(() => {
                  const { selectedPeriodKey, startDate, endDate } = filters;
                  const now = new Date();

                   // Use startOfDay and endOfDay for comparisons and filtering
                   const normStartDate = startDate ? startOfDay(startDate) : null;
                   const normEndDate = endDate ? endOfDay(endDate) : null;

                  if (selectedPeriodKey === 'custom' && isValid(normStartDate) && isValid(normEndDate) && normStartDate <= normEndDate) {
                      return { start: normStartDate, end: normEndDate };
                  }
                  if (selectedPeriodKey === 'all') {
                      return { start: null, end: null }; // Indicate all time
                  }
                  if (selectedPeriodKey === 'today') {
                      return { start: startOfDay(now), end: endOfDay(now) };
                  }
                  if (selectedPeriodKey === 'yesterday') {
                      const yesterday = subDays(now, 1);
                      return { start: startOfDay(yesterday), end: endOfDay(yesterday) };
                  }
                  if (selectedPeriodKey === 'this_month') {
                       return { start: startOfMonth(now), end: endOfMonth(now) };
                  }
                   if (selectedPeriodKey === 'last_month') {
                        const lastMonthDate = subMonths(startOfMonth(now), 1);
                        return { start: startOfMonth(lastMonthDate), end: endOfMonth(lastMonthDate) };
                   }
                   // Added missing presets from dropdown options
                    if (selectedPeriodKey === '2_months_ago') {
                        const twoMonthsAgo = subMonths(now, 2);
                        return { start: startOfMonth(twoMonthsAgo), end: endOfMonth(twoMonthsAgo) };
                    }
                     if (selectedPeriodKey === '3_months_ago') {
                        const threeMonthsAgo = subMonths(now, 3);
                        return { start: startOfMonth(threeMonthsAgo), end: endOfMonth(threeMonthsAgo) };
                    }
                   if (selectedPeriodKey === 'this_year') {
                      return { start: startOfYear(now), end: endOfYear(now) };
                  }
                   // Handle specific year/month selections if implemented later
                  if (/^\d{4}$/.test(selectedPeriodKey)) {
                      const yearDate = new Date(parseInt(selectedPeriodKey, 10), 0, 1);
                      return { start: startOfYear(yearDate), end: endOfYear(yearDate) };
                  }
                  if (/^\d{4}-\d{2}$/.test(selectedPeriodKey)) {
                      const monthDate = new Date(selectedPeriodKey + '-01T00:00:00');
                      return { start: startOfMonth(monthDate), end: endOfMonth(monthDate) };
                  }

                  // Fallback to current month if key is unrecognized or dates are invalid
                  console.warn(`Unrecognized period key or invalid dates for key: ${selectedPeriodKey}. Defaulting to This Month.`);
                  return { start: startOfMonth(now), end: endOfMonth(now) };
              }, [filters.selectedPeriodKey, filters.startDate, filters.endDate]);


               const filterData = (data, accountSpecific = false) => {
                   if (!data) return [];
                   return data.filter(item => {
                     const itemDate = item.date; // Assumes item.date is a Date object
                     if (!itemDate || !isValid(itemDate)) return false;

                     // Date range filter (inclusive) using calculated dateRange
                     const isWithinDateRange = dateRange.start && dateRange.end
                       ? itemDate >= dateRange.start && itemDate <= dateRange.end
                       : true; // Include if 'all time' (null range)

                     if (!isWithinDateRange) return false;

                     // Account filter (only if applicable and requested)
                     if (accountSpecific && filters.accountIds.length > 0 && !filters.accountIds.includes(item.account_id)) {
                       return false;
                     }

                     return true;
                   });
                 };

              // Recalculate filtered data whenever source data or filter criteria change
              const filteredEntries = useMemo(() => filterData(entries, true), [entries, dateRange, filters.accountIds]);
              const filteredOtherExpenses = useMemo(() => filterData(otherExpenses, false), [otherExpenses, dateRange]);


              return {
                  filters, // The current filter state (includes dates, accounts, periodKey)
                  dateRange, // The calculated date range object { start, end }
                  handleFilterChange, // Function to update the filter state
                  filteredEntries,
                  filteredOtherExpenses,
              };
          };

          export default useDashboardFilters;
   