
    import React from 'react';
    import { motion } from 'framer-motion';
    import { widgetConfig } from '@/config/widgetConfig'; // Import the configuration
    import WarningWidget from '@/components/widgets/WarningWidget'; // Keep WarningWidget import
    import WidgetRenderer from '@/components/widgets/WidgetRenderer'; // Import the new renderer

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.08,
          delayChildren: 0.1,
        },
      },
    };

    function DashboardWidgets({ metrics }) {
      if (!metrics) {
        return (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 mb-8">
            {[...Array(8)].map((_, i) => ( // Assuming 8 widgets max for skeleton
              <div key={i} className="h-32 rounded-xl bg-card/50 animate-pulse"></div>
            ))}
          </div>
        );
      }

      // Separate handling for the warning widget
      const warningWidgetInfo = widgetConfig.find(c => c.id === 'warningMixedCurrencies');
      const shouldShowWarning = warningWidgetInfo && warningWidgetInfo.condition(metrics);

      return (
        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Render Warning Widget First if needed */}
          {shouldShowWarning && (
            <WarningWidget
              key={warningWidgetInfo.id}
              {...warningWidgetInfo.props(metrics)} // Spread props from config
            />
          )}

          {/* Render other widgets using the WidgetRenderer component */}
          <WidgetRenderer metrics={metrics} />

        </motion.div>
      );
    }

    export default DashboardWidgets;
  