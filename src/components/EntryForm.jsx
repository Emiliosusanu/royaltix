
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { DollarSign, Euro, CalendarPlus as CalendarIcon, BookUser, Info } from 'lucide-react';
import { format } from 'date-fns'; // Import format

const PLACEHOLDER_VALUE = "placeholder-disabled-value";

function EntryForm({ accounts, addEntry, isLoading }) {
  const [date, setDate] = useState(new Date());
  const [accountId, setAccountId] = useState('');
  const [income, setIncome] = useState('');
  const [incomeCurrency, setIncomeCurrency] = useState('EUR');
  const [adSpend, setAdSpend] = useState('');
  const [adSpendCurrency, setAdSpendCurrency] = useState('USD');
  const { toast } = useToast();

  // Reset account selection if the selected account is removed (edge case)
  useEffect(() => {
    if (accountId && !accounts.find(acc => acc.id === accountId)) {
      setAccountId('');
    }
  }, [accounts, accountId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !accountId || income === '' || adSpend === '') {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    // Format date as YYYY-MM-DD string to avoid timezone issues
    const formattedDate = format(date, 'yyyy-MM-dd');

    const entryData = {
      date: formattedDate, // Use the formatted date string
      account_id: accountId,
      income: parseFloat(income),
      income_currency: incomeCurrency,
      ad_spend: parseFloat(adSpend),
      ad_spend_currency: adSpendCurrency,
    };

    const result = await addEntry(entryData);

    if (result?.success) {
      // Reset form partially
      setIncome('');
      setAdSpend('');
      // Optionally reset date and account, or keep them for faster subsequent entries
      // setDate(new Date());
      // setAccountId('');
    }
  };

  const noAccounts = accounts.length === 0;

  return (
    <Card className="shadow-xl border border-border/40 bg-card/80 backdrop-blur-lg overflow-hidden">
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 dark:from-cyan-700 dark:to-blue-700 p-1"></div>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Add New Entry</CardTitle>
        <CardDescription>Record your daily KDP income and ad spend.</CardDescription>
      </CardHeader>
      {noAccounts ? (
         <CardContent className="text-center text-muted-foreground py-10">
            <Info className="mx-auto h-8 w-8 mb-2"/>
            <p>Please add at least one account in the 'Accounts' tab before adding entries.</p>
         </CardContent>
      ) : (
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date"><CalendarIcon className="inline-block mr-1 h-4 w-4" /> Date</Label>
                <DatePicker date={date} setDate={setDate} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account"><BookUser className="inline-block mr-1 h-4 w-4" /> Account</Label>
                <Select value={accountId} onValueChange={setAccountId} required>
                  <SelectTrigger id="account" className="bg-background/70">
                    <SelectValue placeholder="Select account..." />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        <div className="flex items-center">
                          <span className="w-3 h-3 rounded-full mr-2 shrink-0" style={{ backgroundColor: account.color }}></span>
                          {account.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="income"><DollarSign className="inline-block mr-1 h-4 w-4" /> Income</Label>
                <div className="flex space-x-2">
                  <Input
                    id="income"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 123.45"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    required
                    className="bg-background/70"
                  />
                  <Select value={incomeCurrency} onValueChange={setIncomeCurrency}>
                    <SelectTrigger className="w-[80px] bg-background/70">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      {/* Add other currencies if needed */}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="adSpend"><Euro className="inline-block mr-1 h-4 w-4" /> Ad Spend</Label>
                <div className="flex space-x-2">
                  <Input
                    id="adSpend"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 12.34"
                    value={adSpend}
                    onChange={(e) => setAdSpend(e.target.value)}
                    required
                    className="bg-background/70"
                  />
                  <Select value={adSpendCurrency} onValueChange={setAdSpendCurrency}>
                    <SelectTrigger className="w-[80px] bg-background/70">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      {/* Add other currencies if needed */}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/30 dark:bg-muted/10 p-4 justify-end">
            <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50">
              {isLoading ? 'Saving...' : 'Save Entry'}
            </Button>
          </CardFooter>
        </form>
      )}
    </Card>
  );
}

export default EntryForm;
  