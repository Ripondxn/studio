
import { users } from './data';
import { columns } from './columns';
import { DataTable } from './data-table';
import { Button } from '@/components/ui/button';
import { FileDown, Plus } from 'lucide-react';

export default function UserRoleManagementPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold font-headline">User Role Management</h1>
            <p className="text-muted-foreground">
                Assign and manage user roles across the application.
            </p>
        </div>
        <div className="flex gap-2">
            <Button>
                <Plus className="mr-2 h-4 w-4" /> Add New User
            </Button>
        </div>
      </div>
      <DataTable columns={columns} data={users} />
    </div>
  );
}

    