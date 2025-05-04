
    import React from 'react';
    import { cn } from '@/lib/utils';
    import { motion } from 'framer-motion';

    const cardVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
    };

    const Card = React.forwardRef(({ className, useMotion = false, ...props }, ref) => {
      const Component = useMotion ? motion.div : 'div';
      const motionProps = useMotion ? {
        initial:"hidden",
        animate:"visible",
        variants: cardVariants,
        viewport: { once: true, amount: 0.2 } // Trigger animation when 20% visible
      } : {};

      return (
        <Component
          ref={ref}
          className={cn(
             // Enhanced base styles
             'rounded-xl border glassmorphic-card soft-shadow', // Use glassmorphic & soft-shadow from index.css
             // Removed default shadow-sm, border, bg-card as they are replaced
             'text-card-foreground',
            className
          )}
          {...motionProps}
          {...props}
        />
      );
    });
    Card.displayName = 'Card';

    const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
      <div
        ref={ref}
        className={cn('flex flex-col space-y-1.5 p-6', className)}
        {...props}
      />
    ));
    CardHeader.displayName = 'CardHeader';

    const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
      <h3
        ref={ref}
        className={cn(
          'text-lg font-semibold leading-none tracking-tight text-foreground/90', // Slightly adjusted size/color
          className
        )}
        {...props}
      />
    ));
    CardTitle.displayName = 'CardTitle';

    const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
      <p
        ref={ref}
        className={cn('text-sm text-muted-foreground', className)}
        {...props}
      />
    ));
    CardDescription.displayName = 'CardDescription';

    const CardContent = React.forwardRef(({ className, ...props }, ref) => (
      <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
    ));
    CardContent.displayName = 'CardContent';

    const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
      <div
        ref={ref}
        className={cn('flex items-center p-6 pt-0', className)}
        {...props}
      />
    ));
    CardFooter.displayName = 'CardFooter';

    export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
  