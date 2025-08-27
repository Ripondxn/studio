
'use client';

import * as React from 'react';
import {type Contract} from '@/app/tenancy/contract/schema';
import {DataTable} from './data-table';
import {columns as problemColumns} from './columns';
import {movementColumns} from './movement-columns';
import {vacantPeriodColumns} from './vacant-period-columns';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {AlertTriangle, Shuffle, Link2Off, Home} from 'lucide-react';
import {useMemo, useState} from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type MovementHistoryItem, type VacantPeriod } from './actions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { isAfter, isBefore, parseISO } from 'date-fns';

export function ContinuityClient({
  initialOverlapContracts,
  initialGapContracts,
  initialMovementHistory,
  initialVacantPeriods,
}: {
  initialOverlapContracts: Contract[];
  initialGapContracts: Contract[];
  initialMovementHistory: MovementHistoryItem[];
  initialVacantPeriods: VacantPeriod[];
}) {

  const [filters, setFilters] = useState<{ fromDate?: string, toDate?: string }>({});

  const handleFilterChange = (key: 'fromDate' | 'toDate', value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({});
  };
  
  const filteredMovementHistory = useMemo(() => {
    if (!filters.fromDate && !filters.toDate) return initialMovementHistory;
    return initialMovementHistory.filter(item => {
        const itemDate = parseISO(item.date);
        if (filters.fromDate && isBefore(itemDate, parseISO(filters.fromDate))) return false;
        if (filters.toDate && isBefore(itemDate, parseISO(filters.toDate))) return false;
        return true;
    });
  }, [initialMovementHistory, filters]);

  const filteredOverlapContracts = useMemo(() => {
    if (!filters.fromDate && !filters.toDate) return initialOverlapContracts;
    return initialOverlapContracts.filter(item => {
        const itemDate = parseISO(item.startDate);
        if (filters.fromDate && isBefore(itemDate, parseISO(filters.fromDate))) return false;
        if (filters.toDate && isBefore(itemDate, parseISO(filters.toDate))) return false;
        return true;
    });
  }, [initialOverlapContracts, filters]);
  
  const filteredGapContracts = useMemo(() => {
    if (!filters.fromDate && !filters.toDate) return initialGapContracts;
    return initialGapContracts.filter(item => {
        const itemDate = parseISO(item.startDate);
        if (filters.fromDate && isBefore(itemDate, parseISO(filters.fromDate))) return false;
        if (filters.toDate && isBefore(itemDate, parseISO(filters.toDate))) return false;
        return true;
    });
  }, [initialGapContracts, filters]);

  const filteredVacantPeriods = useMemo(() => {
    if (!filters.fromDate && !filters.toDate) return initialVacantPeriods;
    return initialVacantPeriods.filter(item => {
        const itemDate = parseISO(item.vacancyStartDate);
        if (filters.fromDate && isBefore(itemDate, parseISO(filters.fromDate))) return false;
        if (filters.toDate && isBefore(itemDate, parseISO(filters.toDate))) return false;
        return true;
    });
  }, [initialVacantPeriods, filters]);


  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
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
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Vacant Periods
            </CardTitle>
            <Home className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{initialVacantPeriods.length}</div>
            <p className="text-xs text-muted-foreground">
              Unit vacancies between tenancies.
            </p>
          </CardContent>
        </Card>
      </div>
      
       <div className="flex gap-4 mb-4 p-4 border rounded-lg bg-card items-end">
            <div className="grid gap-2">
                <Label htmlFor="from-date">From Date</Label>
                <Input id="from-date" type="date" value={filters.fromDate || ''} onChange={e => handleFilterChange('fromDate', e.target.value)} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="to-date">To Date</Label>
                <Input id="to-date" type="date" value={filters.toDate || ''} onChange={e => handleFilterChange('toDate', e.target.value)} />
            </div>
             <Button variant="ghost" onClick={handleClearFilters} disabled={!filters.fromDate && !filters.toDate}>
                <X className="mr-2 h-4 w-4"/> Clear
             </Button>
        </div>


      <Tabs defaultValue="movement">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="movement">Movement Reports ({filteredMovementHistory.length})</TabsTrigger>
          <TabsTrigger value="overlaps">Overlaps ({filteredOverlapContracts.length})</TabsTrigger>
          <TabsTrigger value="gaps">Gaps ({filteredGapContracts.length})</TabsTrigger>
          <TabsTrigger value="vacant">Vacant Periods ({filteredVacantPeriods.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="movement">
           <DataTable 
             columns={movementColumns} 
             data={filteredMovementHistory} 
             reportTitle="Movement History Report"
             searchColumn="tenantName"
             searchPlaceholder="Filter by tenant name..."
            />
        </TabsContent>
        <TabsContent value="overlaps">
           <DataTable 
            columns={problemColumns} 
            data={filteredOverlapContracts} 
            reportTitle="Overlapping Contracts Report" 
            searchColumn="tenantName"
            searchPlaceholder="Filter by tenant, property, or unit..."
           />
        </TabsContent>
        <TabsContent value="gaps">
           <DataTable 
            columns={problemColumns} 
            data={filteredGapContracts} 
            reportTitle="Contract Gaps Report" 
            searchColumn="tenantName"
            searchPlaceholder="Filter by tenant, property, or unit..."
            />
        </TabsContent>
         <TabsContent value="vacant">
           <DataTable 
            columns={vacantPeriodColumns} 
            data={filteredVacantPeriods} 
            reportTitle="Vacant Periods Report"
            searchColumn="property"
            searchPlaceholder="Filter by property or unit..."
            />
        </TabsContent>
      </Tabs>
    </div>
  );
}
