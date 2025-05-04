
    import React, { useState } from 'react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
    import { DatePicker } from '@/components/ui/date-picker';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { useToast } from '@/components/ui/use-toast';
    import { DollarSign, Euro, CalendarPlus as CalendarIcon, FileText, Info } from 'lucide-react';
    import { format } from 'date-fns';

    function OtherExpensesForm({ addOtherExpense, isLoading }) {
      const [date, setDate] = useState(new Date());
      const [description, setDescription] = useState('');
      const [amount, setAmount] = useState('');
      const [currency, setCurrency] = useState('USD');
      const { toast } = useToast();

      const handleSubmit = async (e) => {
        e.preventDefault();
        if (!date || !description || amount === '') {
          toast({
            title: "Missing Information",
            description: "Please fill in all fields.",
            variant: "destructive",
          });
          return;
        }

        const formattedDate = format(date, 'yyyy-MM-dd');

        const expenseData = {
          date: formattedDate,
          description: description,
          amount: parseFloat(amount),
          currency: currency,
        };

        const result = await addOtherExpense(expenseData);

        if (result?.success) {
          setDescription('');
          setAmount('');
          // Keep date and currency for potential next entry
        }
      };

      return (
        <Card className="shadow-xl border border-border/40 bg-card/80 backdrop-blur-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-700 dark:to-orange-700 p-1"></div>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Add Other Expense</CardTitle>
            <CardDescription>Record business expenses other than KDP ad spend.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expense-date"><CalendarIcon className="inline-block mr-1 h-4 w-4" /> Date</Label>
                  <DatePicker date={date} setDate={setDate} />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="description"><FileText className="inline-block mr-1 h-4 w-4" /> Description</Label>
                  <Input
                    id="description"
                    placeholder="e.g., Software Subscription, VA Payment"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="bg-background/70"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount"><DollarSign className="inline-block mr-1 h-4 w-4" /> Amount</Label>
                <div className="flex space-x-2">
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 50.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="bg-background/70"
                  />
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="w-[80px] bg-background/70">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      {/* Add other common currencies if needed */}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 dark:bg-muted/10 p-4 justify-end">
              <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50">
                {isLoading ? 'Saving...' : 'Save Expense'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      );
    }

    export default OtherExpensesForm;
  