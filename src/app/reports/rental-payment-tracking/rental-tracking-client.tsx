
'use client';

import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { type TenantPaymentData, type MonthlyPayment } from './actions';
import { cn } from '@/lib/utils';
import { useCurrency } from '@/context/currency-context';
import { format } from 'date-fns';
import { DollarSign, CheckCircle, XCircle, AlertCircle, Info, FileSpreadsheet } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import * as XLSX from 'xlsx';

interface RentalTrackingClientProps {
  initialData: TenantPaymentData[];
  displayedMonths: string[];
}

const statusConfig: { [key in MonthlyPayment['status']]: { color: string; icon: React.ReactNode } } = {
  Paid: {
    color: 'bg-green-600 text-white',
    icon: <CheckCircle className="h-4 w-4" />,
  },
  Unpaid: {
    color: 'bg-red-600 text-white',
    icon: <XCircle className="h-4 w-4" />,
  },
  Partial: {
    color: 'bg-yellow-500 text-black',
    icon: <AlertCircle className="h-4 w-4" />,
  },
};

export function RentalTrackingClient({ initialData, displayedMonths }: RentalTrackingClientProps) {
  const [paymentData, setPaymentData] = useState(initialData);
  const [filter, setFilter] = useState('');
  const { formatCurrency } = useCurrency();

  const filteredData = useMemo(() => {
    return paymentData.filter(
      (tenant) =>
        tenant.tenantName.toLowerCase().includes(filter.toLowerCase()) ||
        tenant.flatNo.toLowerCase().includes(filter.toLowerCase()) ||
        tenant.nationality?.toLowerCase().includes(filter.toLowerCase())
    );
  }, [paymentData, filter]);

  const togglePaymentStatus = (contractNo: string, month: string) => {
    setPaymentData((prevData) =>
      prevData.map((tenant) => {
        if (tenant.contractNo === contractNo) {
          return {
            ...tenant,
            payments: tenant.payments.map((payment) => {
              if (payment.month === month) {
                const statusCycle: MonthlyPayment['status'][] = ['Unpaid', 'Partial', 'Paid'];
                const currentIndex = statusCycle.indexOf(payment.status);
                const newStatus = statusCycle[(currentIndex + 1) % statusCycle.length];
                return { ...payment, status: newStatus };
              }
              return payment;
            }),
          };
        }
        return tenant;
      })
    );
  };
  
  const monthTotals = useMemo(() => {
    const totals: {[key: string]: { expected: number, paid: number }} = {};
    displayedMonths.forEach(month => {
        totals[month] = { expected: 0, paid: 0 };
    });
    
    paymentData.forEach(tenant => {
        tenant.payments.forEach(payment => {
            if (displayedMonths.includes(payment.month)) {
                totals[payment.month].expected += payment.amount;
                if(payment.status === 'Paid') {
                    totals[payment.month].paid += payment.amount;
                } else if (payment.status === 'Partial') {
                    totals[payment.month].paid += payment.amount / 2; // Example for partial
                }
            }
        });
    });
    return totals;
  }, [paymentData, displayedMonths]);

  const handleExportExcel = () => {
    const dataToExport = filteredData.map((tenant, index) => {
      const row: any = {
        'S.L': index + 1,
        'Tenant Name': tenant.tenantName,
        'Flat No': tenant.flatNo,
        'Nationality': tenant.nationality,
        'Mobile No.': tenant.mobile,
        'Rent From': tenant.rentPeriodFrom,
        'Rent To': tenant.rentPeriodTo,
        'Monthly Rent': tenant.monthlyRent,
        'Yearly Rent': tenant.yearlyRent,
      };

      displayedMonths.forEach(month => {
        const payment = tenant.payments.find(p => p.month === month);
        row[`${month} Date`] = payment ? format(new Date(payment.date), 'dd.MM.yyyy') : '-';
        row[`${month} Payment`] = payment ? payment.amount : 0;
        row[`${month} Status`] = payment ? payment.status : 'N/A';
      });

      return row;
    });

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Rental Payments");
    XLSX.writeFile(wb, "rental-payment-tracking.xlsx");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
              <CardTitle>Rental Payment Status</CardTitle>
              <CardDescription>Click a payment cell to cycle through Unpaid, Partial, and Paid statuses.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <Input
                placeholder="Filter table..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="max-w-sm"
                />
                 <Button variant="outline" onClick={handleExportExcel} size="sm">
                    <FileSpreadsheet className="mr-2 h-4 w-4" /> Export Excel
                </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full h-[60vh] border rounded-md">
            <Table className="relative min-w-full border-collapse">
            <TableHeader className="sticky top-0 bg-muted z-10">
                <TableRow>
                    <TableHead rowSpan={2} className="sticky left-0 bg-muted z-20 border-r">S.L</TableHead>
                    <TableHead rowSpan={2} className="sticky left-[50px] bg-muted z-20 border-r min-w-[200px]">Tenant Name</TableHead>
                    <TableHead rowSpan={2}>Flat No.</TableHead>
                    <TableHead rowSpan={2}>Nationality</TableHead>
                    <TableHead rowSpan={2}>Mobile No.</TableHead>
                    <TableHead colSpan={2} className="text-center">Rent Period</TableHead>
                    <TableHead colSpan={2} className="text-center">Rent</TableHead>
                    {displayedMonths.map((month) => (
                        <TableHead key={month} colSpan={2} className="text-center">{month}</TableHead>
                    ))}
                </TableRow>
                <TableRow>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Monthly</TableHead>
                    <TableHead>Yearly</TableHead>
                    {displayedMonths.flatMap((month) => [
                        <TableHead key={`${month}-date`}>Date</TableHead>,
                        <TableHead key={`${month}-payment`} className="text-right">Payment</TableHead>
                    ])}
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredData.map((tenant, index) => (
                <TableRow key={tenant.contractNo}>
                    <TableCell className="sticky left-0 bg-background z-10 border-r">{index + 1}</TableCell>
                    <TableCell className="sticky left-[50px] bg-background z-10 border-r font-medium">{tenant.tenantName}</TableCell>
                    <TableCell>{tenant.flatNo}</TableCell>
                    <TableCell>{tenant.nationality}</TableCell>
                    <TableCell>{tenant.mobile}</TableCell>
                    <TableCell>{format(new Date(tenant.rentPeriodFrom), 'dd.MM.yyyy')}</TableCell>
                    <TableCell>{format(new Date(tenant.rentPeriodTo), 'dd.MM.yyyy')}</TableCell>
                    <TableCell>{formatCurrency(tenant.monthlyRent)}</TableCell>
                    <TableCell>{formatCurrency(tenant.yearlyRent)}</TableCell>
                    
                    {displayedMonths.map((month) => {
                        const payment = tenant.payments.find((p) => p.month === month);
                        const config = statusConfig[payment?.status || 'Unpaid'];
                        return (
                           <React.Fragment key={month}>
                            <TableCell 
                                className={cn("cursor-pointer", payment ? config.color : 'bg-gray-100')}
                                onClick={() => payment && togglePaymentStatus(tenant.contractNo, month)}
                            >
                                {payment ? format(new Date(payment.date), 'dd.MM.yyyy') : '-'}
                            </TableCell>
                            <TableCell
                                className={cn("cursor-pointer text-right", payment ? config.color : 'bg-gray-100')}
                                onClick={() => payment && togglePaymentStatus(tenant.contractNo, month)}
                            >
                                {payment ? formatCurrency(payment.amount) : '-'}
                            </TableCell>
                           </React.Fragment>
                        );
                    })}
                </TableRow>
                ))}
            </TableBody>
             <TableFooter className="sticky bottom-0 bg-muted z-10">
                <TableRow>
                    <TableCell colSpan={7} className="text-right font-bold">Monthly Totals</TableCell>
                    <TableCell className="text-right font-bold">{formatCurrency(Object.values(monthTotals).reduce((s, m) => s + (filteredData[0]?.monthlyRent || 0), 0))}</TableCell>
                    <TableCell className="text-right font-bold">{formatCurrency(Object.values(monthTotals).reduce((s, m) => s + (filteredData[0]?.yearlyRent || 0), 0))}</TableCell>
                    {displayedMonths.flatMap(month => {
                        const total = monthTotals[month];
                        return [
                             <TableCell key={`${month}-total-label`} className="text-right font-bold" colSpan={1}></TableCell>,
                             <TableCell key={`${month}-total-value`} className="text-right font-bold">{formatCurrency(total.expected)}</TableCell>
                        ]
                    })}
                </TableRow>
            </TableFooter>
            </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
