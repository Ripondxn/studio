
'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Pencil, Trash2, MoreHorizontal, Paperclip, Link as LinkIcon, File } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { deleteVendorData } from './actions';
import { Vendor } from './schema';

const ActionsCell = ({ row }: { row: { original: Vendor } }) => {
  const vendor = row.original;
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteVendorData(vendor.code);
      if (result.success) {
        toast({
          title: 'Success',
          description: `Vendor "${vendor.name}" deleted successfully.`,
        });
        router.refresh();
      } else {
        throw new Error(result.error || 'An unknown error occurred');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: (error as Error).message || 'Failed to delete vendor.',
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
              vendor "{vendor.name}" and all associated data.
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
              <Link href={`/vendors/add?code=${vendor.code}`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onSelect={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};

type Attachment = {
  id: number;
  name: string;
  file: string | null;
  remarks: string;
  isLink: boolean;
};

const AttachmentsCell = ({ row }: { row: { original: Vendor } }) => {
    const vendor = row.original;
    const attachments: Attachment[] = vendor.attachments || [];

    if (attachments.length === 0) {
        return <span className="text-muted-foreground text-xs">No attachments</span>;
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Paperclip className="h-4 w-4" />
                    <span>{attachments.length}</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Attachments for {vendor.name}</DialogTitle>
                    <DialogDescription>
                        List of all attached files and links.
                    </DialogDescription>
                </DialogHeader>
                <div className="max-h-80 overflow-y-auto">
                    <ul className="space-y-2">
                       {attachments.map(att => (
                           <li key={att.id} className="flex items-center justify-between p-2 border rounded-md">
                               <div className="flex items-center gap-3">
                                   {att.isLink ? <LinkIcon className="h-5 w-5 text-primary"/> : <File className="h-5 w-5 text-primary"/>}
                                   <div className="flex flex-col">
                                     <span className="font-medium">{att.name}</span>
                                     <span className="text-xs text-muted-foreground">{att.remarks}</span>
                                   </div>
                               </div>
                                {att.isLink && typeof att.file === 'string' ? (
                                    <Button variant="link" asChild size="sm">
                                        <a href={att.file} target="_blank" rel="noopener noreferrer">View Link</a>
                                    </Button>
                                ) : (
                                    <span className="text-sm text-muted-foreground italic">File</span>
                                )}
                           </li>
                       ))}
                    </ul>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export const columns: ColumnDef<Vendor>[] = [
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
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'name',
    header: 'Name',
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
    accessorKey: 'bankName',
    header: 'Bank',
  },
   {
    id: 'attachments',
    header: 'Attachments',
    cell: ({ row }) => <AttachmentsCell row={row} />,
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
