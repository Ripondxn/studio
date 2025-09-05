
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DollarSign, Plus } from 'lucide-react';

interface NewExpenseDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function NewExpenseDialog({ isOpen, onOpenChange }: NewExpenseDialogProps) {
  const [fileName, setFileName] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
    } else {
      setFileName('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
            <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-md">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                    <DialogTitle className="text-xl">Submit New Expense</DialogTitle>
                    <DialogDescription>Submit your expense details for reimbursement.</DialogDescription>
                </div>
            </div>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employee">Employee</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="john-smith">John Smith</SelectItem>
                  <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
                  <SelectItem value="mike-wilson">Mike Wilson</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select defaultValue="expense-claim">
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense-claim">Expense Claim</SelectItem>
                  <SelectItem value="advance-request">Advance Request</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select defaultValue="materials">
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="materials">Materials</SelectItem>
                  <SelectItem value="tools">Tools</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input id="amount" type="number" placeholder="0.00" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Provide detailed description of the expense or advance request..."
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label>Receipt/Invoice</Label>
            <div className="flex items-stretch">
                <label htmlFor="receipt-file" className="cursor-pointer flex items-center justify-center px-4 bg-primary text-primary-foreground rounded-l-md border border-r-0 border-primary">
                    Choose File
                </label>
                <input id="receipt-file" type="file" className="hidden" onChange={handleFileChange} />
                <div className="flex-1 px-3 py-2 border rounded-r-md text-sm text-muted-foreground">
                    {fileName || "No file chosen"}
                </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Submit Expense
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
