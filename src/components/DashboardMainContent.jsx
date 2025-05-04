
    import React from 'react';
    import { Tabs } from '@/components/ui/tabs'; // Import the main Tabs component
    import NavigationTabs from '@/components/NavigationTabs';
    import DashboardTabContent from '@/components/DashboardTabContent';
    import { Loader2 } from 'lucide-react';
    import { AnimatePresence } from 'framer-motion';
    import {
      AlertDialog as Alert,
      AlertDialogDescription as AlertDescription,
      AlertDialogTitle as AlertTitle
    } from "@/components/ui/alert-dialog";
    import { AlertTriangle } from "lucide-react";

    function DashboardMainContent({
      isLoading,
      dataError,
      activeTab,
      setActiveTab,
      contentProps
    }) {

      if (isLoading) {
        return (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        );
      }

      if (dataError) {
        return (
          <Alert variant="destructive" className="my-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Loading Data</AlertTitle>
            <AlertDescription>{dataError}</AlertDescription>
          </Alert>
        );
      }

      return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Navigation Tabs */}
          <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Tab Content Area */}
          <div className="mt-6">
            <AnimatePresence mode="wait">
              {/* Pass activeTab and other props to content */}
              <DashboardTabContent key={activeTab} activeTab={activeTab} {...contentProps} />
            </AnimatePresence>
          </div>
        </Tabs>
      );
    }

    export default DashboardMainContent;
  