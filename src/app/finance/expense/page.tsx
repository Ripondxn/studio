
'use client';

import { useState } from 'react';
import { ArrowUpRight, CheckCircle2, Clock, DollarSign, Users, Wallet, Plus } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import NewExpenseDialog from './new-expense-dialog';
import NewEmployeeDialog from './new-employee-dialog';
import AdvancesTable from './advances-table';
import EmployeeList from './employee-list';

const statCards = [
    { title: 'Total Expenses', value: '$45,231.00', change: '+12.5% from last month', icon: <DollarSign className="h-6 w-6 text-muted-foreground" /> },
    { title: 'Pending Approvals', value: '23', change: '-8.2% from last month', icon: <Clock className="h-6 w-6 text-muted-foreground" /> },
    { title: 'Outstanding Advances', value: '$12,430.00', change: '+5.4% from last month', icon: <ArrowUpRight className="h-6 w-6 text-muted-foreground" /> },
    { title: 'Active Employees', value: '156', change: '+2.1% from last month', icon: <Users className="h-6 w-6 text-muted-foreground" /> },
];

const recentExpensesData = [
    { initials: 'JS', name: 'John Smith', role: 'engineer • materials', amount: '$1250.00', date: '2024-01-15', status: 'Pending' },
    { initials: 'SJ', name: 'Sarah Johnson', role: 'supervisor • tools', amount: '$890.50', date: '2024-01-14', status: 'Approved' },
    { initials: 'MW', name: 'Mike Wilson', role: 'driver • maintenance', amount: '$325.75', date: '2024-01-13', status: 'Paid' },
];

export default function ExpenseDashboardPage() {
    const [filteredExpenses, setFilteredExpenses] = useState(recentExpensesData);
    const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
    const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false); // State for the new dialog
    const [dialogType, setDialogType] = useState<'expense-claim' | 'advance-request'>('expense-claim');

    const filterExpenses = (status: string) => {
        if (status === 'All') {
            setFilteredExpenses(recentExpensesData);
        } else {
            setFilteredExpenses(recentExpensesData.filter(expense => expense.status === status));
        }
    };

    const getBadgeClass = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80 border-yellow-200';
            case 'Approved': return 'bg-green-100 text-green-800 hover:bg-green-100/80 border-green-200';
            case 'Paid': return 'bg-blue-100 text-blue-800 hover:bg-blue-100/80 border-blue-200';
            case 'Rejected': return 'bg-red-100 text-red-800 hover:bg-red-100/80 border-red-200';
            default: return 'bg-gray-100 text-gray-800 hover:bg-gray-100/80 border-gray-200';
        }
    };

    const handleOpenExpenseDialog = (type: 'expense-claim' | 'advance-request') => {
        setDialogType(type);
        setIsExpenseDialogOpen(true);
    };

    return (
        <>
            <NewExpenseDialog isOpen={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen} defaultType={dialogType} />
            <NewEmployeeDialog isOpen={isEmployeeDialogOpen} onOpenChange={setIsEmployeeDialogOpen} />
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Expense Dashboard</h2>
                        <p className="text-muted-foreground">Monitor and manage daily expenses across all departments.</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button onClick={() => handleOpenExpenseDialog('expense-claim')}>
                            <Plus className="mr-2 h-4 w-4"/> New Expense
                        </Button>
                        <Button variant="outline" onClick={() => handleOpenExpenseDialog('advance-request')}>
                            <Plus className="mr-2 h-4 w-4"/> Request Advance
                        </Button>
                        <Button variant="outline" onClick={() => setIsEmployeeDialogOpen(true)}>
                            <Plus className="mr-2 h-4 w-4"/> Add Employee
                        </Button>
                    </div>
                </div>
                <Tabs defaultValue="dashboard" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                        <TabsTrigger value="expenses">Expenses</TabsTrigger>
                        <TabsTrigger value="advances">Advances</TabsTrigger>
                        <TabsTrigger value="employees">Employees</TabsTrigger>
                    </TabsList>
                    <TabsContent value="dashboard" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {statCards.map((card, index) => (
                                <Card key={index}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                                        {card.icon}
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{card.value}</div>
                                        <p className="text-xs text-muted-foreground">{card.change}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Expenses</CardTitle>
                                <CardDescription>Latest expense submissions and updates.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Employee</TableHead>
                                            <TableHead className="text-right">Amount</TableHead>
                                            <TableHead className="hidden md:table-cell text-right">Date</TableHead>
                                            <TableHead className="text-right">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {recentExpensesData.map((expense, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <div className="flex items-center gap-4">
                                                        <Avatar className="h-9 w-9">
                                                            <AvatarFallback>{expense.initials}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-medium">{expense.name}</p>
                                                            <p className="text-sm text-muted-foreground">{expense.role}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right font-semibold">{expense.amount}</TableCell>
                                                <TableCell className="hidden md:table-cell text-right">{expense.date}</TableCell>
                                                <TableCell className="text-right">
                                                    <Badge className={getBadgeClass(expense.status)} variant="outline">
                                                        {expense.status === 'Pending' && <Clock className="mr-1 h-3 w-3" />}
                                                        {expense.status === 'Approved' && <CheckCircle2 className="mr-1 h-3 w-3" />}
                                                        {expense.status === 'Paid' && <Wallet className="mr-1 h-3 w-3" />}
                                                        {expense.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="expenses" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>All Expenses</CardTitle>
                                <CardDescription>View and manage all expense submissions.</CardDescription>
                            </CardHeader>
                            <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Employee</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                        <TableHead className="hidden md:table-cell text-right">Date</TableHead>
                                        <TableHead className="text-right">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentExpensesData.map((expense, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="h-9 w-9">
                                                        <AvatarFallback>{expense.initials}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{expense.name}</p>
                                                        <p className="text-sm text-muted-foreground">{expense.role}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-semibold">{expense.amount}</TableCell>
                                            <TableCell className="hidden md:table-cell text-right">{expense.date}</TableCell>
                                            <TableCell className="text-right">
                                                <Badge className={getBadgeClass(expense.status)} variant="outline">
                                                    {expense.status === 'Pending' && <Clock className="mr-1 h-3 w-3" />}
                                                    {expense.status === 'Approved' && <CheckCircle2 className="mr-1 h-3 w-3" />}
                                                    {expense.status === 'Paid' && <Wallet className="mr-1 h-3 w-3" />}
                                                    {expense.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="advances" className="space-y-4">
                        <AdvancesTable />
                    </TabsContent>
                    <TabsContent value="employees" className="space-y-4">
                        <EmployeeList />
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}
