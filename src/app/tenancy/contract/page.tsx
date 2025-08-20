
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams }from 'next/navigation';
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
import { Plus, Trash2, Save, X, Search, FileText, Loader2, Pencil } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { saveContractData, findContract, deleteContract } from './actions';
import { type Contract, type PaymentInstallment } from './schema';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const initialContractState: Contract = {
    id: '',
    contractNo: '',
    contractDate: '',
    unitCode: '',
    property: '',
    tenantName: '',
    startDate: '',
    endDate: '',
    totalRent: 0,
    paymentMode: 'cash',
    status: 'New',
    terminationDate: '',
    rentBasedOn: 'Monthly',
    paymentSchedule: [],
    terms: '',
};

export default function TenancyContractPage() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSaving, setIsSaving] = useState(false);
  const [isFinding, setIsFinding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(true);

  const [contract, setContract] = useState<Contract>(initialContractState);
  const [initialContract, setInitialContract] = useState<Contract>(initialContractState);

  useEffect(() => {
    const contractId = searchParams.get('id');
    if (contractId) {
      setIsFinding(true);
      findContract({ contractId })
        .then(result => {
          if (result.success && result.data) {
            setContract(result.data);
            setInitialContract(result.data);
            setIsNewRecord(false);
            setIsEditing(false);
          } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
            router.push('/tenancy/contracts');
          }
        })
        .finally(() => setIsFinding(false));
    } else {
        setIsNewRecord(true);
        setIsEditing(true);
        setContract(initialContractState);
    }
  }, [searchParams, router, toast]);

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
  
  const handleFind = async (findBy: 'unitCode' | 'tenantName') => {
    const query = findBy === 'unitCode' ? { unitCode: contract.unitCode } : { tenantName: contract.tenantName };
    if ((findBy === 'unitCode' && !contract.unitCode) || (findBy === 'tenantName' && !contract.tenantName)) {
        toast({ variant: 'destructive', title: 'Search Error', description: 'Please enter a value to search.'});
        return;
    }
    
    setIsFinding(true);
    const result = await findContract(query);
    if(result.success && result.data){
        toast({ title: 'Contract Found', description: `Loaded contract ${result.data.contractNo}`});
        router.push(`/tenancy/contract?id=${result.data.id}`);
    } else {
        toast({ variant: 'destructive', title: 'Not Found', description: result.error });
    }
    setIsFinding(false);
  }

  const handleSave = async () => {
    setIsSaving(true);
    const result = await saveContractData(contract, isNewRecord);
    if (result.success && result.data) {
      toast({
        title: 'Contract Saved',
        description: 'The tenancy contract has been saved successfully.',
      });
      setIsEditing(false);
      setIsNewRecord(false);
      setInitialContract(result.data);
      if(isNewRecord){
        router.push(`/tenancy/contract?id=${result.data.id}`);
      }
    } else {
        toast({
            variant: 'destructive',
            title: 'Error Saving Contract',
            description: result.error || 'An unknown error occurred.',
        });
    }
    setIsSaving(false);
  };
  
  const handleDelete = async () => {
    if (!contract.id) return;
    try {
      const result = await deleteContract(contract.id);
      if (result.success) {
        toast({
          title: 'Success',
          description: `Contract "${contract.contractNo}" deleted successfully.`,
        });
        router.push('/tenancy/contracts');
      } else {
        throw new Error(result.error || 'An unknown error occurred');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: (error as Error).message || 'Failed to delete contract.',
      });
    }
  };


  const handlePrint = () => {
    window.print();
  }
  
  const handleCancel = () => {
    if(isNewRecord){
        router.push('/tenancy/contracts');
    } else {
        setContract(initialContract);
        setIsEditing(false);
    }
  }

   const handleClose = () => {
    router.push('/tenancy/contracts');
  };

  const pageTitle = isNewRecord ? 'New Tenancy Contract' : `Edit Contract: ${initialContract.contractNo}`;

  if (isFinding) {
    return (
        <div className="container mx-auto p-4 flex justify-center items-center h-full">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-primary font-headline">
          {pageTitle}
        </h1>
        <div className="flex items-center gap-2">
           {isEditing ? (
            <>
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save
                </Button>
                <Button variant="ghost" onClick={handleCancel}>
                    <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
            </>
           ) : (
             <>
                <Button onClick={() => setIsEditing(true)} disabled={isFinding}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                </Button>
                <Button variant="outline" onClick={handlePrint}>
                    <FileText className="mr-2 h-4 w-4" /> Print
                </Button>
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                    <Button
                        variant="destructive"
                        disabled={isNewRecord || isEditing}
                    >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the
                        contract "{contract.contractNo}".
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive hover:bg-destructive/90"
                        >
                        Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
             </>
           )}
            <Button variant="outline" onClick={handleClose}>
                <X className="mr-2 h-4 w-4" /> Close
            </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Contract Details</CardTitle>
          <CardDescription>
            {isNewRecord ? "Fill in the details to create a new tenancy contract." : "View or edit the details of the tenancy contract."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="contract-no">Contract No</Label>
              <Input id="contract-no" placeholder="TC-2024-001" value={contract.contractNo} onChange={e => handleInputChange('contractNo', e.target.value)} disabled={!isEditing}/>
            </div>
            <div>
              <Label htmlFor="contract-date">Date</Label>
              <Input id="contract-date" type="date" value={contract.contractDate} onChange={e => handleInputChange('contractDate', e.target.value)} disabled={!isEditing}/>
            </div>
             <div>
              <Label htmlFor="unit-code">Unit Code</Label>
              <div className="flex items-center gap-2">
                <Input id="unit-code" placeholder="Enter Unit Code" value={contract.unitCode} onChange={e => handleInputChange('unitCode', e.target.value)} disabled={!isEditing}/>
                <Button variant="outline" size="icon" onClick={() => handleFind('unitCode')} disabled={!isEditing || isFinding}>
                    {isFinding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4"/>}
                </Button>
              </div>
            </div>
             <div>
              <Label htmlFor="tenant-name">Tenant Name</Label>
               <div className="flex items-center gap-2">
                <Input id="tenant-name" placeholder="Enter Tenant Name" value={contract.tenantName} onChange={e => handleInputChange('tenantName', e.target.value)} disabled={!isEditing}/>
                 <Button variant="outline" size="icon" onClick={() => handleFind('tenantName')} disabled={!isEditing || isFinding}>
                     {isFinding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4"/>}
                </Button>
              </div>
            </div>
             <div>
              <Label htmlFor="start-date">Start Date</Label>
              <Input id="start-date" type="date" value={contract.startDate} onChange={e => handleInputChange('startDate', e.target.value)} disabled={!isEditing}/>
            </div>
             <div>
              <Label htmlFor="end-date">End Date</Label>
              <Input id="end-date" type="date" value={contract.endDate} onChange={e => handleInputChange('endDate', e.target.value)} disabled={!isEditing}/>
            </div>
            <div>
                <Label htmlFor="rent-amount">Total Rent</Label>
                <Input id="rent-amount" type="number" placeholder="0.00" value={contract.totalRent} onChange={e => handleRentChange(e.target.value)} disabled={!isEditing}/>
            </div>
            <div>
                <Label htmlFor="payment-mode">Payment Mode</Label>
                 <Select value={contract.paymentMode} onValueChange={(value: 'cash' | 'cheque' | 'bank-transfer') => handleInputChange('paymentMode', value)} disabled={!isEditing}>
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
             <div>
                <Label htmlFor="status">Status</Label>
                 <Select value={contract.status} onValueChange={(value: 'New' | 'Renew') => handleInputChange('status', value)} disabled={!isEditing}>
                    <SelectTrigger id="status">
                        <SelectValue/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Renew">Renew</SelectItem>
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
                  <Input type="date" value={item.dueDate} onChange={(e) => handleScheduleChange(index, 'dueDate', e.target.value)} disabled={!isEditing}/>
                </TableCell>
                <TableCell>
                  <Input type="number" placeholder="Amount" value={item.amount} onChange={(e) => handleScheduleChange(index, 'amount', Number(e.target.value))} disabled={!isEditing}/>
                </TableCell>
                <TableCell>
                  <Select value={item.status} onValueChange={(value: 'paid' | 'unpaid') => handleScheduleChange(index, 'status', value)} disabled={!isEditing}>
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
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => removeInstallment(index)} disabled={!isEditing}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button variant="outline" size="sm" onClick={addInstallment} disabled={!isEditing}>
            <Plus className="mr-2 h-4 w-4" /> Add Installment
          </Button>

            <Separator />
             <div>
                <Label htmlFor="terms">Terms & Conditions</Label>
                <Textarea id="terms" rows={5} placeholder="Enter contract terms and conditions..." value={contract.terms || ''} onChange={e => handleInputChange('terms', e.target.value)} disabled={!isEditing}/>
             </div>
        </CardContent>
      </Card>
    </div>
  );
}
