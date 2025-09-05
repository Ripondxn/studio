
'use client';

import { useState, useEffect } from 'react';
import { ChequeManagementClient } from './cheque-management-client';
import { getCheques } from './actions';
import { type Cheque } from './schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, File, Plus, Minus, RefreshCw, ArrowRightLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AddChequeDialog } from './add-cheque-dialog';
import { DepositChequesDialog } from './deposit-cheques-dialog';
import { ReturnChequeDialog } from './return-cheque-dialog';
import { WithdrawChequesDialog } from './withdraw-cheques-dialog';
import { cn } from '@/lib/utils';

interface ChequeManagementTabProps {
    key: number;
    onSuccess: () => void;
}

export function ChequeManagementTab({ onSuccess }: ChequeManagementTabProps) {
    const [initialCheques, setInitialCheques] = useState<Cheque[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddChequeDialogOpen, setIsAddChequeDialogOpen] = useState(false);
    const [isDepositChequesDialogOpen, setIsDepositChequesDialogOpen] = useState(false);
    const [isReturnChequeDialogOpen, setIsReturnChequeDialogOpen] = useState(false);
    const [isWithdrawChequesDialogOpen, setIsWithdrawChequesDialogOpen] = useState(false);

    const fetchData = async (filters: { party?: string; status?: string } = {}) => {
        setIsLoading(true);
        const cheques = await getCheques(filters);
        setInitialCheques(cheques);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleFilterChange = (filters: { party?: string; status?: string }) => {
        fetchData(filters);
    };

    const handleSuccess = () => {
        fetchData();
        onSuccess();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-2xl font-bold">Cheque Management</h1>
                    <p className="text-muted-foreground">Track and manage all post-dated cheques from tenants and to landlords.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline"><FileText className="mr-2 h-4 w-4" /> Export PDF</Button>
                    <Button variant="outline"><File className="mr-2 h-4 w-4" /> Export Excel</Button>
                    <Button variant="outline" onClick={() => setIsWithdrawChequesDialogOpen(true)}><Minus className="mr-2 h-4 w-4" /> Withdrawal</Button>
                    <Button variant="outline" onClick={() => setIsDepositChequesDialogOpen(true)}><Plus className="mr-2 h-4 w-4" /> Deposit</Button>
                    <Button variant="outline" onClick={() => setIsReturnChequeDialogOpen(true)}><ArrowRightLeft className="mr-2 h-4 w-4" /> Return Cheque</Button>
                    <Button onClick={() => setIsAddChequeDialogOpen(true)}><Plus className="mr-2 h-4 w-4" /> Cheque</Button>
                    <Button variant="ghost" onClick={() => fetchData()} disabled={isLoading}>
                        <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">In Hand Cheques</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">AED 0.00</div>
                        <p className="text-xs text-muted-foreground">0 cheques pending deposit</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Due This Week</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">AED 0.00</div>
                        <p className="text-xs text-muted-foreground">0 cheques to be deposited</p>
                    </CardContent>
                </Card>
                <Card className="border-red-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Overdue Cheques</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">AED 0.00</div>
                        <p className="text-xs text-muted-foreground">0 cheques require immediate attention</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Deposited Cheques</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">AED 0.00</div>
                        <p className="text-xs text-muted-foreground">0 cheques awaiting clearance</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cleared Cheques (Month)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">AED 0.00</div>
                        <p className="text-xs text-muted-foreground">0 cheques cleared</p>
                    </CardContent>
                </Card>
            </div>

            <div className="flex space-x-4 mb-4">
                <Input placeholder="Filter by Party Name..." className="w-[200px]" onChange={e => handleFilterChange({ party: e.target.value })} />
                <Select onValueChange={value => handleFilterChange({ status: value })}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="In Hand">In Hand</SelectItem>
                        <SelectItem value="Deposited">Deposited</SelectItem>
                        <SelectItem value="Cleared">Cleared</SelectItem>
                        <SelectItem value="Returned">Returned</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <ChequeManagementClient initialCheques={initialCheques} isLoading={isLoading} />

            <AddChequeDialog 
                isOpen={isAddChequeDialogOpen} 
                onClose={() => setIsAddChequeDialogOpen(false)} 
                onSuccess={handleSuccess} 
            />

            <DepositChequesDialog 
                isOpen={isDepositChequesDialogOpen} 
                onClose={() => setIsDepositChequesDialogOpen(false)} 
                onSuccess={handleSuccess} 
                cheques={initialCheques.filter(c => c.status === 'In Hand')} 
            />

            <ReturnChequeDialog 
                isOpen={isReturnChequeDialogOpen} 
                onClose={() => setIsReturnChequeDialogOpen(false)} 
                onSuccess={handleSuccess} 
                cheques={initialCheques.filter(c => c.status === 'Deposited')} 
            />

            <WithdrawChequesDialog
                isOpen={isWithdrawChequesDialogOpen}
                onClose={() => setIsWithdrawChequesDialogOpen(false)}
                onSuccess={handleSuccess}
                cheques={initialCheques.filter(c => c.status === 'In Hand')}
            />
        </div>
    );
}
