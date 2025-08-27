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
import {AlertTriangle, Shuffle} from 'lucide-react';
import {useMemo} from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function ContinuityClient({
  initialContracts,
}: {
  initialContracts: Contract[];
}) {
  const { gapContracts, overlapContracts } = useMemo(() => {
    const gap = initialContracts.filter(c => c.periodStatus === 'Gap');
    const overlap = initialContracts.filter(
      c => c.periodStatus === 'Overlap'
    );
    return { gapContracts: gap, overlapContracts: overlap };
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
            <div className="text-2xl font-bold">{gapContracts.length}</div>
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
            <div className="text-2xl font-bold">{overlapContracts.length}</div>
            <p className="text-xs text-muted-foreground">
              Contracts with overlapping dates.
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Issues ({initialContracts.length})</TabsTrigger>
          <TabsTrigger value="gaps">Gaps ({gapContracts.length})</TabsTrigger>
          <TabsTrigger value="overlaps">Overlaps ({overlapContracts.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <DataTable columns={columns} data={initialContracts} />
        </TabsContent>
        <TabsContent value="gaps">
           <DataTable columns={columns} data={gapContracts} />
        </TabsContent>
        <TabsContent value="overlaps">
           <DataTable columns={columns} data={overlapContracts} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
