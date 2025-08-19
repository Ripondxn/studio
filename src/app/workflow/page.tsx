
'use client';

import { useState, useMemo } from 'react';
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
} from 'lucide-react';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { type Transaction, type Role, type Status, type ApprovalHistory } from './types';
import { transactions as initialTransactions } from './data';
import { format } from 'date-fns';

const statusConfig: {
  [key in Status]: {
    label: string;
    color:
      | 'default'
      | 'secondary'
      | 'destructive'
      | 'outline';
  };
} = {
  DRAFT: { label: 'Draft', color: 'secondary' },
  PENDING_ADMIN_APPROVAL: {
    label: 'Pending Admin Approval',
    color: 'default',
  },
  PENDING_SUPER_ADMIN_APPROVAL: {
    label: 'Pending Super Admin Approval',
    color: 'default',
  },
  POSTED: { label: 'Posted', color: 'outline' },
  REJECTED: { label: 'Rejected', color: 'destructive' },
};

const roleIcons: { [key in Role]: React.ReactNode } = {
  USER: <User className="h-5 w-5" />,
  ADMIN: <Shield className="h-5 w-5" />,
  SUPER_ADMIN: <UserCheck className="h-5 w-5" />,
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
                  <p className="mt-2 rounded-md border bg-muted p-2 text-sm">
                    "{item.comments}"
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </DialogContent>
  );
};


export default function WorkflowPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [currentUserRole, setCurrentUserRole] = useState<Role>('USER');

  const handleAction = (
    transactionId: string,
    action: 'SUBMIT' | 'APPROVE' | 'REJECT'
  ) => {
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id !== transactionId) return t;

        let newStatus: Status = t.currentStatus;
        let historyAction = '';
        const comments = action === 'REJECT' ? 'Rejected for clarification.' : undefined;

        switch (action) {
          case 'SUBMIT':
            if(t.currentStatus === 'DRAFT' || t.currentStatus === 'REJECTED'){
              newStatus = 'PENDING_ADMIN_APPROVAL';
              historyAction = 'Submitted for Approval';
            }
            break;
          case 'APPROVE':
            if (t.currentStatus === 'PENDING_ADMIN_APPROVAL' && currentUserRole === 'ADMIN') {
              newStatus = 'PENDING_SUPER_ADMIN_APPROVAL';
              historyAction = 'Approved by Admin';
            } else if (t.currentStatus === 'PENDING_SUPER_ADMIN_APPROVAL' && currentUserRole === 'SUPER_ADMIN') {
              newStatus = 'POSTED';
              historyAction = 'Final Approval & Posted';
            }
            break;
          case 'REJECT':
             if (t.currentStatus === 'PENDING_ADMIN_APPROVAL' && currentUserRole === 'ADMIN') {
                newStatus = 'REJECTED';
                historyAction = 'Rejected by Admin';
            } else if (t.currentStatus === 'PENDING_SUPER_ADMIN_APPROVAL' && currentUserRole === 'SUPER_ADMIN') {
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
                actorId: currentUserRole.toLowerCase() + '@propvue.com',
                actorRole: currentUserRole,
                timestamp: new Date().toISOString(),
                comments,
              },
            ],
          };
        }
        return t;

      })
    );
  };
  
  const filteredTransactions = useMemo(() => {
    switch (currentUserRole) {
      case 'USER':
        return transactions; // User sees all their transactions
      case 'ADMIN':
        return transactions.filter(t => t.currentStatus === 'PENDING_ADMIN_APPROVAL');
      case 'SUPER_ADMIN':
        return transactions.filter(t => t.currentStatus === 'PENDING_SUPER_ADMIN_APPROVAL');
      default:
        return [];
    }
  }, [currentUserRole, transactions]);


  const getActionButtons = (transaction: Transaction) => {
    switch (currentUserRole) {
      case 'USER':
        if (transaction.currentStatus === 'DRAFT' || transaction.currentStatus === 'REJECTED') {
          return (
            <Button size="sm" onClick={() => handleAction(transaction.id, 'SUBMIT')}>
              <Send className="mr-2 h-4 w-4" /> Submit
            </Button>
          );
        }
        return null;
      case 'ADMIN':
        if (transaction.currentStatus === 'PENDING_ADMIN_APPROVAL') {
          return (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleAction(transaction.id, 'APPROVE')}>
                <Check className="mr-2 h-4 w-4" /> Approve
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleAction(transaction.id, 'REJECT')}>
                <X className="mr-2 h-4 w-4" /> Reject
              </Button>
            </div>
          );
        }
        return null;
      case 'SUPER_ADMIN':
        if (transaction.currentStatus === 'PENDING_SUPER_ADMIN_APPROVAL') {
          return (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleAction(transaction.id, 'APPROVE')}>
                <Check className="mr-2 h-4 w-4" /> Approve & Post
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleAction(transaction.id, 'REJECT')}>
                <X className="mr-2 h-4 w-4" /> Reject
              </Button>
            </div>
          );
        }
        return null;
      default:
        return null;
    }
  };
  

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            Document Approval Controller
          </CardTitle>
          <CardDescription>
            Manage and track financial transactions through the approval
            workflow.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={currentUserRole}
            onValueChange={(value) => setCurrentUserRole(value as Role)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="USER">
                <User className="mr-2 h-4 w-4" /> User View
              </TabsTrigger>
              <TabsTrigger value="ADMIN">
                <Shield className="mr-2 h-4 w-4" /> Admin View
              </TabsTrigger>
              <TabsTrigger value="SUPER_ADMIN">
                <UserCheck className="mr-2 h-4 w-4" /> Super Admin View
              </TabsTrigger>
            </TabsList>
            
            <div className="mt-4">
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
                            <Dialog>
                                <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                    <File className="mr-2 h-4 w-4" />
                                    View Details
                                    </DropdownMenuItem>
                                    <DialogTrigger asChild>
                                        <DropdownMenuItem>
                                            <History className="mr-2 h-4 w-4" />
                                            View History
                                        </DropdownMenuItem>
                                    </DialogTrigger>
                                </DropdownMenuContent>
                                </DropdownMenu>
                                <ApprovalHistoryDialog history={t.approvalHistory} transactionId={t.id}/>
                            </Dialog>
                          </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No transactions pending for your action.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
