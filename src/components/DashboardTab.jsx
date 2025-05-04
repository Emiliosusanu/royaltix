
    import React from 'react';
    import DashboardWidgets from '@/components/DashboardWidgets';
    import MonthlyPerformanceEUR from '@/components/MonthlyPerformanceEUR';
    import DailyPerformance from '@/components/DailyPerformance';
    import DailyChartEUR from '@/components/DailyChartEUR';
    import AdditionalWidgets from '@/components/AdditionalWidgets';
    import MonthlyChart from '@/components/MonthlyChart';
    import DashboardFilters from '@/components/DashboardFilters';
    import { motion } from 'framer-motion';

    const sectionVariants = {
       initial: { opacity: 0, y: 20 },
       animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
     };

    function DashboardTab({
        metrics,
        additionalWidgetsData,
        entries, // Unfiltered data for certain charts/widgets
        otherExpenses, // Unfiltered data
        settings,
        loading,
        filters, // Receive filters state
        onFilterChange, // Receive filter change handler
        accounts, // Receive accounts for filter options
    }) {

      return (
        <>
          {/* Filters remain at the top */}
          <DashboardFilters
            accounts={accounts}
            onFilterChange={onFilterChange}
            initialFilters={filters} // Use the filters from props
          />

           {/* Apply motion to each section */}
           <motion.div variants={sectionVariants} initial="initial" animate="animate" viewport={{ once: true, amount: 0.1 }}>
              <DashboardWidgets entries={entries} otherExpenses={otherExpenses} settings={settings} metrics={metrics} />
           </motion.div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <motion.div variants={sectionVariants} initial="initial" animate="animate" viewport={{ once: true, amount: 0.1 }}>
                 <MonthlyPerformanceEUR entries={entries} settings={settings} />
              </motion.div>
              <motion.div variants={sectionVariants} initial="initial" animate="animate" viewport={{ once: true, amount: 0.1 }}>
                  <DailyPerformance entries={entries} settings={settings} />
              </motion.div>
           </div>

           <motion.div variants={sectionVariants} initial="initial" animate="animate" viewport={{ once: true, amount: 0.1 }}>
             <DailyChartEUR entries={entries} settings={settings} />
           </motion.div>

           <motion.div variants={sectionVariants} initial="initial" animate="animate" viewport={{ once: true, amount: 0.1 }}>
             <AdditionalWidgets entries={entries} settings={settings} />
           </motion.div>

           <motion.div variants={sectionVariants} initial="initial" animate="animate" viewport={{ once: true, amount: 0.1 }}>
             <MonthlyChart entries={entries} settings={settings} />
           </motion.div>
        </>
      );
    }

    export default DashboardTab;
  