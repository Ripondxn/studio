
import { accounts } from './data';
import { columns } from './columns';
import { DataTable } from './data-table';
import { Button } from '@/components/ui/button';
import { FileDown, Plus } from 'lucide-react';

export default function ChartOfAccountsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold font-headline">Chart of Accounts</h1>
            <p className="text-muted-foreground">
                Manage your financial accounts and their structure.
            </p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline">
                <FileDown className="mr-2 h-4 w-4" /> Import Accounts
            </Button>
            <Button>
                <Plus className="mr-2 h-4 w-4" /> Add New Account
            </Button>
        </div>
      </div>
      <DataTable columns={columns} data={accounts} />
    </div>
  );
}
