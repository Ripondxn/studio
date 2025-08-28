
'use client';

import { useState, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2, ShieldQuestion, UserPlus, Code } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { deleteUser } from './actions';
import { EditUserDialog } from './edit-user-dialog';

import { UserRole } from './schema';

const roleVariantMap: { [key in UserRole['role']]: "default" | "secondary" | "destructive" | "outline" } = {
    'Super Admin': 'destructive',
    'Admin': 'default',
    'User': 'secondary',
    'Property Manager': 'outline',
    'Accountant': 'outline',
    'Developer': 'default'
};

const ActionsCell = ({ row }: { row: { original: UserRole } }) => {
    const user = row.original;
    const router = useRouter();
    const { toast } = useToast();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        const result = await deleteUser(user.id);
        if (result.success) {
            toast({
                title: 'User Deleted',
                description: `User "${user.name}" has been deleted.`,
            });
            router.refresh();
        } else {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: result.error,
            });
        }
        setIsDeleting(false);
        setIsDeleteDialogOpen(false);
    };

    return (
        <>
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the user "{user.name}".
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            
            <EditUserDialog 
              user={user} 
              isOpen={isEditDialogOpen} 
              setIsOpen={setIsEditDialogOpen}
            />

            <div className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onSelect={() => setIsEditDialogOpen(true)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setIsEditDialogOpen(true)}>
                            <ShieldQuestion className="mr-2 h-4 w-4" />
                            Change Role
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => setIsDeleteDialogOpen(true)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </>
    );
};

const DateCell = ({ dateString, prefix }: { dateString?: string; prefix: string; }) => {
    const [formattedDate, setFormattedDate] = useState('');

    useEffect(() => {
        if(!dateString) {
            setFormattedDate('N/A');
            return;
        }
        try {
            setFormattedDate(`${prefix} ${formatDistanceToNow(new Date(dateString), { addSuffix: true })}`);
        } catch (e) {
            setFormattedDate('Invalid Date');
        }
    }, [dateString, prefix]);

    return <span className="text-xs text-muted-foreground">{formattedDate}</span>
}


export const columns: ColumnDef<UserRole>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
        const user = row.original;
        return (
            <div className="flex flex-col">
                <span className="font-medium">{user.name}</span>
                <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
        )
    }
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
        const role = row.getValue('role') as UserRole['role'];
        if (role === 'Developer') {
            return <Badge variant="destructive" className="bg-purple-600 hover:bg-purple-700"><Code className="mr-1 h-3 w-3"/>{role}</Badge>;
        }
        return <Badge variant={roleVariantMap[role]}>{role}</Badge>;
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const variant = status === 'Active' ? 'default' : 'secondary';
      return <Badge variant={variant} className={status === 'Active' ? 'bg-green-500/20 text-green-700 border-transparent' : ''}>{status}</Badge>;
    },
  },
  {
    accessorKey: 'lastLogin',
    header: 'Last Login',
    cell: ({ row }) => <DateCell dateString={row.original.lastLogin} prefix="Last login" />
  },
  {
    accessorKey: 'createdBy',
    header: 'Audit Trail',
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex flex-col items-start text-xs">
          <span className="flex items-center gap-1">
            <UserPlus className="h-3 w-3" />
            Created by <strong>{user.createdBy || 'System'}</strong> <DateCell dateString={user.createdAt} prefix="" />
          </span>
           {user.modifiedBy && (
            <span className="flex items-center gap-1 mt-1">
              <Pencil className="h-3 w-3" />
              Modified by <strong>{user.modifiedBy}</strong> <DateCell dateString={user.modifiedAt} prefix="" />
            </span>
           )}
        </div>
      )
    }
  },
  {
    id: 'actions',
    cell: ActionsCell,
  },
];
