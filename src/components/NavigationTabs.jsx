
    import React from 'react';
    import { TabsList, TabsTrigger } from '@/components/ui/tabs';
    import { Settings as SettingsIcon, LayoutDashboard, PlusCircle, BookOpen, BarChart2, FileText, DollarSign } from 'lucide-react';
    import { motion } from 'framer-motion';

    const tabInfo = [
      { value: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { value: "add-entry", label: "Add KDP Entry", icon: PlusCircle },
      { value: "log", label: "KDP Log", icon: BookOpen },
      { value: "other-expenses", label: "Other Expenses", icon: DollarSign },
      { value: "accounts", label: "Accounts", icon: BarChart2 },
      { value: "export", label: "Export", icon: FileText },
      { value: "settings", label: "Settings", icon: SettingsIcon },
    ];

    function NavigationTabs({ activeTab, onTabChange }) {
      return (
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 md:grid-cols-7 mb-8 bg-card/70 backdrop-blur-md border rounded-xl p-1 h-auto shadow-sm soft-shadow">
          {tabInfo.map(tab => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              onClick={() => onTabChange(tab.value)} // Ensure parent knows about the change
              className="relative flex-col sm:flex-row h-auto py-2.5 rounded-lg data-[state=active]:text-primary-foreground data-[state=inactive]:text-muted-foreground transition-colors duration-200 ease-in-out hover:text-primary hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {activeTab === tab.value && (
                <motion.div
                  layoutId="active-tab-indicator"
                  className="absolute inset-0 bg-gradient-to-r from-[var(--gradient-primary-start)] to-[var(--gradient-primary-end)] rounded-lg z-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <tab.icon className="h-5 w-5 mb-1 sm:mb-0 sm:mr-2 z-10 transition-transform duration-200" />
              <span className="text-xs sm:text-sm font-medium z-10">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      );
    }

    export default NavigationTabs;
  