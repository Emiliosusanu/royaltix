
    import React from 'react';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { AlertTriangle } from 'lucide-react'; // Default icon

    function WarningWidget({ title = "Warning", message, icon: Icon = AlertTriangle, useMotion = false }) {
      return (
        <Card useMotion={useMotion} className="border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-900/20 dark:border-yellow-600/60 col-span-full md:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-300">{title}</CardTitle>
            <Icon className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-yellow-600 dark:text-yellow-400">
              {message || "An issue requires attention."}
            </p>
          </CardContent>
        </Card>
      );
    }

    export default WarningWidget;
  