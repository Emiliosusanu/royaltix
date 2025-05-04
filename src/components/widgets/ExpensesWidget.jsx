
    import React from 'react';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Receipt } from 'lucide-react';
    import { formatCurrency } from '@/lib/formatting';
    import { motion } from 'framer-motion';

    const widgetVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
    };

    function ExpensesWidget({ totalOtherExpensesValue, currency = 'EUR', useMotion = false }) {
      const displayValue = formatCurrency(totalOtherExpensesValue, currency);
      const MotionCard = useMotion ? motion(Card) : Card;
      const motionProps = useMotion ? { variants: widgetVariants, initial: "hidden", animate: "visible", whileHover:{ scale: 1.03 } } : {};

      return (
        <MotionCard {...motionProps} className="overflow-hidden relative group">
          <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-orange-500 to-amber-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-5"> {/* Adjusted padding */}
            <CardTitle className="text-sm font-medium text-muted-foreground">Other Expenses ({currency})</CardTitle>
            <Receipt className="h-5 w-5 text-orange-500 opacity-70" />
          </CardHeader>
          <CardContent className="pt-0"> {/* Adjusted padding */}
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{displayValue}</div>
            <p className="text-xs text-muted-foreground pt-1">
              Total non-ad related expenses.
            </p>
          </CardContent>
        </MotionCard>
      );
    }

    export default ExpensesWidget;
  