
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Euro, DollarSign, RefreshCw } from 'lucide-react';

function SettingsManager({ initialSettings, updateSettings, isLoading }) {
  const [rate, setRate] = useState('');

  useEffect(() => {
    // Initialize state when initialSettings are loaded or change
    if (initialSettings && initialSettings.eur_to_usd_rate) {
      setRate(String(initialSettings.eur_to_usd_rate));
    } else {
       setRate('1.1'); // Fallback default if initial is null/undefined
    }
  }, [initialSettings]); // Dependency array ensures this runs when initialSettings changes

  const handleSave = async () => {
    const numericRate = parseFloat(rate);
    if (isNaN(numericRate) || numericRate <= 0) {
      // Optionally show a toast error here
      console.error("Invalid rate entered");
      return;
    }
    await updateSettings({ eur_to_usd_rate: numericRate });
  };

  // Prevent saving if rate is invalid
   const isRateValid = () => {
      const numericRate = parseFloat(rate);
      return !isNaN(numericRate) && numericRate > 0;
   };

  return (
    <Card className="shadow-lg border border-border/40 bg-card/80 backdrop-blur-sm">
       <CardHeader>
         <CardTitle className="text-xl font-semibold">Application Settings</CardTitle>
         <CardDescription>Manage global settings like currency conversion rates.</CardDescription>
       </CardHeader>
       <CardContent className="space-y-4">
         <div className="space-y-2">
           <Label htmlFor="conversionRate">EUR to USD Conversion Rate</Label>
           <div className="flex items-center space-x-2">
             <Euro className="text-muted-foreground"/>
             <span>1 EUR =</span>
             <Input
               id="conversionRate"
               type="number"
               step="0.0001"
               value={rate}
               onChange={(e) => setRate(e.target.value)}
               placeholder="e.g., 1.10"
               className="w-32 bg-background/70"
             />
             <DollarSign className="text-muted-foreground"/>
             <span>USD</span>
           </div>
            {!isRateValid() && rate !== '' && (
               <p className="text-xs text-destructive">Please enter a valid positive number.</p>
            )}
           <p className="text-xs text-muted-foreground">
             This rate is used for calculating profits, ROI, and displaying charts/widgets in USD.
           </p>
         </div>
       </CardContent>
        <CardFooter className="bg-muted/30 dark:bg-muted/10 p-4 justify-end">
            <Button onClick={handleSave} disabled={isLoading || !isRateValid()} className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white shadow-md transition-all">
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Saving...' : 'Save Settings'}
            </Button>
        </CardFooter>
    </Card>
  );
}

export default SettingsManager;
  