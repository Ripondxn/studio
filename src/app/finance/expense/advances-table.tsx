
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, CheckCircle2, Ban } from "lucide-react";

const advancesData = [
    { initials: 'AM', name: 'Alice Martin', role: 'sales • travel', amount: '$500.00', date: '2024-01-12', status: 'Approved' },
    { initials: 'BR', name: 'Bob Roberts', role: 'marketing • event', amount: '$1000.00', date: '2024-01-10', status: 'Pending' },
    { initials: 'CS', name: 'Charlie Stone', role: 'it • equipment', amount: '$750.00', date: '2024-01-09', status: 'Rejected' },
];

const getBadgeClass = (status: string) => {
    switch (status) {
        case 'Pending': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80 border-yellow-200';
        case 'Approved': return 'bg-green-100 text-green-800 hover:bg-green-100/80 border-green-200';
        case 'Rejected': return 'bg-red-100 text-red-800 hover:bg-red-100/80 border-red-200';
        default: return 'bg-gray-100 text-gray-800 hover:bg-gray-100/80 border-gray-200';
    }
};

export default function AdvancesTable() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Advance Requests</CardTitle>
                <CardDescription>Latest advance request submissions and updates.</CardDescription>
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
                        {advancesData.map((advance, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-9 w-9">
                                            <AvatarFallback>{advance.initials}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{advance.name}</p>
                                            <p className="text-sm text-muted-foreground">{advance.role}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-semibold">{advance.amount}</TableCell>
                                <TableCell className="hidden md:table-cell text-right">{advance.date}</TableCell>
                                <TableCell className="text-right">
                                    <Badge className={getBadgeClass(advance.status)} variant="outline">
                                        {advance.status === 'Pending' && <Clock className="mr-1 h-3 w-3" />}
                                        {advance.status === 'Approved' && <CheckCircle2 className="mr-1 h-3 w-3" />}
                                        {advance.status === 'Rejected' && <Ban className="mr-1 h-3 w-3" />}
                                        {advance.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
