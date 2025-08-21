
import { getCheques, getSummary } from './actions';
import { columns } from './columns';
import { DataTable } from './data-table';
import { AddChequeDialog } from './add-cheque-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Banknote, Clock, CheckCircle, Hourglass } from 'lucide-react';


export default async function ChequeDepositPage() {
  const cheques = await getCheques();
  const summary = await getSummary();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold font-headline">Cheque Management</h1>
            <p className="text-muted-foreground">
                Track and manage all post-dated cheques from tenants and to landlords.
            </p>
        </div>
        <AddChequeDialog />
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Hand Cheques</CardTitle>
            <Hourglass className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(summary.inHandTotal)}</div>
            <p className="text-xs text-muted-foreground">{summary.inHandCount} cheques pending deposit</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due This Week</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(summary.dueThisWeekTotal)}</div>
            <p className="text-xs text-muted-foreground">{summary.dueThisWeekCount} cheques to be deposited</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deposited Cheques</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(summary.depositedTotal)}</div>
            <p className="text-xs text-muted-foreground">{summary.depositedCount} cheques awaiting clearance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cleared Cheques (Month)</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(summary.clearedThisMonthTotal)}</div>
            <p className="text-xs text-muted-foreground">{summary.clearedThisMonthCount} cheques cleared</p>
          </CardContent>
        </Card>
      </div>

      <DataTable columns={columns} data={cheques} />
    </div>
  );
}

