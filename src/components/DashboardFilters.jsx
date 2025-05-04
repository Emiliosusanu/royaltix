
    import React, { useState, useEffect, useCallback, useMemo } from 'react';
    import { DatePicker } from '@/components/ui/date-picker';
    import { MultiSelect } from '@/components/ui/multi-select';
    import { Button } from '@/components/ui/button';
    import { Label } from '@/components/ui/label';
    import { Card, CardContent } from '@/components/ui/card';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { Filter, X, CalendarRange } from 'lucide-react';
    import { startOfMonth, endOfMonth, subMonths, format, startOfYear, endOfYear, isEqual, startOfDay, endOfDay } from 'date-fns';

    const generateMonthOptions = () => {
      const options = [];
      const now = new Date();
      options.push({ value: 'this_month', label: 'This Month', startDate: startOfMonth(now), endDate: endOfMonth(now) });
      const lastMonth = subMonths(now, 1);
      options.push({ value: 'last_month', label: 'Last Month', startDate: startOfMonth(lastMonth), endDate: endOfMonth(lastMonth) });
      const twoMonthsAgo = subMonths(now, 2);
      options.push({ value: '2_months_ago', label: format(twoMonthsAgo, 'MMMM yyyy'), startDate: startOfMonth(twoMonthsAgo), endDate: endOfMonth(twoMonthsAgo) });
       const threeMonthsAgo = subMonths(now, 3);
      options.push({ value: '3_months_ago', label: format(threeMonthsAgo, 'MMMM yyyy'), startDate: startOfMonth(threeMonthsAgo), endDate: endOfMonth(threeMonthsAgo) });
      options.push({ value: 'this_year', label: 'This Year', startDate: startOfYear(now), endDate: endOfYear(now) });
      options.push({ value: 'custom', label: 'Custom Range' });
      return options;
    };

    const findMonthOptionValue = (startDate, endDate, options) => {
       const normStart = startDate ? startOfDay(startDate) : null;
       const normEnd = endDate ? endOfDay(endDate) : null;

       for (const option of options) {
         const normPresetStart = option.startDate ? startOfDay(option.startDate) : null;
         const normPresetEnd = option.endDate ? endOfDay(option.endDate) : null;

         if (normPresetStart && normPresetEnd && normStart && normEnd &&
             isEqual(normStart, normPresetStart) &&
             isEqual(normEnd, normPresetEnd)) {
           return option.value;
         }
       }
       if (normStart && normEnd) {
           return 'custom';
       }
       return 'this_month';
     };


    function DashboardFilters({ accounts, onFilterChange, initialFilters }) {
      const monthOptions = useMemo(generateMonthOptions, []);

      // Local state reflects the UI controls directly
      const [selectedPresetKey, setSelectedPresetKey] = useState(() => findMonthOptionValue(initialFilters.startDate, initialFilters.endDate, monthOptions));
      const [customStartDate, setCustomStartDate] = useState(initialFilters.startDate);
      const [customEndDate, setCustomEndDate] = useState(initialFilters.endDate);
      const [selectedAccountIds, setSelectedAccountIds] = useState(initialFilters.accountIds);

      const accountOptions = useMemo(() => accounts.map(acc => ({
        value: acc.id,
        label: acc.name,
      })), [accounts]);

      // Update local state when the preset dropdown changes
      const handlePresetChange = useCallback((value) => {
        setSelectedPresetKey(value);
        // If a preset is chosen (not custom), update the custom dates too for visual consistency,
        // though they will be disabled.
        if (value !== 'custom') {
          const option = monthOptions.find(o => o.value === value);
          if (option?.startDate && option?.endDate) {
            setCustomStartDate(option.startDate);
            setCustomEndDate(option.endDate);
          }
        }
      }, [monthOptions]);

      // Apply button handler: determines final dates and calls onFilterChange
      const handleApplyFilters = useCallback(() => {
        let finalStartDate = customStartDate;
        let finalEndDate = customEndDate;
        let finalPeriodKey = selectedPresetKey;

        // If a preset is selected (not 'custom'), use its dates
        if (selectedPresetKey !== 'custom') {
          const option = monthOptions.find(o => o.value === selectedPresetKey);
          if (option?.startDate && option?.endDate) {
            finalStartDate = option.startDate;
            finalEndDate = option.endDate;
          } else {
             console.warn("Selected preset resulted in invalid dates:", selectedPresetKey);
             return; // Don't apply if preset is broken
          }
        } else {
           // Ensure custom dates are valid if 'custom' is selected
           if (!customStartDate || !customEndDate || customStartDate > customEndDate) {
               console.warn("Custom date range is incomplete or invalid.");
               // Optionally show user feedback (e.g., toast)
               return; // Don't apply invalid custom range
           }
           finalPeriodKey = 'custom'; // Ensure key is 'custom' if using date pickers
        }


        onFilterChange({
          startDate: finalStartDate,
          endDate: finalEndDate,
          accountIds: selectedAccountIds,
          selectedPeriodKey: finalPeriodKey // Pass the key used to determine dates
        });
      }, [customStartDate, customEndDate, selectedAccountIds, selectedPresetKey, monthOptions, onFilterChange]);

      // Reset button handler
      const handleResetFilters = useCallback(() => {
        const defaultOption = monthOptions.find(o => o.value === 'this_month');
        const defaultStartDate = defaultOption.startDate;
        const defaultEndDate = defaultOption.endDate;
        const defaultAccountIds = [];
        const defaultPresetKey = 'this_month';

        // Reset local state
        setSelectedPresetKey(defaultPresetKey);
        setCustomStartDate(defaultStartDate);
        setCustomEndDate(defaultEndDate);
        setSelectedAccountIds(defaultAccountIds);

        // Call parent handler with defaults
        onFilterChange({
          startDate: defaultStartDate,
          endDate: defaultEndDate,
          accountIds: defaultAccountIds,
          selectedPeriodKey: defaultPresetKey
        });
      }, [monthOptions, onFilterChange]);

      // Effect to potentially sync if external changes occur (optional, depends on app needs)
      // This might be needed if filters can be changed programmatically elsewhere
      useEffect(() => {
          const newPresetKey = findMonthOptionValue(initialFilters.startDate, initialFilters.endDate, monthOptions);
          setSelectedPresetKey(newPresetKey);
          setCustomStartDate(initialFilters.startDate);
          setCustomEndDate(initialFilters.endDate);
          setSelectedAccountIds(initialFilters.accountIds);
      }, [initialFilters.startDate, initialFilters.endDate, initialFilters.accountIds, monthOptions]);


      const isCustomRange = selectedPresetKey === 'custom';

      return (
        <Card className="mb-8 shadow-md border border-border/40 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-4 flex flex-col lg:flex-row lg:items-end gap-4">

             <div className="space-y-1 flex-grow lg:flex-grow-0 min-w-[180px]">
               <Label htmlFor="month-select">Period</Label>
               <Select value={selectedPresetKey} onValueChange={handlePresetChange}>
                 <SelectTrigger id="month-select" className="bg-background/70">
                   <CalendarRange className="mr-2 h-4 w-4 opacity-70" />
                   <SelectValue placeholder="Select period..." />
                 </SelectTrigger>
                 <SelectContent>
                   {monthOptions.map(option => (
                     <SelectItem key={option.value} value={option.value}>
                       {option.label}
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>

            <div className={`flex flex-col sm:flex-row gap-4 flex-grow md:flex-grow-0`}>
              <div className="space-y-1 flex-1">
                <Label htmlFor="start-date">Start Date</Label>
                <DatePicker
                  id="start-date"
                  date={customStartDate}
                  setDate={setCustomStartDate} // Update local state for custom start date
                  disabled={!isCustomRange} // Enable only for custom range
                  className="bg-background/70"
                />
              </div>
              <div className="space-y-1 flex-1">
                <Label htmlFor="end-date">End Date</Label>
                <DatePicker
                  id="end-date"
                  date={customEndDate}
                  setDate={setCustomEndDate} // Update local state for custom end date
                  disabled={!isCustomRange} // Enable only for custom range
                  className="bg-background/70"
                />
              </div>
            </div>

            <div className="space-y-1 flex-grow min-w-[200px]">
              <Label htmlFor="account-select">Accounts</Label>
              <MultiSelect
                id="account-select"
                options={accountOptions}
                selected={selectedAccountIds}
                onChange={setSelectedAccountIds} // Update local state for accounts
                placeholder="All Accounts"
                className="bg-background/70"
              />
            </div>

            <div className="flex gap-2 pt-3 lg:pt-0">
              <Button onClick={handleApplyFilters} className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md transition-all duration-300 ease-in-out transform hover:scale-105">
                <Filter className="mr-2 h-4 w-4" /> Apply Filters
              </Button>
              <Button variant="outline" onClick={handleResetFilters} className="transition-colors hover:bg-muted/20">
                <X className="mr-2 h-4 w-4" /> Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    export default DashboardFilters;
  