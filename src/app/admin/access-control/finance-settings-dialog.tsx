
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

interface FinanceSettingsDialogProps {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSave: () => void;
}

export function FinanceSettingsDialog({ children, isOpen, setIsOpen, onSave }: FinanceSettingsDialogProps) {
    const [isSaving, setIsSaving] = useState(false);
    
    // In a real app, these values would come from props/state management
    const [allowOverdue, setAllowOverdue] = useState(true);
    const [enableLateFees, setEnableLateFees] = useState(false);
    const [lateFeeAmount, setLateFeeAmount] = useState(50);
    
    const handleSave = () => {
        setIsSaving(true);
        // Simulate saving
        setTimeout(() => {
            onSave();
            setIsSaving(false);
            setIsOpen(false);
        }, 1000);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Finance Module Settings</DialogTitle>
                    <DialogDescription>
                        Configure settings for financial transactions and automation.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-6">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label htmlFor="allow-overdue" className="text-base">Allow Overdue Payments</Label>
                            <p className="text-sm text-muted-foreground">
                                If disabled, users cannot record payments past the due date without special permission.
                            </p>
                        </div>
                        <Switch
                            id="allow-overdue"
                            checked={allowOverdue}
                            onCheckedChange={setAllowOverdue}
                        />
                    </div>
                     <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label htmlFor="enable-late-fees" className="text-base">Enable Automatic Late Fees</Label>
                            <p className="text-sm text-muted-foreground">
                                Automatically add a late fee to overdue invoices.
                            </p>
                        </div>
                        <Switch
                            id="enable-late-fees"
                            checked={enableLateFees}
                            onCheckedChange={setEnableLateFees}
                        />
                    </div>
                    {enableLateFees && (
                         <div className="space-y-2 pl-4">
                            <Label htmlFor="late-fee-amount">Late Fee Amount</Label>
                            <Input
                                id="late-fee-amount"
                                type="number"
                                value={lateFeeAmount}
                                onChange={(e) => setLateFeeAmount(parseFloat(e.target.value) || 0)}
                                className="w-[120px]"
                            />
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                     <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Finance Settings
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
