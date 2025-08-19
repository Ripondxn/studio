
'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  File,
  User,
  Shield,
  UserCheck,
  MoreVertical,
  Check,
  X,
  History,
  Send,
  Calendar,
  DollarSign,
  Info,
  FileText,
  FileSpreadsheet,
  MessageSquare,
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { type Transaction, type Role, type Status, type ApprovalHistory } from './types';
import { transactions as initialTransactions } from './data';
import { format } from 'date-fns';
import { type UserRole } from '@/app/admin/user-roles/schema';
import { useRouter } from 'next/navigation';


// Extend jsPDF type to include autoTable from the plugin
declare module 'jspdf' {
    interface jsPDF {
      autoTable: (options: any) => jsPDF;
    }
}


const statusConfig: {
  [key in Status]: {
    label: string;
    color:
      | 'default'
      | 'secondary'
      | 'destructive'
      | 'outline';
    icon: React.ReactNode;
  };
} = {
  DRAFT: { label: 'Draft', color: 'secondary', icon: <File className="h-4 w-4" /> },
  PENDING_ADMIN_APPROVAL: {
    label: 'Pending Admin Approval',
    color: 'default',
    icon: <History className="h-4 w-4" />,
  },
  PENDING_SUPER_ADMIN_APPROVAL: {
    label: 'Pending Super Admin Approval',
    color: 'default',
    icon: <History className="h-4 w-4" />,
  },
  POSTED: { label: 'Posted', color: 'outline', icon: <Check className="h-4 w-4" /> },
  REJECTED: { label: 'Rejected', color: 'destructive', icon: <X className="h-4 w-4" /> },
};

const roleIcons: { [key in Role]: React.ReactNode } = {
  USER: <User className="h-5 w-5" />,
  ADMIN: <Shield className="h-5 w-5" />,
  SUPER_ADMIN: <UserCheck className="h-5 w-5" />,
  User: <User className="h-5 w-5" />,
  Admin: <Shield className="h-5 w-5" />,
  'Super Admin': <UserCheck className="h-5 w-5" />,
  'Property Manager': <User className="h-5 w-5" />,
  Accountant: <User className="h-5 w-5" />,
};

