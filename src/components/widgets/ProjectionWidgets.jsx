
    import React from 'react';
    import { motion } from 'framer-motion';
    import { ProjectionWidget } from '@/components/widgets';
    import { CalendarDays, TrendingUp } from 'lucide-react';

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.08,
          delayChildren: 0.2, // Delay slightly after main widgets
        },
      },
    };


    function ProjectionWidgets({ metrics }) {
       const {
        monthlyEstimateGrossEUR,
        yearlyEstimateGrossEUR,
        yearlyEstimateNetEUR,
      } = metrics || {}; // Use default empty object

       // Check if metrics are available
       const projectionsReady = metrics && !isNaN(monthlyEstimateGrossEUR);

      return (
        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8" // Adjust grid columns for 3 items
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
           {projectionsReady && (
               <>
                  <ProjectionWidget
                      monthlyEstimateValue={monthlyEstimateGrossEUR}
                      yearlyEstimateValue={0}
                      currency="EUR"
                      periodLabel="Est. Monthly Profit (EUR)"
                      tooltipText="Projection based on KDP Income - Ad Spend (Gross Profit) for the current month."
                      icon={CalendarDays}
                      useMotion={true}
                  />
                   <ProjectionWidget
                      monthlyEstimateValue={0}
                      yearlyEstimateValue={yearlyEstimateGrossEUR}
                      currency="EUR"
                      periodLabel="Est. Yearly Profit (EUR)"
                      tooltipText="Projection based on KDP Income - Ad Spend (Gross Profit) for the current year."
                      icon={TrendingUp}
                      useMotion={true}
                  />
                   <ProjectionWidget
                      monthlyEstimateValue={0}
                      yearlyEstimateValue={yearlyEstimateNetEUR}
                      currency="EUR"
                      periodLabel="Est. Yearly Net Profit (EUR)"
                      tooltipText="Projection based on KDP Income - Ad Spend - Other Expenses (Net Profit) for the current year."
                      icon={TrendingUp}
                      useMotion={true}
                  />
               </>
           )}
            {/* Could add placeholders here if !projectionsReady */}
        </motion.div>
      );
    }

    export default ProjectionWidgets;
  