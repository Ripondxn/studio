
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Save, X, Search, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function TenancyContractPage() {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: 'Contract Saved',
      description: 'The tenancy contract has been saved successfully.',
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-primary font-headline">
          Tenancy Contract
        </h1>
        <div className="flex items-center gap-2">
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" /> Save
          </Button>
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button variant="ghost">
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Contract Details</CardTitle>
          <CardDescription>
            Fill in the details to create a new tenancy contract.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="contract-no">Contract No</Label>
              <Input id="contract-no" placeholder="TC-2024-001" />
            </div>
            <div>
              <Label htmlFor="contract-date">Date</Label>
              <Input id="contract-date" type="date" />
            </div>
             <div>
              <Label htmlFor="unit-code">Unit Code</Label>
              <div className="flex items-center gap-2">
                <Input id="unit-code" placeholder="Enter Unit Code" />
                <Button variant="outline" size="icon">
                    <Search className="h-4 w-4"/>
                </Button>
              </div>
            </div>
             <div>
              <Label htmlFor="tenant-name">Tenant Name</Label>
               <div className="flex items-center gap-2">
                <Input id="tenant-name" placeholder="Enter Tenant Name" />
                 <Button variant="outline" size="icon">
                    <Search className="h-4 w-4"/>
                </Button>
              </div>
            </div>
             <div>
              <Label htmlFor="start-date">Start Date</Label>
              <Input id="start-date" type="date" />
            </div>
             <div>
              <Label htmlFor="end-date">End Date</Label>
              <Input id="end-date" type="date" />
            </div>
            <div>
                <Label htmlFor="rent-amount">Total Rent</Label>
                <Input id="rent-amount" type="number" placeholder="0.00" />
            </div>
            <div>
                <Label htmlFor="payment-mode">Payment Mode</Label>
                 <Select>
                    <SelectTrigger id="payment-mode">
                        <SelectValue placeholder="Select mode"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="cheque">Cheque</SelectItem>
                        <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                 </Select>
            </div>
          </div>
          <Separator />
          <h3 className="text-lg font-medium">Payment Schedule</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Installment</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>1</TableCell>
                <TableCell>
                  <Input type="date" />
                </TableCell>
                <TableCell>
                  <Input type="number" placeholder="Amount" />
                </TableCell>
                <TableCell>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="unpaid">Unpaid</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Button variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" /> Add Installment
          </Button>

            <Separator />
             <div>
                <Label htmlFor="terms">Terms & Conditions</Label>
                <Textarea id="terms" rows={5} placeholder="Enter contract terms and conditions..." />
             </div>
        </CardContent>
      </Card>
    </div>
  );
}
