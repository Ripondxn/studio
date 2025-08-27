

'use client';

import { useState, useEffect, useRef } from 'react';
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
import { Plus, Trash2, Save, X, FileText, Loader2, Pencil, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { saveMaintenanceContract, findMaintenanceContract, deleteMaintenanceContract, getContractLookups } from '../actions';
import { type MaintenanceContract, type PaymentInstallment } from '../schema';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { addMonths, format as formatDate } from 'date-fns';
import { Combobox } from '@/components/ui/combobox';
import { Switch } from '@/components/ui/switch';
import { useCurrency } from '@/context/currency-context';
import { PrintableMaintenanceContract } from '../printable-maintenance-contract';

type LookupData = {
    vendors: {value: string, label: string}[];
    properties: {value: string, label: string}[];
}

const initialContractState: Omit<MaintenanceContract, 'id'> = {
    contractNo: '',
    contractDate: '',
    propertyCode: '',
    vendorCode: '',
    serviceType: '',
    startDate: '',
    endDate: '',
    totalValue: 0,
    status: 'Active',
    paymentFrequency: 'Monthly',
    numberOfPayments: 1,
    paymentSchedule: [],
    terms: '',
};

export default function MaintenanceContractPage() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(true);
  const [isAutoContractNo, setIsAutoContractNo] = useState(true);

  const [contract, setContract] = useState<Omit<MaintenanceContract, 'id'>>(initialContractState);
  const [initialContract, setInitialContract] = useState<Omit<MaintenanceContract, 'id'>>(initialContractState);
  const [currentContractId, setCurrentContractId] = useState<string | null>(null);
  const [editedInstallmentIndexes, setEditedInstallmentIndexes] = useState<Set<number>>(new Set());
  const [lookups, setLookups] = useState<LookupData>({ vendors: [], properties: [] });
  const { formatCurrency } = useCurrency();
  const printRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    getContractLookups().then(data => {
        setLookups(data);
    });

    const contractId = searchParams.get('id');
    if (contractId) {
        findMaintenanceContract({ contractId })
            .then(result => {
                if (result.success && result.data) {
                    setContract(result.data);
                    setInitialContract(result.data);
                    setCurrentContractId(result.data.id);
                    setIsNewRecord(false);
                    setIsEditing(false);
                    setEditedInstallmentIndexes(new Set());
                    setIsAutoContractNo(false);
                } else {
                    toast({ variant: 'destructive', title: 'Error', description: result.error || "Contract not found" });
                    router.push('/maintenance/contracts');
                }
            })
            .catch(() => {
                 toast({ variant: 'destructive', title: 'Error', description: "Failed to fetch contract." });
                 router.push('/maintenance/contracts');
            })
            .finally(() => setIsLoading(false));
    } else {
        findMaintenanceContract({ contractId: 'new' }).then(result => {
            if (result.success && result.data) {
                setContract(result.data);
                setInitialContract(result.data);
                setIsNewRecord(true);
                setIsEditing(true);
                setEditedInstallmentIndexes(new Set());
            }
             setIsLoading(false);
        });
    }
  }, [searchParams, router, toast]);

  const handleInputChange = (field: keyof Omit<MaintenanceContract, 'id' | 'paymentSchedule' | 'totalValue' | 'numberOfPayments'>, value: string) => {
    setContract(prev => ({...prev, [field]: value}));
  }
  
  const handleNumberInputChange = (field: 'totalValue' | 'numberOfPayments', value: string) => {
    setContract(prev => ({...prev, [field]: parseFloat(value) || 0 }));
  }
  
  const handleScheduleChange = (index: number, field: keyof PaymentInstallment, value: string | number) => {
    const currentSchedule = [...contract.paymentSchedule];
    const totalValue = contract.totalValue || 0;

    if (field === 'amount') {
        const newAmount = Number(value);
        const newEditedIndexes = new Set(editedInstallmentIndexes).add(index);
        setEditedInstallmentIndexes(newEditedIndexes);
        currentSchedule[index] = { ...currentSchedule[index], amount: newAmount };

        const totalManuallySetAmount = currentSchedule
            .filter((_, i) => newEditedIndexes.has(i))
            .reduce((sum, item) => sum + item.amount, 0);
        
        const remainingValue = totalValue - totalManuallySetAmount;
        const uneditedInstallments = currentSchedule.filter((_, i) => !newEditedIndexes.has(i));

        if (uneditedInstallments.length > 0) {
            const share = remainingValue / uneditedInstallments.length;
            currentSchedule.forEach((item, i) => {
                if (!newEditedIndexes.has(i)) {
                    item.amount = parseFloat(share.toFixed(2));
                }
            });

            const totalRecalculated = currentSchedule.reduce((sum, item) => sum + item.amount, 0);
            const finalDifference = totalValue - totalRecalculated;

            if (finalDifference !== 0) {
                const lastUneditedIndex = currentSchedule.map((item,i) => ({...item, originalIndex: i}))
                                                         .filter(item => !newEditedIndexes.has(item.originalIndex))
                                                         .pop()?.originalIndex;

                if (lastUneditedIndex !== undefined) {
                    currentSchedule[lastUneditedIndex].amount += finalDifference;
                }
            }
        }
        setContract(prev => ({ ...prev, paymentSchedule: currentSchedule }));
    } else {
        // @ts-ignore
        currentSchedule[index][field] = value;
        setContract(prev => ({ ...prev, paymentSchedule: currentSchedule }));
    }
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

  const handleGenerateSchedule = () => {
    const { totalValue, numberOfPayments, paymentFrequency, startDate } = contract;

    if (!totalValue || !numberOfPayments || !startDate) {
        toast({
            variant: 'destructive',
            title: 'Missing Information',
            description: 'Please provide Total Value, Number of Payments, and a Start Date.'
        });
        return;
    }
    
    setEditedInstallmentIndexes(new Set());
    const installmentAmount = parseFloat((totalValue / numberOfPayments).toFixed(2));
    const newSchedule: PaymentInstallment[] = [];
    const contractStartDate = new Date(startDate);
    
    let monthIncrement = 1;
    if(paymentFrequency === 'Quarterly') monthIncrement = 3;
    if(paymentFrequency === 'Half-Yearly') monthIncrement = 6;
    if(paymentFrequency === 'Yearly') monthIncrement = 12;

    for (let i = 0; i < numberOfPayments; i++) {
        let dueDate: Date;
        if(paymentFrequency === 'Custom') {
            dueDate = contractStartDate;
        } else {
            dueDate = addMonths(contractStartDate, i * monthIncrement);
        }
        newSchedule.push({
            installment: i + 1,
            dueDate: formatDate(dueDate, 'yyyy-MM-dd'),
            amount: installmentAmount,
            status: 'unpaid',
        });
    }
    
    const totalCalculated = newSchedule.reduce((sum, item) => sum + item.amount, 0);
    const remainder = totalValue - totalCalculated;
    if(remainder !== 0 && newSchedule.length > 0) {
        newSchedule[newSchedule.length - 1].amount += remainder;
    }

    setContract(prev => ({ ...prev, paymentSchedule: newSchedule }));
    toast({ title: 'Schedule Generated', description: `${numberOfPayments} installments have been created.`});
  }

  const handleSave = async () => {
    setIsSaving(true);
    const result = await saveMaintenanceContract({ ...contract, id: currentContractId, isAutoContractNo }, isNewRecord);
    if (result.success && result.data) {
      toast({
        title: 'Maintenance Contract Saved',
        description: 'The contract has been saved successfully.',
      });
      setIsEditing(false);
      setIsNewRecord(false);
      setInitialContract(result.data);
      if(isNewRecord){
        router.push(`/maintenance/contracts/add?id=${result.data.id}`);
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
    if (!currentContractId) return;
    try {
      const result = await deleteMaintenanceContract(currentContractId);
      if (result.success) {
        toast({
          title: 'Success',
          description: `Contract "${contract.contractNo}" deleted successfully.`,
        });
        router.push('/maintenance/contracts');
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
    const printContent = printRef.current?.innerHTML;
    if (printContent) {
        const printWindow = window.open('', '', 'height=800,width=800');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Print Maintenance Contract</title>');
            printWindow.document.write('<style>@page { size: A4; margin: 1.5cm; } body { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }</style>');
            printWindow.document.write('</head><body class="bg-white">');
            printWindow.document.write(printContent);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            setTimeout(() => printWindow.print(), 500);
        }
    }
  }
  
  const handleCancel = () => {
    if(isNewRecord){
        router.push('/maintenance/contracts');
    } else {
        setContract(initialContract);
        setIsEditing(false);
    }
  }

   const handleClose = () => {
    router.push('/maintenance/contracts');
  };

  const pageTitle = isNewRecord ? 'New Maintenance Contract' : `Edit Contract: ${initialContract.contractNo}`;

  if (isLoading) {
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
                <Button onClick={() => setIsEditing(true)}>
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
            {isNewRecord ? "Fill in the details to create a new maintenance contract." : "View or edit the contract details."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
                <Label htmlFor="contractNo">Contract No</Label>
                 <Input id="contractNo" value={contract.contractNo} onChange={e => handleInputChange('contractNo', e.target.value)} disabled={isAutoContractNo || !isEditing}/>
            </div>
             <div className="flex items-end space-x-2 pb-1">
                <Switch
                    id="auto-contract-no-switch"
                    checked={isAutoContractNo}
                    onCheckedChange={setIsAutoContractNo}
                    disabled={!isNewRecord || !isEditing}
                />
                <Label htmlFor="auto-contract-no-switch">Auto-generate</Label>
            </div>
            <div>
              <Label htmlFor="contract-date">Date</Label>
              <Input id="contract-date" type="date" value={contract.contractDate} onChange={e => handleInputChange('contractDate', e.target.value)} disabled={!isEditing}/>
            </div>
             <div>
              <Label htmlFor="status">Status</Label>
                 <Select value={contract.status} onValueChange={(value: 'Active' | 'Expired' | 'Cancelled') => handleInputChange('status', value)} disabled={!isEditing}>
                    <SelectTrigger id="status">
                        <SelectValue/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Expired">Expired</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                 </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div>
                <Label htmlFor="vendorCode">Vendor</Label>
                 <Combobox
                    options={lookups.vendors}
                    value={contract.vendorCode}
                    onSelect={(value) => handleInputChange('vendorCode', value)}
                    placeholder="Select Vendor"
                    disabled={!isEditing}
                 />
            </div>
             <div>
                <Label htmlFor="propertyCode">Property</Label>
                 <Combobox
                    options={lookups.properties}
                    value={contract.propertyCode}
                    onSelect={(value) => handleInputChange('propertyCode', value)}
                    placeholder="Select Property"
                    disabled={!isEditing}
                 />
            </div>
             <div>
                <Label htmlFor="serviceType">Service Type</Label>
                <Input id="serviceType" value={contract.serviceType} onChange={e => handleInputChange('serviceType', e.target.value)} disabled={!isEditing} placeholder="e.g. Chiller Maintenance"/>
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
                <Label htmlFor="totalValue">Total Contract Value</Label>
                <Input id="totalValue" type="number" placeholder="0.00" value={contract.totalValue} onChange={e => handleNumberInputChange('totalValue', e.target.value)} disabled={!isEditing}/>
            </div>
          </div>
          <Separator />
          <div>
            <h3 className="text-lg font-medium">Payment Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-4 p-4 border rounded-md bg-muted/50">
                 <div>
                    <Label htmlFor="payment-frequency">Payment Frequency</Label>
                    <Select value={contract.paymentFrequency || 'Monthly'} onValueChange={(value) => handleInputChange('paymentFrequency', value)} disabled={!isEditing}>
                        <SelectTrigger id="payment-frequency"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Monthly">Monthly</SelectItem>
                            <SelectItem value="Quarterly">Quarterly</SelectItem>
                            <SelectItem value="Half-Yearly">Half-Yearly</SelectItem>
                            <SelectItem value="Yearly">Yearly</SelectItem>
                            <SelectItem value="Custom">Custom</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div>
                    <Label htmlFor="number-of-payments">Number of Payments</Label>
                    <Input id="number-of-payments" type="number" value={contract.numberOfPayments || 1} onChange={e => handleNumberInputChange('numberOfPayments', e.target.value)} disabled={!isEditing} />
                </div>
                <div className="flex items-end">
                    <Button onClick={handleGenerateSchedule} disabled={!isEditing} className="w-full">
                        <RefreshCw className="mr-2 h-4 w-4"/>
                        Generate Schedule
                    </Button>
                </div>
            </div>
          </div>
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
      <div className="hidden">
        <PrintableMaintenanceContract ref={printRef} contract={contract} lookups={lookups} />
      </div>
    </div>
  );
}
