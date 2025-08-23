

'use client';

import { useState, useEffect, useCallback } from 'react';
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
import { saveContractData, findContract, deleteContract, getContractLookups, getUnitDetails, getUnitsForProperty, getRoomsForUnit, getPartitionsForUnit, getPartitionDetails } from './actions';
import { type Contract, type PaymentInstallment } from './schema';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { addMonths, format as formatDate } from 'date-fns';
import { Combobox } from '@/components/ui/combobox';
import { type Tenant } from '../tenants/schema';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const initialContractState: Contract = {
    id: '',
    contractNo: '',
    contractDate: '',
    unitCode: '',
    roomCode: '',
    partitionCode: '',
    property: '',
    tenantCode: '',
    tenantName: '',
    mobile: '',
    email: '',
    address: '',
    startDate: '',
    endDate: '',
    totalRent: 0,
    paymentMode: 'cash',
    status: 'New',
    terminationDate: '',
    rentBasedOn: 'Monthly',
    paymentFrequency: 'Monthly',
    numberOfPayments: 1,
    gracePeriod: 0,
    paymentSchedule: [],
    terms: '',
    tawtheeqRegistrationNo: '',
    tawtheeqStatus: 'Not Registered',
    tawtheeqRegistrationDate: '',
};

type LookupData = {
    properties: {value: string, label: string}[];
    units: {value: string, label: string}[];
    rooms: {value: string, label: string}[];
    partitions: {value: string, label: string}[];
    tenants: (Tenant & {value: string, label: string})[];
}

