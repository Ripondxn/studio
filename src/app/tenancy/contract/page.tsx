
'use client';

import { useState } from 'react';
import { useRouter }from 'next/navigation';
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
import { Plus, Trash2, Save, X, Search, FileText, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { saveContractData } from './actions';
import { type Contract, type PaymentInstallment } from './schema';

const initialContractState: Omit<Contract, 'id'> = {
    contractNo: '',
    contractDate: '',
    unitCode: '',
    tenantName: '',
    startDate: '',
    endDate: '',
    totalRent: 0,
    paymentMode: 'cash',
    paymentSchedule: [],
    terms: '',
};

export default function TenancyContractPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [contract, setContract] = useState(initialContractState);

  const handleInputChange = (field: keyof Omit<Contract, 'id' | 'paymentSchedule' | 'totalRent'>, value: string) => {
    setContract(prev => ({...prev, [field]: value}));
  }

  const handleRentChange = (value: string) => {
    setContract(prev => ({...prev, totalRent: parseFloat(value) || 0 }));
  }
  
  const handleScheduleChange = (index: number, field: keyof PaymentInstallment, value: string | number) => {
    const updatedSchedule = [...contract.paymentSchedule];
    // @ts-ignore
    updatedSchedule[index][field] = value;
    setContract(prev => ({...prev, paymentSchedule: updatedSchedule}));
  }

  const addInstallment = () => {
    setContract(prev => ({
        ...prev,
        paymentSchedule: [
            ...prev.paymentSchedule,
            { installment: prev.paymentSchedule.length + 1, dueDate: '', amount: 0, status: 'unpaid' }
        ]
    }));
  }

  const removeInstallment = (index: number) => {
    const updatedSchedule = contract.paymentSchedule.filter((_, i) => i !== index);
    setContract(prev => ({...prev, paymentSchedule: updatedSchedule}));
  }

  const handleSave = async () => {
    setIsSaving(true);
    const result = await saveContractData(contract);
    if (result.success) {
      toast({
        title: 'Contract Saved',
        description: 'The tenancy contract has been saved successfully.',
      });
      router.push('/');
    } else {
        toast({
            variant: 'destructive',
            title: 'Error Saving Contract',
            description: result.error || 'An unknown error occurred.',
        });
    }
    setIsSaving(false);
  };
  
  const handlePrint = () => {
    window.print();
  }
  
  const handleCancel = () => {
    router.back();
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-primary font-headline">
          Tenancy Contract
        </h1>
        <div className="flex items-center gap-2">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <FileText className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button variant="ghost" onClick={handleCancel}>
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
              <Input id="contract-no" placeholder="TC-2024-001" value={contract.contractNo} onChange={e => handleInputChange('contractNo', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="contract-date">Date</Label>
              <Input id="contract-date" type="date" value={contract.contractDate} onChange={e => handleInputChange('contractDate', e.target.value)} />
            </div>
             <div>
              <Label htmlFor="unit-code">Unit Code</Label>
              <div className="flex items-center gap-2">
                <Input id="unit-code" placeholder="Enter Unit Code" value={contract.unitCode} onChange={e => handleInputChange('unitCode', e.target.value)}/>
                <Button variant="outline" size="icon">
                    <Search className="h-4 w-4"/>
                </Button>
              </div>
            </div>
             <div>
              <Label htmlFor="tenant-name">Tenant Name</Label>
               <div className="flex items-center gap-2">
                <Input id="tenant-name" placeholder="Enter Tenant Name" value={contract.tenantName} onChange={e => handleInputChange('tenantName', e.target.value)}/>
                 <Button variant="outline" size="icon">
                    <Search className="h-4 w-4"/>
                </Button>
              </div>
            </div>
             <div>
              <Label htmlFor="start-date">Start Date</Label>
              <Input id="start-date" type="date" value={contract.startDate} onChange={e => handleInputChange('startDate', e.target.value)}/>
            </div>
             <div>
              <Label htmlFor="end-date">End Date</Label>
              <Input id="end-date" type="date" value={contract.endDate} onChange={e => handleInputChange('endDate', e.target.value)}/>
            </div>
            <div>
                <Label htmlFor="rent-amount">Total Rent</Label>
                <Input id="rent-amount" type="number" placeholder="0.00" value={contract.totalRent} onChange={e => handleRentChange(e.target.value)}/>
            </div>
            <div>
                <Label htmlFor="payment-mode">Payment Mode</Label>
                 <Select value={contract.paymentMode} onValueChange={(value: 'cash' | 'cheque' | 'bank-transfer') => handleInputChange('paymentMode', value)}>
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
              {contract.paymentSchedule.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.installment}</TableCell>
                <TableCell>
                  <Input type="date" value={item.dueDate} onChange={(e) => handleScheduleChange(index, 'dueDate', e.target.value)}/>
                </TableCell>
                <TableCell>
                  <Input type="number" placeholder="Amount" value={item.amount} onChange={(e) => handleScheduleChange(index, 'amount', e.target.value)}/>
                </TableCell>
                <TableCell>
                  <Select value={item.status} onValueChange={(value: 'paid' | 'unpaid') => handleScheduleChange(index, 'status', value)}>
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
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => removeInstallment(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button variant="outline" size="sm" onClick={addInstallment}>
            <Plus className="mr-2 h-4 w-4" /> Add Installment
          </Button>

            <Separator />
             <div>
                <Label htmlFor="terms">Terms & Conditions</Label>
                <Textarea id="terms" rows={5} placeholder="Enter contract terms and conditions..." value={contract.terms} onChange={e => handleInputChange('terms', e.target.value)} />
             </div>
        </CardContent>
      </Card>
    </div>
  );
}
