
    import React from 'react';
    import { motion } from 'framer-motion';
    import {
      ProfitWidget,
      UnpaidRoyaltiesWidget,
      ExpensesWidget,
      ROASWidget,
      ROIWidget,
      WarningWidget
    } from '@/components/widgets';
    import { AlertTriangle } from 'lucide-react';

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.08,
        },
      },
    };

    function MainDashboardWidgets({ metrics }) {

      const {
        totalNetProfitEUR,
        totalOtherExpensesEUR,
        roasEUR,
        totalIncomeEUR,
        totalSpendEUR,
        roiEUR,
        hasMixedCurrenciesInCalc,
        unpaidRoyaltiesEUR,
      } = metrics || {}; // Use default empty object if metrics is null/undefined

      // Check if metrics are available before rendering widgets that depend on them
      const widgetsReady = metrics && !isNaN(totalNetProfitEUR);

      return (
        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8" // Keep original layout structure
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Always show warning if applicable */}
          {hasMixedCurrenciesInCalc && (
             <WarningWidget
               title="Mixed Currencies Detected"
               message="Calculations involving entries with unsupported currencies might be inaccurate. Ensure all entries use EUR or USD."
               icon={AlertTriangle}
               useMotion={true}
             />
           )}

          {/* Conditionally render main widgets */}
          {widgetsReady && (
            <>
              <UnpaidRoyaltiesWidget unpaidRoyaltiesValue={unpaidRoyaltiesEUR} currency="EUR" useMotion={true}/>
              <ProfitWidget totalProfitValue={totalNetProfitEUR} currency="EUR" useMotion={true}/>
              <ExpensesWidget totalOtherExpensesValue={totalOtherExpensesEUR} currency="EUR" useMotion={true}/>
              <ROASWidget roasEUR={roasEUR} totalIncomeEUR={totalIncomeEUR} totalSpendEUR={totalSpendEUR} useMotion={true}/>
              <ROIWidget roi={roiEUR} currency="EUR" useMotion={true}/>
            </>
          )}

          {/* Could add placeholders here if !widgetsReady */}

        </motion.div>
      );
    }

    export default MainDashboardWidgets;
  