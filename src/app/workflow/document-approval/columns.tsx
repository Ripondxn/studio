
'use client';

import { useState, useEffect, useRef } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { MoreHorizontal, CheckCircle, Clock, XCircle, File, Eye, MessageSquare, PlusCircle, History, User, Shield, UserCheck, Trash2, Printer } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
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
import { useRouter } from 'next/navigation';
import { type DocumentForApproval, type ApprovalHistory } from './schema';
import { type Role, type Status } from '../types';
import { approveDocument, rejectDocument, addCommentToDocument, deleteDocument } from './actions';
import { ActionDialog } from './action-dialog';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/app/admin/user-roles/schema';


const statusConfig: {
  [key in Status]: { label: string; color: string; icon: React.ReactNode };
} = {
  DRAFT: { label: 'Draft', color: 'bg-gray-500/20 text-gray-700', icon: <File className="h-3 w-3" /> },
  PENDING_ADMIN_APPROVAL: { label: 'Pending Admin Approval', color: 'bg-yellow-500/20 text-yellow-700', icon: <Clock className="h-3 w-3" /> },
  PENDING_SUPER_ADMIN_APPROVAL: { label: 'Pending Super Admin Approval', color: 'bg-blue-500/20 text-blue-700', icon: <Clock className="h-3 w-3" /> },
  POSTED: { label: 'Approved', color: 'bg-green-500/20 text-green-700', icon: <CheckCircle className="h-3 w-3" /> },
  REJECTED: { label: 'Rejected', color: 'bg-red-500/20 text-red-700', icon: <XCircle className="h-3 w-3" /> },
};

const roleIcons: { [key in Role]: React.ReactNode } = {
  'User': <User className="h-5 w-5" />,
  'Admin': <Shield className="h-5 w-5" />,
  'Super Admin': <UserCheck className="h-5 w-5" />,
  'Property Manager': <User className="h-5 w-5" />,
  'Accountant': <User className="h-5 w-5" />,
  'Developer': <User className="h-5 w-5" />,
};


