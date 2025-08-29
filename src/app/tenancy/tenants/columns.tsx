
'use client';

import { useState, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Pencil, Trash2, MoreHorizontal, FileText, Repeat, FilePlus2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
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
import { deleteTenantData } from './actions';
import { Tenant } from './schema';
import { Badge } from '@/components/ui/badge';
import { useCurrency } from '@/context/currency-context';
import type { UserRole } from '@/app/admin/user-roles/schema';
import { SubscriptionInvoiceDialog } from './invoice/invoice-dialog';

const ActionsCell = ({ row }: { row: { original: Tenant } }) => {
  const tenant = row.original;
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole['role'] | null>(null);

  useEffect(() => {
    const storedProfile = sessionStorage.getItem('userProfile');
    if (storedProfile) {
        setCurrentUserRole(JSON.parse(storedProfile).role);
    }
  }, []);


  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteTenantData(tenant.code);
      if (result.success) {
        toast({
          title: 'Success',
          description: `Tenant "${tenant.name}" deleted successfully.`,
        });
        router.refresh();
      } else {
        throw new Error(result.error || 'An unknown error occurred');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: (error as Error).message || 'Failed to delete tenant.',
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              tenant "{tenant.name}" and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
            <DropdownMenuItem asChild>
              <Link href={`/tenancy/tenants/add?code=${tenant.code}`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            {currentUserRole === 'Super Admin' && (
                <DropdownMenuItem
                className="text-destructive"
                onSelect={() => setIsDeleteDialogOpen(true)}
                >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
                </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};

const CreateDocumentCell = ({ row }: { row: { original: Tenant } }) => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const tenant = row.original;

    if (tenant.isSubscriptionActive) {
        return (
            <>
                <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
                    <FilePlus2 className="mr-2 h-4 w-4" /> + Subs Invoice
                </Button>
                <SubscriptionInvoiceDialog
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    invoice={null}
                    tenant={tenant}
                    onSuccess={() => router.push(`/tenancy/tenants/add?code=${tenant.code}&tab=subscription`)}
                />
            </>
        );
    }

    return (
        <Button asChild variant="outline" size="sm">
            <Link href={`/tenancy/contract?tenantCode=${tenant.code}`}>
                <FilePlus2 className="mr-2 h-4 w-4" /> + Contract
            </Link>
        </Button>
    );
};


export const columns: ColumnDef<Tenant>[] = [
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
    accessorKey: 'code',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Code
          <ArrowUpDown className="mr-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
        const tenant = row.original;
        return (
            <Button variant="link" asChild className="p-0 h-auto font-normal">
                <Link href={`/tenancy/tenants/add?code=${tenant.code}`}>{tenant.code}</Link>
            </Button>
        )
    }
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
   {
    accessorKey: 'isSubscriptionActive',
    header: 'Tenancy Type',
    cell: ({ row }) => {
        const isSubscription = row.getValue('isSubscriptionActive');
        const type = isSubscription ? 'Subscription' : 'Contract';
        const Icon = isSubscription ? Repeat : FileText;
        return (
            <Badge variant={isSubscription ? 'secondary' : 'outline'} className="whitespace-nowrap">
                <Icon className="mr-1 h-3 w-3" />
                {type} Based
            </Badge>
        )
    }
  },
  {
    accessorKey: 'dueBalance',
    header: () => <div className="text-right">Due Balance</div>,
    cell: function Cell({ row }) {
        const { formatCurrency } = useCurrency();
        const amount = row.original.dueBalance || 0;
        const color = amount > 0 ? 'text-destructive' : 'text-muted-foreground';
        return <div className={`text-right font-medium ${color}`}>{formatCurrency(amount)}</div>;
    },
  },
  {
    accessorKey: 'mobile',
    header: 'Mobile',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'contractNo',
    header: 'Contract No',
    cell: ({ row }) => {
        const tenant = row.original;
        const contractNo = tenant.contractNo;
        const contractId = tenant.contractId;

        if (contractId && contractNo) {
            return (
                <Button variant="link" asChild className="p-0 h-auto font-normal">
                    <Link href={`/tenancy/contract?id=${contractId}`}>{contractNo}</Link>
                </Button>
            )
        }
        return <span>{contractNo || 'N/A'}</span>;
    }
  },
  {
    id: 'createDocument',
    header: 'Create Document',
    cell: CreateDocumentCell,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
