
    import React from 'react';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
    import { Wallet, Info } from 'lucide-react';
    import { formatCurrency } from '@/lib/formatting';
    import { motion } from 'framer-motion';

    const widgetVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
    };

    function UnpaidRoyaltiesWidget({ unpaidRoyaltiesValue, currency = 'EUR', useMotion = false }) {
      const displayValue = formatCurrency(unpaidRoyaltiesValue, currency);
      const MotionCard = useMotion ? motion(Card) : Card;
      const motionProps = useMotion ? { variants: widgetVariants, initial: "hidden", animate: "visible", whileHover:{ scale: 1.03 } } : {};

      return (
        <MotionCard {...motionProps} className="overflow-hidden relative group">
           <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-teal-500 to-emerald-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-5"> {/* Adjusted padding */}
             <div className="flex items-center space-x-1.5"> {/* Increased spacing */}
                <CardTitle className="text-sm font-medium text-muted-foreground">Royalties Yet to Be Paid ({currency})</CardTitle>
                 <TooltipProvider delayDuration={100}>
                   <Tooltip>
                     <TooltipTrigger asChild>
                       <Info className="h-3.5 w-3.5 text-muted-foreground/70 hover:text-muted-foreground cursor-help transition-colors" />
                     </TooltipTrigger>
                     <TooltipContent>
                       <p className="max-w-xs">Estimated total KDP income from months not yet paid out by Amazon (approx. 60-day delay).</p>
                     </TooltipContent>
                   </Tooltip>
                 </TooltipProvider>
             </div>
            <Wallet className="h-5 w-5 text-teal-500 opacity-70" />
          </CardHeader>
          <CardContent className="pt-0"> {/* Adjusted padding */}
            <div className={`text-3xl font-bold ${displayValue === 'N/A' ? 'text-muted-foreground' : 'text-teal-600 dark:text-teal-400'}`}>
              {displayValue}
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              Based on all KDP entries.
            </p>
          </CardContent>
        </MotionCard>
      );
    }

    export default UnpaidRoyaltiesWidget;
  