
import { getUsers } from './actions';
import { columns } from './columns';
import { DataTable } from './data-table';
import { AddUserDialog } from './add-user-dialog';


export default async function UserRoleManagementPage() {
  const users = await getUsers();

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
            <AddUserDialog />
        </div>
      </div>
      <DataTable columns={columns} data={users} />
    </div>
  );
}