const ViewHistoryDialog = ({ history, documentId }: { history: ApprovalHistory[], documentId: string }) => {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        const printContent = printRef.current?.innerHTML;
        if (printContent) {
            const printWindow = window.open('', '', 'height=600,width=800');
            if (printWindow) {
                printWindow.document.write('<html><head><title>Approval History</title>');
                printWindow.document.write('<style>body { font-family: sans-serif; } ul { list-style-type: none; padding: 0; } li { margin-bottom: 1rem; } .no-print { display: none !important; } </style>');
                printWindow.document.write('</head><body>');
                printWindow.document.write(`<h1>Approval History for: ${documentId}</h1>`);
                printWindow.document.write(printContent);
                printWindow.document.write('</body></html>');
                printWindow.document.close();
                printWindow.print();
            }
        }
    };

    return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Approval History for: {documentId}</DialogTitle>
      </DialogHeader>
      <div className="mt-4 max-h-[60vh] overflow-y-auto" ref={printRef}>
        <ul className="space-y-4">
          {history.map((item, index) => (
            <li key={index} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground no-print">
                  {roleIcons[item.actorRole as Role] || <CheckCircle className="h-4 w-4" />}
                </div>
                {index < history.length - 1 && (
                  <div className="w-px flex-grow bg-border" />
                )}
              </div>
              <div className="flex-1 pb-4">
                <p className="font-semibold">{item.action}</p>
                <p className="text-sm text-muted-foreground">
                  by {item.actorId} ({item.actorRole})
                </p>
                <p className="text-xs text-muted-foreground">
                   {format(new Date(item.timestamp), "PPP p")}
                </p>
                {item.comments && (
                  <div className="mt-2 rounded-md border bg-muted p-2 text-sm flex gap-2">
                    <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <p className="flex-1 italic">"{item.comments}"</p>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
       <DialogFooter>
            <Button variant="outline" onClick={handlePrint} className="no-print">
                <Printer className="mr-2 h-4 w-4"/> Print
            </Button>
            <DialogClose asChild>
                <Button className="no-print">Close</Button>
            </DialogClose>
        </DialogFooter>
    </DialogContent>
  );
};


export const columns = ({ currentUser, onUpdate }: { currentUser: { name: string, role: Role }, onUpdate: () => void }): ColumnDef<DocumentForApproval>[] => {

    const ActionsCell = ({ row }: { row: { original: DocumentForApproval } }) => {
        const doc = row.original;
        const [isHistoryOpen, setIsHistoryOpen] = useState(false);
        const [isActionOpen, setIsActionOpen] = useState(false);
        const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
        const [currentAction, setCurrentAction] = useState<'APPROVE' | 'REJECT' | 'ADD_COMMENT' | null>(null);
        const [isProcessing, setIsProcessing] = useState(false);
        const { toast } = useToast();

        const canApprove = (
            (currentUser.role === 'Admin' && doc.currentStatus === 'PENDING_ADMIN_APPROVAL') ||
            (currentUser.role === 'Super Admin' && doc.currentStatus === 'PENDING_SUPER_ADMIN_APPROVAL')
        );

        const canReject = (
            (currentUser.role === 'Admin' && doc.currentStatus === 'PENDING_ADMIN_APPROVAL') ||
            (currentUser.role === 'Super Admin' && doc.currentStatus === 'PENDING_SUPER_ADMIN_APPROVAL')
        );
        
        const canDelete = currentUser.role === 'Super Admin';

        const handleAction = async (comment: string) => {
            if (!currentAction) return;

            setIsProcessing(true);
            let result;
            const params = {
                documentId: doc.id,
                actorId: currentUser.name,
                actorRole: currentUser.role,
                comment,
            };

            if (currentAction === 'APPROVE') result = await approveDocument(params);
            else if (currentAction === 'REJECT') result = await rejectDocument(params);
            else if (currentAction === 'ADD_COMMENT') result = await addCommentToDocument(params);

            if (result?.success) {
                toast({ title: 'Success', description: `Action performed successfully.` });
                onUpdate();
            } else {
                toast({ variant: 'destructive', title: 'Error', description: result?.error });
            }
            
            setIsProcessing(false);
            setIsActionOpen(false);
            setCurrentAction(null);
        };
        
        const handleDelete = async () => {
            setIsProcessing(true);
            const result = await deleteDocument(doc.id);
            if (result.success) {
                toast({ title: 'Document Deleted', description: 'The document has been removed from the workflow.'});
                onUpdate();
            } else {
                toast({ variant: 'destructive', title: 'Error', description: result.error });
            }
            setIsProcessing(false);
            setIsDeleteDialogOpen(false);
        }
        

        return (
            <>
                <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
                    <DialogTrigger asChild>
                         <Button variant="ghost" size="sm">
                            <History className="mr-2 h-4 w-4"/> View
                         </Button>
                    </DialogTrigger>
                    <ViewHistoryDialog history={doc.approvalHistory} documentId={doc.id} />
                </Dialog>
                
                 <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete document "{doc.referenceNo}". This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} disabled={isProcessing} className="bg-destructive hover:bg-destructive/90">
                                {isProcessing ? 'Deleting...' : 'Delete'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                
                {currentAction && <ActionDialog
                    isOpen={isActionOpen}
                    setIsOpen={setIsActionOpen}
                    actionType={currentAction}
                    onConfirm={handleAction}
                    isProcessing={isProcessing}
                />}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4"/></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {canApprove && (
                            <DropdownMenuItem onSelect={() => {setCurrentAction('APPROVE'); setIsActionOpen(true); }}>
                                Approve
                            </DropdownMenuItem>
                        )}
                         {canReject && (
                            <DropdownMenuItem onSelect={() => {setCurrentAction('REJECT'); setIsActionOpen(true); }} className="text-destructive">
                                Reject
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onSelect={() => {setCurrentAction('ADD_COMMENT'); setIsActionOpen(true);}}>
                             <PlusCircle className="mr-2 h-4 w-4" /> Add Comment
                        </DropdownMenuItem>
                         {canDelete && (
                            <>
                             <DropdownMenuSeparator />
                             <DropdownMenuItem className="text-destructive" onSelect={() => setIsDeleteDialogOpen(true)}>
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </>
        )
    }

    return [
    {
        accessorKey: 'docType',
        header: 'Document Type',
    },
    {
        accessorKey: 'referenceNo',
        header: 'Reference No',
    },
    {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }) => format(new Date(row.original.date), 'PP')
    },
    {
        accessorKey: 'submittedBy',
        header: 'Submitted By',
    },
    {
        accessorKey: 'currentStatus',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.original.currentStatus;
            const config = statusConfig[status];
            return <Badge variant={'outline'} className={cn('gap-1 font-medium', config.color, 'border-transparent')}>{config.icon} {config.label}</Badge>;
        }
    },
    {
        id: 'actions',
        cell: ActionsCell,
    }
    ];
};
