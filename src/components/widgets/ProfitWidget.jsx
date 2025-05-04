
    import React from 'react';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
    import { formatCurrency } from '@/lib/formatting';
    import { motion } from 'framer-motion';

    const widgetVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
    };

    function ProfitWidget({ totalProfitValue, currency = 'EUR', useMotion = false }) {
      const displayValue = formatCurrency(totalProfitValue, currency);
      const isPositive = totalProfitValue >= 0;
      const MotionCard = useMotion ? motion(Card) : Card;
      const motionProps = useMotion ? { variants: widgetVariants, initial: "hidden", animate: "visible", whileHover:{ scale: 1.03 } } : {};

      return (
        <MotionCard {...motionProps} className="overflow-hidden relative group">
           <div className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${isPositive ? 'from-green-500 to-emerald-500' : 'from-red-500 to-rose-500'} opacity-80 group-hover:opacity-100 transition-opacity`}></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-5"> {/* Adjusted padding */}
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Net Profit ({currency})</CardTitle>
            <DollarSign className={`h-5 w-5 ${isPositive ? 'text-green-500' : 'text-red-500'} opacity-70`} />
          </CardHeader>
          <CardContent className="pt-0"> {/* Adjusted padding */}
            <div className={`text-3xl font-bold ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} flex items-center`}>
              {displayValue}
              {isPositive ? (
                <TrendingUp className="ml-2 h-5 w-5 text-green-500 dark:text-green-400 opacity-80" />
              ) : (
                <TrendingDown className="ml-2 h-5 w-5 text-red-500 dark:text-red-400 opacity-80" />
              )}
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              Income - Ad Spend - Other Exp.
            </p>
          </CardContent>
        </MotionCard>
      );
    }

    export default ProfitWidget;
  