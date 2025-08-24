
'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import * as React from 'react';
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
  Calendar as CalendarIcon,
  DollarSign,
  Info,
  FileText,
  FileSpreadsheet,
  MessageSquare,
  PlusCircle,
  Loader2,
  Printer,
  Columns
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
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { type Role, type Status } from './types';
import { format, isAfter, isBefore, parseISO } from 'date-fns';
import { type UserRole } from '@/app/admin/user-roles/schema';
import { useRouter } from 'next/navigation';
import { getPayments, getPartyNameLookups } from '@/app/finance/payment/actions';
import { type Payment, type ApprovalHistory } from '@/app/finance/payment/schema';
import { cn } from '@/lib/utils';
import { PrintableReport } from './printable-report';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { approveTransaction, rejectTransaction, submitTransaction, addCommentToTransaction } from './actions';


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
                  {roleIcons[item.actorRole as Role]}
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

const TransactionDetailsDialog = ({ transaction }: { transaction: Payment }) => {
    const statusInfo = transaction.currentStatus ? statusConfig[transaction.currentStatus] : statusConfig.DRAFT;
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
                        <span>{transaction.createdByUser}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Date Created:</span>
                        <span>{format(new Date(transaction.date), 'PP')}</span>
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
  actionType: 'SUBMIT' | 'APPROVE' | 'REJECT' | 'ADD_COMMENT';
  isProcessing: boolean;
}

