'use client';

import * as React from 'react';
import {type Contract} from '@/app/tenancy/contract/schema';
import {DataTable} from './data-table';
import {columns} from './columns';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {AlertTriangle, Link2Off, Shuffle} from 'lucide-react';
import {useMemo} from 'react';

export function ContinuityClient({
  initialContracts,
}: {
  initialContracts: Contract[];
}) {
  const summary = useMemo(() => {
    const gapCount = initialContracts.filter(c => c.periodStatus === 'Gap').length;
    const overlapCount = initialContracts.filter(
      c => c.periodStatus === 'Overlap'
    ).length;
    return {gapCount, overlapCount};
  }, [initialContracts]);

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gaps Detected</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.gapCount}</div>
            <p className="text-xs text-muted-foreground">
              Contracts with a time gap between them.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Overlaps Detected
            </CardTitle>
            <Shuffle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.overlapCount}</div>
            <p className="text-xs text-muted-foreground">
              Contracts with overlapping dates.
            </p>
          </CardContent>
        </Card>
      </div>
      <DataTable columns={columns} data={initialContracts} />
    </div>
  );
}
