'use client';

import * as React from 'react';
import {type Contract} from '@/app/tenancy/contract/schema';
import {DataTable} from './data-table';
import {columns as problemColumns} from './columns';
import {movementColumns} from './movement-columns';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {AlertTriangle, Shuffle, Link2Off} from 'lucide-react';
import {useMemo} from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MovementHistoryItem } from './actions';

export function ContinuityClient({
  initialOverlapContracts,
  initialGapContracts,
  initialMovementHistory,
}: {
  initialOverlapContracts: Contract[];
  initialGapContracts: Contract[];
  initialMovementHistory: MovementHistoryItem[];
}) {
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tenant Movements</CardTitle>
            <Shuffle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{initialMovementHistory.length}</div>
            <p className="text-xs text-muted-foreground">
              Total recorded tenant relocations.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Overlaps Detected
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{initialOverlapContracts.length}</div>
            <p className="text-xs text-muted-foreground">
              Contracts with overlapping dates.
            </p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Gaps Detected
            </CardTitle>
            <Link2Off className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{initialGapContracts.length}</div>
            <p className="text-xs text-muted-foreground">
              Contracts with gaps between them.
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="movement">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="movement">Movement Reports ({initialMovementHistory.length})</TabsTrigger>
          <TabsTrigger value="overlaps">Overlaps ({initialOverlapContracts.length})</TabsTrigger>
          <TabsTrigger value="gaps">Gaps ({initialGapContracts.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="movement">
           <DataTable columns={movementColumns} data={initialMovementHistory} reportTitle="Movement History Report" />
        </TabsContent>
        <TabsContent value="overlaps">
           <DataTable columns={problemColumns} data={initialOverlapContracts} reportTitle="Overlapping Contracts Report" />
        </TabsContent>
        <TabsContent value="gaps">
           <DataTable columns={problemColumns} data={initialGapContracts} reportTitle="Contract Gaps Report" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