const ActionDialog = ({ isOpen, setIsOpen, onConfirm, actionType, isProcessing }: ActionDialogProps) => {
    const [comment, setComment] = useState('');

    const titleMap = {
        SUBMIT: 'Submit Transaction',
        APPROVE: 'Approve Transaction',
        REJECT: 'Reject Transaction',
        ADD_COMMENT: 'Add a Comment'
    }

    const descriptionMap = {
        SUBMIT: 'Please provide a comment for submitting this transaction.',
        APPROVE: 'Please provide a comment for approving this transaction.',
        REJECT: 'Please provide the reason for rejecting this transaction.',
        ADD_COMMENT: 'Please enter your comment below. It will be added to the transaction history.'
    }

    const handleConfirm = () => {
        onConfirm(comment);
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
                        <Button variant="outline" disabled={isProcessing}>Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleConfirm} disabled={isProcessing}>
                        {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                        {actionType === 'REJECT' ? 'Confirm Rejection' : 'Confirm'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const defaultColumnVisibility = {
    'id': true,
    'type': true,
    'partyName': true,
    'property': true,
    'unitCode': true,
    'roomCode': false,
    'referenceNo': true,
    'amount': true,
    'createdByUser': false,
    'date': true,
    'currentStatus': true,
};

type ColumnId = keyof typeof defaultColumnVisibility;

export default function WorkflowPage() {
  const [transactions, setTransactions] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionProcessing, setIsActionProcessing] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ email: string, role: UserRole['role'] } | null>(null);

  const [statusFilter, setStatusFilter] = useState<Status | 'ALL'>('ALL');
  const [userFilter, setUserFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<{ from?: Date; to?: Date }>({});
  const [partyNameLookups, setPartyNameLookups] = useState<Record<string, string>>({});
  const [columnVisibility, setColumnVisibility] = useState<Record<ColumnId, boolean>>(defaultColumnVisibility);

  const router = useRouter();
  const printableRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [currentActionInfo, setCurrentActionInfo] = useState<{
    transactionId: string;
    action: 'SUBMIT' | 'APPROVE' | 'REJECT' | 'ADD_COMMENT';
  } | null>(null);

  const fetchData = React.useCallback(async (user: { email: string, role: UserRole['role'] }) => {
    setIsLoading(true);
    const [payments, lookups] = await Promise.all([
        getPayments(user),
        getPartyNameLookups()
    ]);
    setTransactions(payments);
    setPartyNameLookups(lookups);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const storedProfile = sessionStorage.getItem('userProfile');
    if (storedProfile) {
      const profile = JSON.parse(storedProfile);
      setCurrentUser(profile);
      fetchData(profile);
    } else {
      router.push('/login');
    }
  }, [router, fetchData]);


  const handleAction = async (
    transactionId: string,
    action: 'SUBMIT' | 'APPROVE' | 'REJECT' | 'ADD_COMMENT',
    comment: string
  ) => {
    if (!currentUser) return;
    setIsActionProcessing(true);
    let result;

    const params = {
      transactionId,
      actorId: currentUser.email,
      actorRole: currentUser.role,
      comment
    };

    switch (action) {
      case 'SUBMIT':
        result = await submitTransaction(params);
        break;
      case 'APPROVE':
        result = await approveTransaction(params);
        break;
      case 'REJECT':
        result = await rejectTransaction(params);
        break;
      case 'ADD_COMMENT':
        result = await addCommentToTransaction(params);
        break;
    }

    if (result.success) {
      toast({ title: 'Success', description: `Action "${action}" performed successfully.` });
      await fetchData(currentUser); // Re-fetch data to get the latest state from server
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setIsActionProcessing(false);
    setIsActionDialogOpen(false);
  };
  
  const openActionDialog = (transactionId: string, action: 'SUBMIT' | 'APPROVE' | 'REJECT' | 'ADD_COMMENT') => {
    setCurrentActionInfo({ transactionId, action });
    setIsActionDialogOpen(true);
  }

  const confirmAction = (comment: string) => {
    if (currentActionInfo) {
      handleAction(currentActionInfo.transactionId, currentActionInfo.action, comment);
    }
  }


  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
        if (statusFilter !== 'ALL' && t.currentStatus !== statusFilter) return false;
        if (userFilter && t.createdByUser?.toLowerCase() !== userFilter.toLowerCase()) return false;
        if (dateFilter.from && isBefore(parseISO(t.date), dateFilter.from)) return false;
        if (dateFilter.to && isAfter(parseISO(t.date), dateFilter.to)) return false;
        return true;
    });
  }, [transactions, statusFilter, userFilter, dateFilter]);
  
  const uniqueUsers = useMemo(() => {
    const users = new Set(transactions.map(t => t.createdByUser).filter(Boolean));
    return Array.from(users);
  }, [transactions]);


  const getActionButtons = (transaction: Payment) => {
    if (!currentUser) return null;
    const canSubmitRoles: Role[] = ['User', 'Property Manager', 'Accountant', 'Admin', 'Super Admin'];

    if (canSubmitRoles.includes(currentUser.role) && (transaction.currentStatus === 'DRAFT' || transaction.currentStatus === 'REJECTED')) {
      return (
        <Button size="sm" onClick={() => openActionDialog(transaction.id!, 'SUBMIT')}>
          <Send className="mr-2 h-4 w-4" /> Submit
        </Button>
      );
    }
    
    if (currentUser.role === 'Admin' && transaction.currentStatus === 'PENDING_ADMIN_APPROVAL') {
      return (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => openActionDialog(transaction.id!, 'APPROVE')}>
            <Check className="mr-2 h-4 w-4" /> Approve
          </Button>
          <Button size="sm" variant="destructive" onClick={() => openActionDialog(transaction.id!, 'REJECT')}>
            <X className="mr-2 h-4 w-4" /> Reject
          </Button>
        </div>
      );
    }
    
    if (currentUser.role === 'Super Admin' && transaction.currentStatus === 'PENDING_SUPER_ADMIN_APPROVAL') {
      return (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => openActionDialog(transaction.id!, 'APPROVE')}>
            <Check className="mr-2 h-4 w-4" /> Approve & Post
          </Button>
          <Button size="sm" variant="destructive" onClick={() => openActionDialog(transaction.id!, 'REJECT')}>
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
        t.id!,
        t.type,
        `$${t.amount.toLocaleString()}`,
        t.createdByUser || 'N/A',
        format(new Date(t.date), 'PP'),
        t.currentStatus ? statusConfig[t.currentStatus].label : 'Unknown'
    ]);
    
    (doc as any).autoTable({
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
        'Created By': t.createdByUser,
        'Submission Date': format(new Date(t.date), 'PP'),
        'Status': t.currentStatus ? statusConfig[t.currentStatus].label : 'Unknown'
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Document Flow");
    XLSX.writeFile(wb, "document-flow-report.xlsx");
  };

  const handlePrint = () => {
    const printContent = printableRef.current?.innerHTML;
    if (printContent) {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Print Report</title>');
            printWindow.document.write('<style>@import url("https://rsms.me/inter/inter.css");</style>');
            printWindow.document.write(`<link rel="stylesheet" href="${window.location.origin}/globals.css" type="text/css" />`); // Not ideal but might work
            printWindow.document.write('<style>body { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }</style>');
            printWindow.document.write('</head><body class="bg-white">');
            printWindow.document.write(printContent);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
             setTimeout(() => printWindow.print(), 1000);
        }
    }
  }
  
  const toggleColumnVisibility = (columnId: ColumnId) => {
    setColumnVisibility(prev => ({ ...prev, [columnId]: !prev[columnId] }));
  };

  return (
    <div className="container mx-auto py-10">
     {currentActionInfo && (
        <ActionDialog 
            isOpen={isActionDialogOpen}
            setIsOpen={setIsActionDialogOpen}
            actionType={currentActionInfo.action}
            onConfirm={confirmAction}
            isProcessing={isActionProcessing}
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
                 <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm"><Columns className="mr-2 h-4 w-4" /> View</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {Object.entries(columnVisibility).map(([key, value]) => (
                                <DropdownMenuCheckboxItem
                                    key={key}
                                    checked={value}
                                    onCheckedChange={() => toggleColumnVisibility(key as ColumnId)}
                                >
                                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="outline" size="sm" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print Report</Button>
                    <Button variant="outline" size="sm" onClick={handleExportPDF}><FileText className="mr-2 h-4 w-4" /> PDF</Button>
                    <Button variant="outline" size="sm" onClick={handleExportExcel}><FileSpreadsheet className="mr-2 h-4 w-4" /> Excel</Button>
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 mt-4 border-t">
                <div>
                    <Label>Filter by Status</Label>
                    <Select value={statusFilter} onValueChange={(value: Status | 'ALL') => setStatusFilter(value)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
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
                <div>
                    <Label>Filter by User</Label>
                     <Select value={userFilter} onValueChange={(value) => setUserFilter(value === 'ALL' ? '' : value)}>
                        <SelectTrigger><SelectValue placeholder="All Users" /></SelectTrigger>
                        <SelectContent>
                             <SelectItem value="ALL">All Users</SelectItem>
                            {uniqueUsers.map(user => (
                                <SelectItem key={user} value={user}>
                                    {user}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>From Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateFilter.from ? format(dateFilter.from, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0"><Input type="date" onChange={e => setDateFilter(p => ({...p, from: new Date(e.target.value)}))} /></PopoverContent>
                    </Popover>
                </div>
                <div>
                    <Label>To Date</Label>
                     <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateFilter.to ? format(dateFilter.to, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0"><Input type="date" onChange={e => setDateFilter(p => ({...p, to: new Date(e.target.value)}))} /></PopoverContent>
                    </Popover>
                </div>
             </div>
        </CardHeader>
        <CardContent>
            <div className="mb-4">
               <p className="text-sm text-muted-foreground p-2 bg-muted/50 rounded-md">
                Viewing as a{' '}
                <span className="font-bold text-primary">{currentUser?.role}</span>. This
                dashboard shows transactions relevant to your role.
              </p>
            </div>

            {isLoading ? (
                 <div className="flex h-40 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                 </div>
            ) : (
                <Table className="mt-4">
                <TableHeader>
                    <TableRow>
                    {columnVisibility.id && <TableHead>Transaction ID</TableHead>}
                    {columnVisibility.type && <TableHead>Type</TableHead>}
                    {columnVisibility.partyName && <TableHead>Party Name</TableHead>}
                    {columnVisibility.property && <TableHead>Property</TableHead>}
                    {columnVisibility.unitCode && <TableHead>Unit</TableHead>}
                    {columnVisibility.roomCode && <TableHead>Room</TableHead>}
                    {columnVisibility.referenceNo && <TableHead>Reference</TableHead>}
                    {columnVisibility.amount && <TableHead>Amount</TableHead>}
                    {columnVisibility.createdByUser && <TableHead>Created By</TableHead>}
                    {columnVisibility.date && <TableHead>Date</TableHead>}
                    {columnVisibility.currentStatus && <TableHead>Status</TableHead>}
                    <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((t) => (
                        <TableRow key={t.id}>
                        {columnVisibility.id && <TableCell className="font-mono text-xs">{t.id}</TableCell>}
                        {columnVisibility.type && <TableCell>{t.type}</TableCell>}
                        {columnVisibility.partyName && <TableCell>{partyNameLookups[t.partyName] || t.partyName}</TableCell>}
                        {columnVisibility.property && <TableCell>{t.property || '-'}</TableCell>}
                        {columnVisibility.unitCode && <TableCell>{t.unitCode || '-'}</TableCell>}
                        {columnVisibility.roomCode && <TableCell>{t.roomCode || '-'}</TableCell>}
                        {columnVisibility.referenceNo && <TableCell>{t.referenceNo || '-'}</TableCell>}
                        {columnVisibility.amount && <TableCell className="font-medium">
                            ${t.amount.toLocaleString()}
                        </TableCell>}
                        {columnVisibility.createdByUser && <TableCell>{t.createdByUser}</TableCell>}
                        {columnVisibility.date && <TableCell>
                            {format(new Date(t.date), 'PP')}
                        </TableCell>}
                        {columnVisibility.currentStatus && <TableCell>
                            {t.currentStatus && statusConfig[t.currentStatus] ? (
                                <Badge variant={statusConfig[t.currentStatus].color}>
                                    {statusConfig[t.currentStatus].label}
                                </Badge>
                            ) : (
                                <Badge variant="secondary">Unknown</Badge>
                            )}
                        </TableCell>}
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
                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} disabled={!t.approvalHistory || t.approvalHistory.length === 0}>
                                                <History className="mr-2 h-4 w-4" />
                                                View History
                                            </DropdownMenuItem>
                                        </DialogTrigger>
                                        <ApprovalHistoryDialog history={t.approvalHistory || []} transactionId={t.id!} />
                                    </Dialog>
                                    <DropdownMenuItem onSelect={() => openActionDialog(t.id!, 'ADD_COMMENT')}>
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        + Add Comment
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </TableCell>
                        </TableRow>
                    ))
                    ) : (
                    <TableRow>
                        <TableCell colSpan={Object.values(columnVisibility).filter(v => v).length + 1} className="h-24 text-center">
                        No transactions match the current filter.
                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
                </Table>
            )}
        </CardContent>
      </Card>
       <div style={{ display: 'none' }}>
        <PrintableReport 
          ref={printableRef}
          transactions={filteredTransactions} 
          filters={{status: statusFilter, user: userFilter, from: dateFilter.from, to: dateFilter.to}}
          partyNameLookups={partyNameLookups}
        />
      </div>
    </div>
  );
}