const ApprovalHistoryDialog = ({ history, transactionId }: { history: ApprovalHistory[], transactionId: string }) => {
  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Approval History for: {transactionId}</DialogTitle>
      </DialogHeader>
      <div className="mt-4 max-h-[60vh] overflow-y-auto">
        <ul className="space-y-4">
          {history.map((item, index) => (
            <li key={index} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  {roleIcons[item.actorRole]}
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
    </DialogContent>
  );
};

const TransactionDetailsDialog = ({ transaction }: { transaction: Transaction }) => {
    const statusInfo = statusConfig[transaction.currentStatus];
    return (
        <DialogContent className="max-w-lg">
            <DialogHeader>
                <DialogTitle>Transaction Details</DialogTitle>
                <DialogDescription>
                    Complete details for transaction ID: {transaction.id}
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                       <DollarSign className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Amount</p>
                        <p className="text-2xl font-bold">${transaction.amount.toLocaleString()}</p>
                    </div>
                     <div className="ml-auto flex items-center gap-2 text-sm font-medium">
                       {statusInfo.icon}
                       {statusInfo.label}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Type:</span>
                        <span>{transaction.type}</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Created By:</span>
                        <span>{transaction.createdByUser.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Date Created:</span>
                        <span>{format(new Date(transaction.dateCreated), 'PP')}</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Date Submitted:</span>
                        <span>{format(new Date(transaction.submittedForApprovalDate), 'PP')}</span>
                    </div>
                </div>
            </div>
        </DialogContent>
    );
};

type ActionDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onConfirm: (comment: string) => void;
  actionType: 'SUBMIT' | 'APPROVE' | 'REJECT';
}

const ActionDialog = ({ isOpen, setIsOpen, onConfirm, actionType }: ActionDialogProps) => {
    const [comment, setComment] = useState('');

    const titleMap = {
        SUBMIT: 'Submit Transaction',
        APPROVE: 'Approve Transaction',
        REJECT: 'Reject Transaction'
    }

    const descriptionMap = {
        SUBMIT: 'Please provide a comment for submitting this transaction.',
        APPROVE: 'Please provide a comment for approving this transaction.',
        REJECT: 'Please provide the reason for rejecting this transaction.'
    }

    const handleConfirm = () => {
        onConfirm(comment);
        setIsOpen(false);
        setComment('');
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{titleMap[actionType]}</DialogTitle>
                     <DialogDescription>{descriptionMap[actionType]}</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Label htmlFor="comment">Comment</Label>
                    <Textarea 
                        id="comment" 
                        value={comment} 
                        onChange={(e) => setComment(e.target.value)} 
                        placeholder="Add your comment here..."
                    />
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleConfirm}>
                        {actionType === 'REJECT' ? 'Confirm Rejection' : 'Confirm'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


export default function WorkflowPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole['role']>('User');
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<Status | 'ALL'>('ALL');
  const router = useRouter();

  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [currentActionInfo, setCurrentActionInfo] = useState<{
    transactionId: string;
    action: 'SUBMIT' | 'APPROVE' | 'REJECT';
  } | null>(null);


  useEffect(() => {
    const storedProfile = sessionStorage.getItem('userProfile');
    if (storedProfile) {
      const profile = JSON.parse(storedProfile);
      setCurrentUserRole(profile.role || 'User');
      setCurrentUserEmail(profile.email || '');
    } else {
      router.push('/login');
    }
  }, [router]);


  const handleAction = (
    transactionId: string,
    action: 'SUBMIT' | 'APPROVE' | 'REJECT',
    comment: string
  ) => {
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id !== transactionId) return t;

        let newStatus: Status = t.currentStatus;
        let historyAction = '';
        
        switch (action) {
          case 'SUBMIT':
            if(t.currentStatus === 'DRAFT' || t.currentStatus === 'REJECTED'){
              newStatus = 'PENDING_ADMIN_APPROVAL';
              historyAction = 'Submitted for Approval';
            }
            break;
          case 'APPROVE':
            if (t.currentStatus === 'PENDING_ADMIN_APPROVAL' && currentUserRole === 'Admin') {
              newStatus = 'PENDING_SUPER_ADMIN_APPROVAL';
              historyAction = 'Approved by Admin';
            } else if (t.currentStatus === 'PENDING_SUPER_ADMIN_APPROVAL' && currentUserRole === 'Super Admin') {
              newStatus = 'POSTED';
              historyAction = 'Final Approval & Posted';
            }
            break;
          case 'REJECT':
             if (t.currentStatus === 'PENDING_ADMIN_APPROVAL' && currentUserRole === 'Admin') {
                newStatus = 'REJECTED';
                historyAction = 'Rejected by Admin';
            } else if (t.currentStatus === 'PENDING_SUPER_ADMIN_APPROVAL' && currentUserRole === 'Super Admin') {
                newStatus = 'REJECTED';
                historyAction = 'Rejected by Super Admin';
            }
            break;
        }

        if(historyAction){
           return {
            ...t,
            currentStatus: newStatus,
            approvalHistory: [
              ...t.approvalHistory,
              {
                action: historyAction,
                actorId: currentUserEmail,
                actorRole: currentUserRole,
                timestamp: new Date().toISOString(),
                comments: comment,
              },
            ],
          };
        }
        return t;

      })
    );
  };
  
  const openActionDialog = (transactionId: string, action: 'SUBMIT' | 'APPROVE' | 'REJECT') => {
    setCurrentActionInfo({ transactionId, action });
    setIsActionDialogOpen(true);
  }

  const confirmAction = (comment: string) => {
    if (currentActionInfo) {
      handleAction(currentActionInfo.transactionId, currentActionInfo.action, comment);
    }
  }


  const filteredTransactions = useMemo(() => {
    let roleFiltered = transactions;

    if (statusFilter === 'ALL') {
      return roleFiltered;
    }
    return roleFiltered.filter(t => t.currentStatus === statusFilter);

  }, [transactions, statusFilter]);


  const getActionButtons = (transaction: Transaction) => {
    const canSubmitRoles: Role[] = ['User', 'Property Manager', 'Accountant', 'Admin', 'Super Admin'];

    if (canSubmitRoles.includes(currentUserRole) && (transaction.currentStatus === 'DRAFT' || transaction.currentStatus === 'REJECTED')) {
      return (
        <Button size="sm" onClick={() => openActionDialog(transaction.id, 'SUBMIT')}>
          <Send className="mr-2 h-4 w-4" /> Submit
        </Button>
      );
    }
    
    if (currentUserRole === 'Admin' && transaction.currentStatus === 'PENDING_ADMIN_APPROVAL') {
      return (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => openActionDialog(transaction.id, 'APPROVE')}>
            <Check className="mr-2 h-4 w-4" /> Approve
          </Button>
          <Button size="sm" variant="destructive" onClick={() => openActionDialog(transaction.id, 'REJECT')}>
            <X className="mr-2 h-4 w-4" /> Reject
          </Button>
        </div>
      );
    }
    
    if (currentUserRole === 'Super Admin' && transaction.currentStatus === 'PENDING_SUPER_ADMIN_APPROVAL') {
      return (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => openActionDialog(transaction.id, 'APPROVE')}>
            <Check className="mr-2 h-4 w-4" /> Approve & Post
          </Button>
          <Button size="sm" variant="destructive" onClick={() => openActionDialog(transaction.id, 'REJECT')}>
            <X className="mr-2 h-4 w-4" /> Reject
          </Button>
        </div>
      );
    }
    
    return null;
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Document Approval Report", 14, 16);
    
    const head = [['Transaction ID', 'Type', 'Amount', 'Created By', 'Submission Date', 'Status']];
    const body = filteredTransactions.map(t => [
        t.id,
        t.type,
        `$${t.amount.toLocaleString()}`,
        t.createdByUser.name,
        format(new Date(t.submittedForApprovalDate), 'PP'),
        statusConfig[t.currentStatus].label
    ]);
    
    doc.autoTable({
        head: head,
        body: body,
        startY: 20,
    });
    
    doc.save('document-flow-report.pdf');
  };

  const handleExportExcel = () => {
    const dataToExport = filteredTransactions.map(t => ({
        'Transaction ID': t.id,
        'Type': t.type,
        'Amount': t.amount,
        'Created By': t.createdByUser.name,
        'Submission Date': format(new Date(t.submittedForApprovalDate), 'PP'),
        'Status': statusConfig[t.currentStatus].label
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Document Flow");
    XLSX.writeFile(wb, "document-flow-report.xlsx");
  };
  

  return (
    <div className="container mx-auto py-10">
     {currentActionInfo && (
        <ActionDialog 
            isOpen={isActionDialogOpen}
            setIsOpen={setIsActionDialogOpen}
            actionType={currentActionInfo.action}
            onConfirm={confirmAction}
        />
     )}
      <Card>
        <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="font-headline text-2xl">
                        Document Approval Controller
                    </CardTitle>
                    <CardDescription>
                        Manage and track financial transactions through the approval
                        workflow.
                    </CardDescription>
                </div>
                 <div className="flex items-center gap-4">
                    <div className="w-[180px]">
                        <Label>Filter by Status</Label>
                        <Select
                            value={statusFilter}
                            onValueChange={(value: Status | 'ALL') => setStatusFilter(value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Statuses</SelectItem>
                                {Object.keys(statusConfig).map(status => (
                                    <SelectItem key={status} value={status}>
                                        {statusConfig[status as Status].label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex gap-2 border-l pl-4">
                        <Button variant="outline" size="sm" onClick={handleExportPDF}>
                            <FileText className="mr-2 h-4 w-4" /> Export PDF
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleExportExcel}>
                            <FileSpreadsheet className="mr-2 h-4 w-4" /> Export Excel
                        </Button>
                    </div>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <div className="mb-4">
               <p className="text-sm text-muted-foreground p-2 bg-muted/50 rounded-md">
                Viewing as a{' '}
                <span className="font-bold text-primary">{currentUserRole}</span>. This
                dashboard shows transactions relevant to your role.
              </p>
            </div>

            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Submission Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-mono text-xs">{t.id}</TableCell>
                      <TableCell>{t.type}</TableCell>
                      <TableCell className="font-medium">
                        ${t.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>{t.createdByUser.name}</TableCell>
                      <TableCell>
                        {format(new Date(t.submittedForApprovalDate), 'PP')}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusConfig[t.currentStatus].color}>
                          {statusConfig[t.currentStatus].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                             {getActionButtons(t)}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                            <File className="mr-2 h-4 w-4" />
                                            View Details
                                        </DropdownMenuItem>
                                    </DialogTrigger>
                                    <TransactionDetailsDialog transaction={t} />
                                </Dialog>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                            <History className="mr-2 h-4 w-4" />
                                            View History
                                        </DropdownMenuItem>
                                    </DialogTrigger>
                                     <ApprovalHistoryDialog history={t.approvalHistory} transactionId={t.id}/>
                                </Dialog>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No transactions match the current filter.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
