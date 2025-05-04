
    import React from 'react';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Target } from 'lucide-react';
    import { formatPercentage } from '@/lib/formatting';
    import { motion } from 'framer-motion';

    const widgetVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
    };

    function ROIWidget({ roi, currency = 'EUR', useMotion = false }) {
      const displayValue = formatPercentage(roi);
      const MotionCard = useMotion ? motion(Card) : Card;
      const motionProps = useMotion ? { variants: widgetVariants, initial: "hidden", animate: "visible", whileHover:{ scale: 1.03 } } : {};

      return (
        <MotionCard {...motionProps} className="overflow-hidden relative group">
          <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-purple-500 to-violet-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-5"> {/* Adjusted padding */}
            <CardTitle className="text-sm font-medium text-muted-foreground">Return on Investment (ROI)</CardTitle>
            <Target className="h-5 w-5 text-purple-500 opacity-70" />
          </CardHeader>
          <CardContent className="pt-0"> {/* Adjusted padding */}
            <div className={`text-3xl font-bold ${displayValue === 'N/A' ? 'text-muted-foreground' : 'text-purple-600 dark:text-purple-400'}`}>
              {displayValue}
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              Net Profit / Total Costs ({currency})
            </p>
          </CardContent>
        </MotionCard>
      );
    }

    export default ROIWidget;
  