
'use client';

import { useState, useEffect, useMemo } from 'react';
import { columns } from './columns';
import { DataTable } from './data-table';
import { type UtilityAccount } from './schema';
import { getAllUtilityAccounts } from './actions';
import { Button } from '@/components/ui/button';
import { Plus, FileText, FileSpreadsheet, Printer } from 'lucide-react';
import { AddUtilityAccountDialog } from './add-utility-account-dialog';
import { RecordBillDialog } from './record-bill-dialog';
import { type UserRole } from '@/app/admin/user-roles/schema';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getLookups } from '@/app/lookups/actions';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { useCurrency } from '@/context/currency-context';

export function UtilityClient({ initialAccounts }: { initialAccounts: UtilityAccount[] }) {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isBillDialogOpen, setIsBillDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<UtilityAccount | undefined>(undefined);
  const [currentUser, setCurrentUser] = useState<UserRole | null>(null);
  const [filters, setFilters] = useState({
    utilityType: '',
    provider: '',
    propertyCode: '',
    unitCode: '',
    accountNumber: '',
  });
  const [lookups, setLookups] = useState<{properties: {value: string, label: string}[], units: {value: string, label: string, propertyCode: string}[]}>({properties: [], units: []});
  const { formatCurrency } = useCurrency();

   useEffect(() => {
    const userProfile = sessionStorage.getItem('userProfile');
    if(userProfile) {
      setCurrentUser(JSON.parse(userProfile));
    }
    
    getLookups().then(data => {
        setLookups(prev => ({...prev, properties: data.properties, units: data.units}));
    });
  }, []);

  const refreshAccounts = async () => {
    const updatedAccounts = await getAllUtilityAccounts();
    setAccounts(updatedAccounts);
  };
  
  const handleEdit = (account: UtilityAccount) => {
    setSelectedAccount(account);
    setIsAddDialogOpen(true);
  };
  
  const handleRecordBill = (account: UtilityAccount) => {
    setSelectedAccount(account);
    setIsBillDialogOpen(true);
  };

  useEffect(() => {
    setAccounts(initialAccounts);
  }, [initialAccounts]);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredAccounts = useMemo(() => {
    return accounts.filter(acc => {
      return (
        (filters.utilityType ? acc.utilityType === filters.utilityType : true) &&
        (filters.provider ? acc.provider.toLowerCase().includes(filters.provider.toLowerCase()) : true) &&
        (filters.propertyCode ? acc.propertyCode === filters.propertyCode : true) &&
        (filters.unitCode ? acc.unitCode === filters.unitCode : true) &&
        (filters.accountNumber ? acc.accountNumber.toLowerCase().includes(filters.accountNumber.toLowerCase()) : true)
      );
    });
  }, [accounts, filters]);
  
  const uniqueProviders = [...new Set(accounts.map(a => a.provider).filter(Boolean))];
  const uniqueUtilityTypes = [...new Set(accounts.map(a => a.utilityType).filter(Boolean))];


  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Utility Accounts Report", 14, 16);
    (doc as any).autoTable({
        head: [['Utility', 'Provider', 'Account #', 'Property', 'Unit', 'Total Paid']],
        body: filteredAccounts.map(acc => [
            acc.utilityType,
            acc.provider,
            acc.accountNumber,
            acc.propertyCode,
            acc.unitCode || 'N/A',
            formatCurrency(acc.totalPaid || 0)
        ]),
        startY: 20,
    });
    doc.save('utility-accounts-report.pdf');
  };

  const handleExportExcel = () => {
    const dataToExport = filteredAccounts.map(acc => ({
        'Utility Type': acc.utilityType,
        'Provider': acc.provider,
        'Account Number': acc.accountNumber,
        'Property': acc.propertyCode,
        'Unit': acc.unitCode,
        'Status': acc.status,
        'Total Paid': acc.totalPaid
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Utility Accounts");
    XLSX.writeFile(wb, "utility-accounts.xlsx");
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">Utility Management</h1>
          <p className="text-muted-foreground">
            Track and manage utility accounts and their payments.
          </p>
        </div>
        <Button onClick={() => { setSelectedAccount(undefined); setIsAddDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Utility Account
        </Button>
      </div>

       <Card className="mb-6">
            <CardHeader>
                <CardTitle>Filters & Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <div className="space-y-2">
                        <Label>Utility Type</Label>
                        <Select value={filters.utilityType} onValueChange={(value) => handleFilterChange('utilityType', value)}>
                            <SelectTrigger><SelectValue placeholder="All Types"/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All Types</SelectItem>
                                {uniqueUtilityTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label>Provider</Label>
                        <Select value={filters.provider} onValueChange={(value) => handleFilterChange('provider', value)}>
                            <SelectTrigger><SelectValue placeholder="All Providers"/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All Providers</SelectItem>
                                {uniqueProviders.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Property</Label>
                         <Select value={filters.propertyCode} onValueChange={(value) => handleFilterChange('propertyCode', value)}>
                            <SelectTrigger><SelectValue placeholder="All Properties"/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All Properties</SelectItem>
                                {lookups.properties.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Unit</Label>
                         <Select value={filters.unitCode} onValueChange={(value) => handleFilterChange('unitCode', value)} disabled={!filters.propertyCode}>
                            <SelectTrigger><SelectValue placeholder="All Units"/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All Units</SelectItem>
                                {lookups.units.filter(u => u.propertyCode === filters.propertyCode).map(u => <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Account Number</Label>
                        <Input placeholder="Filter by account..." value={filters.accountNumber} onChange={e => handleFilterChange('accountNumber', e.target.value)} />
                    </div>
                 </div>
                 <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button variant="outline" size="sm" onClick={handleExportPDF}><FileText className="mr-2 h-4 w-4" /> PDF</Button>
                    <Button variant="outline" size="sm" onClick={handleExportExcel}><FileSpreadsheet className="mr-2 h-4 w-4" /> Excel</Button>
                 </div>
            </CardContent>
        </Card>

      <DataTable columns={columns({ onEdit: handleEdit, onRecordBill: handleRecordBill })} data={filteredAccounts} />
      <AddUtilityAccountDialog 
        isOpen={isAddDialogOpen} 
        setIsOpen={setIsAddDialogOpen}
        onSuccess={refreshAccounts}
        account={selectedAccount}
        currentUser={currentUser}
      />
      {selectedAccount && (
         <RecordBillDialog
            isOpen={isBillDialogOpen}
            setIsOpen={setIsBillDialogOpen}
            onSuccess={refreshAccounts}
            account={selectedAccount}
        />
      )}
    </div>
  );
}
