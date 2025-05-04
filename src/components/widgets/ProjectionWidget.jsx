
    import React from 'react';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
    import { Info } from 'lucide-react';
    import { format } from 'date-fns';
    import { formatNumber, currencySymbols } from '@/lib/formatting';
    import { motion } from 'framer-motion';
    import ConfidenceBadge from '@/components/widgets/ConfidenceBadge'; // Import the new badge

    const widgetVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
    };

    function ProjectionWidget({
      monthlyEstimateValue,
      yearlyEstimateValue,
      currency = 'EUR',
      periodLabel,
      // tooltipText prop is removed, text generated dynamically below
      icon: Icon,
      daysUsedForProjection = 0, // Add prop to receive days used
      useMotion = false,
      projectionType = 'Gross', // Added to differentiate tooltips: 'Gross' or 'Net'
    }) {
      const isMonthly = monthlyEstimateValue !== 0 && yearlyEstimateValue === 0;
      const value = isMonthly ? monthlyEstimateValue : yearlyEstimateValue;
      const displayValue = formatNumber(value);
      const currencySymbol = currencySymbols[currency] || currency;

      const today = new Date();
      const projectionPeriod = isMonthly ? `for ${format(today, 'MMMM yyyy')}` : `for ${format(today, 'yyyy')}`;

      const MotionCard = useMotion ? motion(Card) : Card;
      const motionProps = useMotion ? { variants: widgetVariants, initial: "hidden", animate: "visible", whileHover:{ scale: 1.03 } } : {};

      // Generate dynamic tooltip text
      const profitTypeDesc = projectionType === 'Net'
        ? 'KDP Income - Ad Spend - Other Expenses (Net Profit)'
        : 'KDP Income - Ad Spend (Gross Profit)';
      const daysText = daysUsedForProjection > 0 ? `based on the average daily profit from the last ${daysUsedForProjection} ${daysUsedForProjection === 1 ? 'day' : 'days'} of data` : 'using available data';
      const dynamicTooltipText = `Projection ${daysText}. Calculation: ${profitTypeDesc}.`;


      return (
        <MotionCard {...motionProps} className="overflow-hidden relative group">
           <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-indigo-500 to-sky-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 pt-5"> {/* Use items-start */}
             <div className="flex-grow"> {/* Allow title area to take space */}
                 <div className="flex items-center space-x-1.5">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{periodLabel}</CardTitle>
                     <TooltipProvider delayDuration={100}>
                       <Tooltip>
                         <TooltipTrigger asChild>
                           <Info className="h-3.5 w-3.5 text-muted-foreground/70 hover:text-muted-foreground cursor-help transition-colors" />
                         </TooltipTrigger>
                         <TooltipContent>
                           <p className="max-w-xs">{dynamicTooltipText}</p> {/* Use dynamic text */}
                         </TooltipContent>
                       </Tooltip>
                     </TooltipProvider>
                 </div>
             </div>
            {Icon && <Icon className="h-5 w-5 text-indigo-500 opacity-70 flex-shrink-0 ml-2" />} {/* Prevent icon shrinking */}
          </CardHeader>
          <CardContent className="pt-0 pb-3"> {/* Adjusted padding */}
            <div className={`text-3xl font-bold ${displayValue === 'N/A' ? 'text-muted-foreground' : 'text-indigo-600 dark:text-indigo-400'}`}>
              {currencySymbol}{displayValue}
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
               <span>Projection {projectionPeriod}</span>
               {daysUsedForProjection > 0 && (
                 <div className="flex items-center space-x-1">
                    <span className="italic">(Based on {daysUsedForProjection} {daysUsedForProjection === 1 ? 'day' : 'days'})</span>
                    <ConfidenceBadge daysUsed={daysUsedForProjection} />
                 </div>
               )}
            </div>
          </CardContent>
        </MotionCard>
      );
    }

    export default ProjectionWidget;
  