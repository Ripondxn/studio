
'use client';

import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { type TenantPaymentData, type MonthlyPayment } from './actions';
import { cn } from '@/lib/utils';
import { useCurrency } from '@/context/currency-context';
import { DollarSign, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface RentalTrackingClientProps {
  initialData: TenantPaymentData[];
  displayedMonths: string[];
}

const statusConfig = {
  Paid: {
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: <CheckCircle className="h-4 w-4" />,
  },
  Unpaid: {
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: <XCircle className="h-4 w-4" />,
  },
  Partial: {
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: <AlertCircle className="h-4 w-4" />,
  },
  Pending: {
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: <XCircle className="h-4 w-4" />,
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

  const togglePaymentStatus = (tenantCode: string, month: string) => {
    setPaymentData((prevData) =>
      prevData.map((tenant) => {
        if (tenant.tenantCode === tenantCode) {
          return {
            ...tenant,
            payments: tenant.payments.map((payment) => {
              if (payment.month === month) {
                const newStatus = payment.status === 'Paid' ? 'Unpaid' : 'Paid';
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
  
  const summary = useMemo(() => {
    let totalRent = 0;
    let totalPaid = 0;
    
    paymentData.forEach(tenant => {
        tenant.payments.forEach(payment => {
            if(displayedMonths.includes(payment.month)) {
                totalRent += payment.amount;
                if(payment.status === 'Paid') {
                    totalPaid += payment.amount;
                }
            }
        })
    });
    
    return {
        totalRent,
        totalPaid,
        balance: totalRent - totalPaid
    }

  }, [paymentData, displayedMonths]);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
              <CardTitle>Rental Payment Status</CardTitle>
              <CardDescription>Click a payment cell to toggle its status.</CardDescription>
            </div>
            <Input
              placeholder="Search by tenant, flat, or nationality..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="max-w-sm"
            />
        </div>
         <div className="grid grid-cols-3 gap-4 text-center mt-4 border rounded-lg p-4">
            <div>
                <p className="text-sm text-muted-foreground">Total Expected Rent</p>
                <p className="text-xl font-bold">{formatCurrency(summary.totalRent)}</p>
            </div>
            <div>
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(summary.totalPaid)}</p>
            </div>
            <div>
                <p className="text-sm text-muted-foreground">Outstanding Balance</p>
                <p className="text-xl font-bold text-red-600">{formatCurrency(summary.balance)}</p>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full h-[60vh] border">
            <Table className="relative">
            <TableHeader className="sticky top-0 bg-secondary z-10">
                <TableRow>
                <TableHead className="sticky left-0 bg-secondary z-20">Tenant Name</TableHead>
                <TableHead>Flat No.</TableHead>
                <TableHead>Nationality</TableHead>
                <TableHead>Mobile No.</TableHead>
                <TableHead>Total Rent</TableHead>
                {displayedMonths.map((month) => (
                    <TableHead key={month}>{month}</TableHead>
                ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredData.map((tenant) => (
                <TableRow key={tenant.contractNo}>
                    <TableCell className="sticky left-0 bg-background font-medium">{tenant.tenantName}</TableCell>
                    <TableCell>{tenant.flatNo}</TableCell>
                    <TableCell>{tenant.nationality}</TableCell>
                    <TableCell>{tenant.mobile}</TableCell>
                    <TableCell>{formatCurrency(tenant.totalRent)}</TableCell>
                    {displayedMonths.map((month) => {
                    const payment = tenant.payments.find((p) => p.month === month);
                    const config = statusConfig[payment?.status || 'Pending'];
                    return (
                        <TableCell
                        key={month}
                        className={cn(
                            "cursor-pointer text-center",
                            payment ? config.color : 'bg-gray-50'
                        )}
                        onClick={() => payment && togglePaymentStatus(tenant.tenantCode, month)}
                        >
                            {payment && payment.amount > 0 ? formatCurrency(payment.amount) : '-'}
                        </TableCell>
                    );
                    })}
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