export default function TenancyContractPage() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(true);

  const [contract, setContract] = useState<Contract>(initialContractState);
  const [initialContract, setInitialContract] = useState<Contract>(initialContractState);
  const [editedInstallmentIndexes, setEditedInstallmentIndexes] = useState<Set<number>>(new Set());
  const [lookups, setLookups] = useState<LookupData>({ properties: [], units: [], rooms: [], partitions: [], tenants: [] });


  const fetchContractData = useCallback(async (contractId: string) => {
    setIsLoading(true);
    try {
        const result = await findContract({ contractId });
        if (result.success && result.data) {
            const fetchedContract = result.data;
            setContract(fetchedContract);
            setInitialContract(fetchedContract);
            setIsNewRecord(false);
            setIsEditing(false);
            setEditedInstallmentIndexes(new Set());

            if (fetchedContract.property) {
                const units = await getUnitsForProperty(fetchedContract.property);
                setLookups(prev => ({...prev, units}));
            }
            if (fetchedContract.property && fetchedContract.unitCode) {
                const rooms = await getRoomsForUnit(fetchedContract.property, fetchedContract.unitCode);
                setLookups(prev => ({...prev, rooms}));
                const partitions = await getPartitionsForUnit(fetchedContract.property, fetchedContract.unitCode);
                setLookups(prev => ({...prev, partitions}));
            }
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error || "Contract not found" });
            router.push('/tenancy/contracts');
        }
    } catch (err) {
        toast({ variant: 'destructive', title: 'Error', description: "Failed to fetch contract." });
        router.push('/tenancy/contracts');
    } finally {
        setIsLoading(false);
    }
  }, [router, toast]);


  useEffect(() => {
    getContractLookups().then(data => {
        setLookups(prev => ({...prev, properties: data.properties, tenants: data.tenants}));
    });

    const contractId = searchParams.get('id');
    const propertyCode = searchParams.get('propertyCode');
    const unitCode = searchParams.get('unitCode');

    if (contractId) {
       fetchContractData(contractId);
    } else {
        setIsNewRecord(true);
        setIsEditing(true);
        const newContractNo = `TC-${Date.now()}`;
        const newContract = {...initialContractState, contractNo: newContractNo};
        if(propertyCode) newContract.property = propertyCode;
        if(unitCode) newContract.unitCode = unitCode;
        
        setContract(newContract);

        if(propertyCode && unitCode){
            handlePropertySelect(propertyCode).then(() => {
                handleUnitSelect(unitCode);
            })
        }

        setEditedInstallmentIndexes(new Set());
        setIsLoading(false);
    }
  }, [searchParams, fetchContractData]);

  const handleInputChange = (field: keyof Omit<Contract, 'id' | 'paymentSchedule' | 'totalRent' | 'numberOfPayments' | 'gracePeriod'>, value: string) => {
    setContract(prev => ({...prev, [field]: value}));
  }
  
  const handleNumberInputChange = (field: 'totalRent' | 'numberOfPayments' | 'gracePeriod' | 'finalSettlementAmount', value: string) => {
    setContract(prev => ({...prev, [field]: parseFloat(value) || 0 }));
  }

  const handlePropertySelect = async (propertyCode: string) => {
      setContract(prev => ({
        ...prev, 
        property: propertyCode, 
        unitCode: '', 
        roomCode: '', 
        partitionCode: ''
      }));
      setLookups(prev => ({...prev, units: [], rooms: [], partitions: []}));
      if(propertyCode) {
          const units = await getUnitsForProperty(propertyCode);
          setLookups(prev => ({...prev, units}));
      }
  }
  
  const handleUnitSelect = async (unitCode: string) => {
    setContract(prev => ({ ...prev, unitCode, roomCode: '', partitionCode: '' }));
    setLookups(prev => ({...prev, rooms: [], partitions: []}));
    
    if (unitCode) {
        const rooms = await getRoomsForUnit(contract.property || '', unitCode);
        setLookups(prev => ({...prev, rooms}));
        const partitions = await getPartitionsForUnit(contract.property || '', unitCode);
        setLookups(prev => ({...prev, partitions}));

        const result = await getUnitDetails(unitCode);
        if (result.success && result.data) {
            setContract(prev => ({
                ...prev,
                totalRent: result.data.totalRent,
            }));
            
            const tenant = result.data.tenant;
            if(tenant) {
                 handleTenantSelect(tenant.code);
            }
        }
    }
  }

  const handlePartitionSelect = async (partitionCode: string) => {
    setContract(prev => ({...prev, partitionCode: partitionCode}));
     if (partitionCode) {
        const result = await getPartitionDetails(partitionCode);
        if (result.success && result.data) {
            setContract(prev => ({
                ...prev,
                totalRent: result.data.totalRent
            }));
        }
    } else {
        if(contract.unitCode) {
            const result = await getUnitDetails(contract.unitCode);
            if (result.success && result.data) {
                setContract(prev => ({ ...prev, totalRent: result.data.totalRent }));
            }
        }
    }
  }
  
  const handleTenantSelect = (tenantCode: string) => {
      const tenant = lookups.tenants.find(t => t.value === tenantCode);
      if (tenant) {
          setContract(prev => ({
              ...prev,
              tenantCode: tenant.value,
              tenantName: tenant.label,
              mobile: tenant.mobile,
              email: tenant.email,
              address: tenant.address
          }));
      }
  }

  const handleScheduleChange = (index: number, field: keyof PaymentInstallment, value: string | number) => {
    const currentSchedule = [...contract.paymentSchedule];

    if (field === 'amount') {
        const newAmount = Number(value);
        
        const newEditedIndexes = new Set(editedInstallmentIndexes).add(index);
        setEditedInstallmentIndexes(newEditedIndexes);

        currentSchedule[index] = { ...currentSchedule[index], amount: newAmount };

        const totalManuallySetAmount = currentSchedule
            .filter((_, i) => newEditedIndexes.has(i))
            .reduce((sum, item) => sum + item.amount, 0);
        
        const remainingRent = contract.totalRent - totalManuallySetAmount;
        const uneditedInstallments = currentSchedule.filter((_, i) => !newEditedIndexes.has(i));

        if (uneditedInstallments.length > 0) {
            const share = remainingRent / uneditedInstallments.length;

            currentSchedule.forEach((item, i) => {
                if (!newEditedIndexes.has(i)) {
                    item.amount = parseFloat(share.toFixed(2));
                }
            });

            const totalRecalculated = currentSchedule.reduce((sum, item) => sum + item.amount, 0);
            const finalDifference = contract.totalRent - totalRecalculated;

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
            { installment: prev.paymentSchedule.length + 1, dueDate: '', amount: 0, status: 'unpaid', chequeNo: '', bankName: '' }
        ]
    }));
  }

  const removeInstallment = (index: number) => {
    const updatedSchedule = contract.paymentSchedule.filter((_, i) => i !== index);
    setContract(prev => ({...prev, paymentSchedule: updatedSchedule}));
  }

  const handleGenerateSchedule = () => {
    const { totalRent, numberOfPayments, paymentFrequency, startDate } = contract;

    if (!totalRent || !numberOfPayments || !startDate) {
        toast({
            variant: 'destructive',
            title: 'Missing Information',
            description: 'Please provide Total Rent, Number of Payments, and a Start Date.'
        });
        return;
    }
    
    setEditedInstallmentIndexes(new Set());

    const installmentAmount = parseFloat((totalRent / numberOfPayments).toFixed(2));
    const newSchedule: PaymentInstallment[] = [];
    const contractStartDate = new Date(startDate);
    
    let monthIncrement = 1;
    if(paymentFrequency === 'Quarterly') monthIncrement = 3;
    if(paymentFrequency === 'Half-Yearly') monthIncrement = 6;
    if(paymentFrequency === 'Yearly') monthIncrement = 12;

    for (let i = 0; i < numberOfPayments; i++) {
        let dueDate: Date;
        if(paymentFrequency === 'Custom') {
            dueDate = contractStartDate; // For custom, user sets dates manually
        } else {
            dueDate = addMonths(contractStartDate, i * monthIncrement);
        }

        newSchedule.push({
            installment: i + 1,
            dueDate: formatDate(dueDate, 'yyyy-MM-dd'),
            amount: installmentAmount,
            status: 'unpaid',
            chequeNo: '',
            bankName: '',
        });
    }
    
    const totalCalculated = newSchedule.reduce((sum, item) => sum + item.amount, 0);
    const remainder = totalRent - totalCalculated;
    if(remainder !== 0 && newSchedule.length > 0) {
        newSchedule[newSchedule.length - 1].amount += remainder;
    }


    setContract(prev => ({ ...prev, paymentSchedule: newSchedule }));
    toast({ title: 'Schedule Generated', description: `${numberOfPayments} installments have been created.`});
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
                <Button onClick={() => setIsEditing(true)} disabled={isLoading}>
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
      <Tabs defaultValue="details">
        <TabsList>
            <TabsTrigger value="details">Contract Details</TabsTrigger>
            <TabsTrigger value="schedule">Payment Schedule</TabsTrigger>
            <TabsTrigger value="termination" disabled={isNewRecord}>Termination</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Contract & Property</CardTitle>
                            <CardDescription>
                                Details of the tenancy agreement and the rented property.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="contract-no">Tenancy Contract No</Label>
                                    <Input id="contract-no" placeholder="TC-2024-001" value={contract.contractNo} onChange={e => handleInputChange('contractNo', e.target.value)} disabled/>
                                </div>
                                <div>
                                    <Label htmlFor="contract-date">Date</Label>
                                    <Input id="contract-date" type="date" value={contract.contractDate} onChange={e => handleInputChange('contractDate', e.target.value)} disabled={!isEditing}/>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="property">Property</Label>
                                    <Combobox
                                        options={lookups.properties}
                                        value={contract.property || ''}
                                        onSelect={handlePropertySelect}
                                        placeholder="Select Property"
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="unit-code">Unit Code</Label>
                                    <Combobox
                                        options={lookups.units}
                                        value={contract.unitCode}
                                        onSelect={handleUnitSelect}
                                        placeholder="Select a Unit"
                                        disabled={!isEditing || !contract.property}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="room-code">Room</Label>
                                    <Combobox
                                        options={lookups.rooms}
                                        value={contract.roomCode || ''}
                                        onSelect={(value) => handleInputChange('roomCode', value)}
                                        placeholder="Select a Room"
                                        disabled={!isEditing || !contract.unitCode}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="partition-code">Partition</Label>
                                    <Combobox
                                        options={lookups.partitions}
                                        value={contract.partitionCode || ''}
                                        onSelect={handlePartitionSelect}
                                        placeholder="Select Partition"
                                        disabled={!isEditing || !contract.unitCode || lookups.partitions.length === 0}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="start-date">Start Date</Label>
                                    <Input id="start-date" type="date" value={contract.startDate} onChange={e => handleInputChange('startDate', e.target.value)} disabled={!isEditing}/>
                                </div>
                                <div>
                                    <Label htmlFor="end-date">End Date</Label>
                                    <Input id="end-date" type="date" value={contract.endDate} onChange={e => handleInputChange('endDate', e.target.value)} disabled={!isEditing}/>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="rent-amount">Total Rent</Label>
                                    <Input id="rent-amount" type="number" placeholder="0.00" value={contract.totalRent} onChange={e => handleNumberInputChange('totalRent', e.target.value)} disabled={!isEditing}/>
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
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="status">Status</Label>
                                    <Select value={contract.status} onValueChange={(value: 'New' | 'Renew' | 'Cancel') => handleInputChange('status', value)} disabled={!isEditing}>
                                        <SelectTrigger id="status">
                                            <SelectValue/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="New">New</SelectItem>
                                            <SelectItem value="Renew">Renew</SelectItem>
                                            <SelectItem value="Cancel">Cancel</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="grace-period">Grace Period (days)</Label>
                                    <Input id="grace-period" type="number" placeholder="0" value={contract.gracePeriod || ''} onChange={e => handleNumberInputChange('gracePeriod', e.target.value)} disabled={!isEditing}/>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Tawtheeq Registration</CardTitle>
                            <CardDescription>Manage Tawtheeq registration details for this contract.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <Label htmlFor="tawtheeq-status">Status</Label>
                                    <Select value={contract.tawtheeqStatus} onValueChange={(value: 'Not Registered' | 'Under Process' | 'Registered') => handleInputChange('tawtheeqStatus', value)} disabled={!isEditing}>
                                        <SelectTrigger id="tawtheeq-status"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Not Registered">Not Registered</SelectItem>
                                            <SelectItem value="Under Process">Under Process</SelectItem>
                                            <SelectItem value="Registered">Registered</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="tawtheeq-reg-no">Registration No</Label>
                                    <Input id="tawtheeq-reg-no" value={contract.tawtheeqRegistrationNo || ''} onChange={(e) => handleInputChange('tawtheeqRegistrationNo', e.target.value)} disabled={!isEditing}/>
                                </div>
                                <div>
                                    <Label htmlFor="tawtheeq-reg-date">Registration Date</Label>
                                    <Input id="tawtheeq-reg-date" type="date" value={contract.tawtheeqRegistrationDate || ''} onChange={(e) => handleInputChange('tawtheeqRegistrationDate', e.target.value)} disabled={!isEditing}/>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Tenant Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <div>
                            <Label htmlFor="tenant-name">Tenant Name</Label>
                            <Combobox
                                options={lookups.tenants}
                                value={contract.tenantCode || ''}
                                onSelect={handleTenantSelect}
                                placeholder="Select a Tenant"
                                disabled={!isEditing}
                            />
                        </div>
                        <div>
                            <Label htmlFor="tenant-code">Tenant Code</Label>
                            <Input id="tenant-code" value={contract.tenantCode || ''} disabled />
                        </div>
                        <div>
                            <Label htmlFor="tenant-mobile">Tenant Mobile</Label>
                            <Input id="tenant-mobile" value={contract.mobile || ''} disabled />
                        </div>
                        <div>
                            <Label htmlFor="tenant-email">Tenant Email</Label>
                            <Input id="tenant-email" value={contract.email || ''} disabled />
                        </div>
                        <div>
                            <Label htmlFor="tenant-address">Tenant Address</Label>
                            <Input id="tenant-address" value={contract.address || ''} disabled />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
        <TabsContent value="schedule">
             <Card>
                <CardHeader>
                    <CardTitle>Payment Schedule</CardTitle>
                    <CardDescription>
                        Review or define the payment installments for this contract.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
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
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Installment</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Bank Name</TableHead>
                        <TableHead>Cheque No.</TableHead>
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
                        <Input placeholder="Bank Name" value={item.bankName || ''} onChange={(e) => handleScheduleChange(index, 'bankName', e.target.value)} disabled={!isEditing}/>
                        </TableCell>
                        <TableCell>
                        <Input placeholder="Cheque number" value={item.chequeNo || ''} onChange={(e) => handleScheduleChange(index, 'chequeNo', e.target.value)} disabled={!isEditing}/>
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
                <Button variant="outline" size="sm" className="mt-4" onClick={addInstallment} disabled={!isEditing}>
                    <Plus className="mr-2 h-4 w-4" /> Add Installment
                </Button>

                    <Separator className="my-6"/>
                    <div>
                        <Label htmlFor="terms">Terms & Conditions</Label>
                        <Textarea id="terms" rows={5} placeholder="Enter contract terms and conditions..." value={contract.terms || ''} onChange={e => handleInputChange('terms', e.target.value)} disabled={!isEditing}/>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
         <TabsContent value="termination">
            <Card>
                <CardHeader>
                    <CardTitle>Contract Termination</CardTitle>
                    <CardDescription>Record the termination details for this contract.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label>Termination Date</Label>
                            <Input type="date" value={contract.terminationDate || ''} onChange={(e) => handleInputChange('terminationDate', e.target.value)} disabled={!isEditing}/>
                        </div>
                        <div>
                            <Label>Final Settlement Amount</Label>
                            <Input type="number" placeholder="0.00" value={contract.finalSettlementAmount || ''} onChange={(e) => handleNumberInputChange('finalSettlementAmount', e.target.value)} disabled={!isEditing}/>
                        </div>
                    </div>
                    <div>
                        <Label>Reason for Termination</Label>
                        <Textarea placeholder="e.g., Early exit, mutual agreement..." value={contract.terminationReason || ''} onChange={(e) => handleInputChange('terminationReason', e.target.value)} disabled={!isEditing}/>
                    </div>
                    <p className="text-sm text-muted-foreground pt-4">
                       Note: To terminate, please set the contract status to "Cancel" in the details tab and provide a termination date above, then save the contract.
                    </p>
                </CardContent>
            </Card>
         </TabsContent>
      </Tabs>
    </div>
  );
}
