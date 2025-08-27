
'use client';

import { useState } from 'react';
import { type Contract } from '@/app/tenancy/contract/schema';
import { DataTable } from './data-table';
import { columns } from './columns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle, LinkOff, Shuffle } from 'lucide-react';
import { useMemo } from 'react';

export function ContinuityClient({ initialContracts }: { initialContracts: Contract[] }) {
    const [contracts, setContracts] = useState<Contract[]>(initialContracts);
    
    const summary = useMemo(() => {
        return contracts.reduce((acc, contract) => {
            if (contract.periodStatus === 'Gap') acc.gaps++;
            if (contract.periodStatus === 'Overlap') acc.overlaps++;
            if (contract.periodStatus === 'Orphaned') acc.orphans++;
            return acc;
        }, { gaps: 0, overlaps: 0, orphans: 0 });
    }, [contracts]);

    return (
        <div>
            <div className="grid gap-4 md:grid-cols-3 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Period Gaps</CardTitle>
                        <Shuffle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summary.gaps}</div>
                        <p className="text-xs text-muted-foreground">Contracts with time gaps between them.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Period Overlaps</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summary.overlaps}</div>
                        <p className="text-xs text-muted-foreground">Contracts whose dates overlap.</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Orphaned Renewals</CardTitle>
                        <LinkOff className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summary.orphans}</div>
                        <p className="text-xs text-muted-foreground">Renewals without a preceding contract.</p>
                    </CardContent>
                </Card>
            </div>
            <DataTable columns={columns} data={contracts} />
        </div>
    );
}
