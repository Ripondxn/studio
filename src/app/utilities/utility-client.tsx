
'use client';

import { useState, useEffect } from 'react';
import { columns } from './columns';
import { DataTable } from './data-table';
import { type UtilityAccount } from './schema';
import { getAllUtilityAccounts } from './actions';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AddUtilityAccountDialog } from './add-utility-account-dialog';
import { RecordBillDialog } from './record-bill-dialog';
import { type UserRole } from '@/app/admin/user-roles/schema';

export function UtilityClient({ initialAccounts }: { initialAccounts: UtilityAccount[] }) {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isBillDialogOpen, setIsBillDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<UtilityAccount | undefined>(undefined);
  const [currentUser, setCurrentUser] = useState<UserRole | null>(null);

   useEffect(() => {
    const userProfile = sessionStorage.getItem('userProfile');
    if(userProfile) {
      setCurrentUser(JSON.parse(userProfile));
    }
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
      <DataTable columns={columns({ onEdit: handleEdit, onRecordBill: handleRecordBill })} data={accounts} />
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
