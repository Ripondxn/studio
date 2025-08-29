
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Loader2, Eraser, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { resetAllTransactions, resetBankingBalances, resetChartOfAccounts } from './actions';

type ResetAction = 'transactions' | 'banking' | 'coa';

export default function ResetDataPage() {
    const { toast } = useToast();
    const [actionToConfirm, setActionToConfirm] = useState<ResetAction | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [confirmationText, setConfirmationText] = useState('');

    const handleReset = async () => {
        if (confirmationText !== 'RESET') {
            toast({
                variant: 'destructive',
                title: 'Confirmation Failed',
                description: 'Please type "RESET" to confirm.'
            });
            return;
        }

        setIsProcessing(true);
        let result;
        let successMessage = '';
        
        switch(actionToConfirm) {
            case 'transactions':
                result = await resetAllTransactions();
                successMessage = 'All transactional data has been cleared.';
                break;
            case 'banking':
                result = await resetBankingBalances();
                successMessage = 'All bank account and petty cash balances have been reset to zero.';
                break;
            case 'coa':
                result = await resetChartOfAccounts();
                successMessage = 'All Chart of Account balances have been reset to zero.';
                break;
            default:
                result = { success: false, error: 'Invalid action.' };
        }

        if (result.success) {
            toast({ title: 'Success', description: successMessage });
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
        }
        
        setIsProcessing(false);
        setActionToConfirm(null);
        setConfirmationText('');
    };
    
    const resetActions = [
        {
            type: 'transactions' as ResetAction,
            title: 'Reset All Transactions',
            description: 'This will permanently delete all payment records, invoices, bills, cheque history, and checkout vouchers. This is irreversible.',
            buttonText: 'Reset Transactions'
        },
        {
            type: 'banking' as ResetAction,
            title: 'Reset Banking & Petty Cash',
            description: 'This will reset the balance of all bank accounts and the petty cash account to zero. Transaction history will NOT be deleted.',
            buttonText: 'Reset Balances'
        },
        {
            type: 'coa' as ResetAction,
            title: 'Reset Chart of Accounts',
            description: 'This action resets all account balances in the Chart of Accounts to zero. It does not delete the accounts themselves.',
            buttonText: 'Reset CoA Balances'
        },
    ];

    return (
        <div className="container mx-auto py-10">
             <div className="mb-8">
                <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
                    <Eraser className="h-8 w-8" /> Data Reset Center
                </h1>
                <p className="text-muted-foreground">Perform irreversible data clearing operations. Please proceed with extreme caution.</p>
            </div>
             <AlertDialog open={!!actionToConfirm} onOpenChange={(open) => !open && setActionToConfirm(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                           This is a destructive action and cannot be undone. To confirm, please type "RESET" in the box below.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-2">
                        <Label htmlFor="confirmation">Type "RESET" to confirm</Label>
                        <Input 
                            id="confirmation"
                            value={confirmationText}
                            onChange={(e) => setConfirmationText(e.target.value)}
                        />
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleReset} disabled={isProcessing || confirmationText !== 'RESET'}>
                            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Confirm & Reset
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <div className="space-y-6">
                {resetActions.map((action) => (
                    <Card key={action.type} className="border-destructive">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-destructive"/>
                                {action.title}
                            </CardTitle>
                            <CardDescription>{action.description}</CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <Button variant="destructive" onClick={() => setActionToConfirm(action.type)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                {action.buttonText}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
