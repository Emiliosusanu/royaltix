
    import React from 'react';
    import { Badge } from '@/components/ui/badge';
    import { cn } from '@/lib/utils';

    const getConfidence = (days) => {
      if (days >= 30) return { level: 'High', variant: 'default' }; // Use 'default' for green/primary
      if (days >= 7) return { level: 'Medium', variant: 'secondary' }; // Use 'secondary' for yellow/gray
      return { level: 'Low', variant: 'destructive' }; // Use 'destructive' for red
    };

    function ConfidenceBadge({ daysUsed }) {
      if (daysUsed <= 0) {
        return null; // Don't show badge if no days used
      }

      const { level, variant } = getConfidence(daysUsed);

      return (
        <Badge variant={variant} className={cn(
           "text-xs px-1.5 py-0.5 font-normal", // Smaller padding and font
           // Add specific color adjustments if default variants aren't quite right
           variant === 'default' && 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-700',
           variant === 'secondary' && 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700',
           variant === 'destructive' && 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-700'
           )}>
          {level}
        </Badge>
      );
    }

    export default ConfidenceBadge;
  