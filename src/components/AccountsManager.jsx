
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { ColorPicker } from '@/components/ui/color-picker';
import { useToast } from '@/components/ui/use-toast';
import { Palette, PlusCircle, Pencil, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

function AccountsManager({ accounts, addAccount, updateAccount, isLoading }) {
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountColor, setNewAccountColor] = useState('#4299e1'); // Default color (Tailwind blue-500)
  const [editingAccount, setEditingAccount] = useState(null); // State for the account being edited
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  const { toast } = useToast();

  const handleAddAccount = async (e) => {
    e.preventDefault();
    if (!newAccountName) {
      toast({
        title: "Missing Information",
        description: "Please enter an account name.",
        variant: "destructive",
      });
      return;
    }

    const result = await addAccount({ name: newAccountName, color: newAccountColor });

    if (result.success) {
      setNewAccountName('');
      setNewAccountColor('#4299e1'); // Reset to default
    }
  };

  const handleOpenEditDialog = (account) => {
    setEditingAccount(account);
    setEditName(account.name);
    setEditColor(account.color);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingAccount(null); // Clear editing state on close
    setIsSubmittingEdit(false);
  };

  const handleUpdateAccount = async (e) => {
     e.preventDefault();
     if (!editingAccount || !editName) {
       toast({
         title: "Missing Information",
         description: "Account name cannot be empty.",
         variant: "destructive",
       });
       return;
     }
     setIsSubmittingEdit(true);
     const result = await updateAccount(editingAccount.id, { name: editName, color: editColor });
     setIsSubmittingEdit(false);

     if (result.success) {
       handleCloseEditDialog();
     }
   };


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Add Account Card */}
      <div className="lg:col-span-1">
        <Card className="shadow-xl border border-border/40 bg-card/80 backdrop-blur-lg overflow-hidden">
           <div className="bg-gradient-to-r from-yellow-500 to-orange-500 dark:from-yellow-700 dark:to-orange-700 p-1"></div>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold flex items-center"><PlusCircle className="mr-2 h-6 w-6"/> Add New Account</CardTitle>
            <CardDescription>Create a new KDP account to track.</CardDescription>
          </CardHeader>
          <form onSubmit={handleAddAccount}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newAccountName">Account Name</Label>
                <Input
                  id="newAccountName"
                  value={newAccountName}
                  onChange={(e) => setNewAccountName(e.target.value)}
                  placeholder="e.g., Pen Name Books"
                  required
                  className="bg-background/70"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                 <ColorPicker
                    id="newAccountColor"
                    label="Account Color"
                    value={newAccountColor}
                    onChange={(e) => setNewAccountColor(e.target.value)}
                    className="bg-background/70"
                    disabled={isLoading}
                 />
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 dark:bg-muted/10 p-4 justify-end">
              <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isLoading ? 'Adding...' : 'Add Account'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>

      {/* Accounts List Card */}
      <div className="lg:col-span-2">
        <Card className="shadow-xl border border-border/40 bg-card/80 backdrop-blur-lg overflow-hidden">
           <div className="bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-700 dark:to-purple-700 p-1"></div>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold flex items-center"><Palette className="mr-2 h-6 w-6"/> Your Accounts</CardTitle>
             <CardDescription>List of your created KDP accounts. Click the pencil to edit.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>
                 {isLoading && !accounts.length ? "Loading accounts..." : accounts.length === 0 ? "No accounts created yet." : `Showing ${accounts.length} accounts.`}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Color</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                 {isLoading && !accounts.length && (
                   <TableRow>
                     <TableCell colSpan={3} className="text-center text-muted-foreground py-4">Loading...</TableCell>
                   </TableRow>
                 )}
                {!isLoading && accounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell>
                      <div className="w-6 h-6 rounded-full border border-border" style={{ backgroundColor: account.color }}></div>
                    </TableCell>
                    <TableCell className="font-medium">{account.name}</TableCell>
                    <TableCell className="text-right">
                       <Dialog open={isEditDialogOpen && editingAccount?.id === account.id} onOpenChange={(open) => { if (!open) handleCloseEditDialog(); }}>
                         <DialogTrigger asChild>
                           <Button variant="ghost" size="icon" onClick={() => handleOpenEditDialog(account)} disabled={isLoading}>
                             <Pencil className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                           </Button>
                         </DialogTrigger>
                         <DialogContent className="sm:max-w-[425px]">
                           <form onSubmit={handleUpdateAccount}>
                             <DialogHeader>
                               <DialogTitle>Edit Account</DialogTitle>
                               <DialogDescription>
                                 Make changes to your account name and color here. Click save when you're done.
                               </DialogDescription>
                             </DialogHeader>
                             <div className="grid gap-4 py-4">
                               <div className="grid grid-cols-4 items-center gap-4">
                                 <Label htmlFor="edit-name" className="text-right">
                                   Name
                                 </Label>
                                 <Input
                                   id="edit-name"
                                   value={editName}
                                   onChange={(e) => setEditName(e.target.value)}
                                   className="col-span-3"
                                   required
                                   disabled={isSubmittingEdit}
                                 />
                               </div>
                               <div className="grid grid-cols-4 items-center gap-4">
                                 <Label htmlFor="edit-color" className="text-right">
                                   Color
                                 </Label>
                                  <ColorPicker
                                     id="edit-color"
                                     value={editColor}
                                     onChange={(e) => setEditColor(e.target.value)}
                                     className="col-span-3"
                                     disabled={isSubmittingEdit}
                                  />
                               </div>
                             </div>
                             <DialogFooter>
                               <DialogClose asChild>
                                  <Button type="button" variant="outline" onClick={handleCloseEditDialog} disabled={isSubmittingEdit}>Cancel</Button>
                               </DialogClose>
                               <Button type="submit" disabled={isSubmittingEdit || isLoading}>
                                 {isSubmittingEdit ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                 {isSubmittingEdit ? 'Saving...' : 'Save Changes'}
                               </Button>
                             </DialogFooter>
                           </form>
                         </DialogContent>
                       </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
                 {!isLoading && accounts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground py-4">No accounts found. Add one using the form.</TableCell>
                    </TableRow>
                 )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AccountsManager;
  