
    import React, { useMemo } from 'react';
             import EntriesTable from '@/components/EntriesTable';
             import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

             function LogTab({ entries, deleteEntry, updateEntry, isLoading, settings }) {
               // Sort entries by date descending before passing to the table
               const sortedEntries = useMemo(() => {
                 if (!entries) return [];
                 // Ensure date comparison works correctly (assuming dates are Date objects)
                 return [...entries].sort((a, b) => b.date.getTime() - a.date.getTime());
               }, [entries]);

               return (
                 <Card className="shadow-xl border border-border/40 bg-card/80 backdrop-blur-lg overflow-hidden">
                   <div className="bg-gradient-to-r from-cyan-500 to-blue-500 dark:from-cyan-700 dark:to-blue-700 p-1"></div>
                   <CardHeader>
                     <CardTitle className="text-2xl font-semibold">KDP Entries Log</CardTitle>
                     <CardDescription>Detailed list of your recorded KDP income and ad spend. Click values to edit.</CardDescription>
                   </CardHeader>
                   <CardContent>
                     <EntriesTable
                       entries={sortedEntries} // Pass sorted entries
                       deleteEntry={deleteEntry}
                       updateEntry={updateEntry}
                       isLoading={isLoading}
                       settings={settings}
                     />
                   </CardContent>
                 </Card>
               );
             }

             export default LogTab;
  