
'use client';

import React from 'react';
import { type MaintenanceContract } from './schema';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Building2 } from 'lucide-react';
import { useCurrency } from '@/context/currency-context';
import { useCompanyProfile } from '@/context/company-profile-context';

interface PrintableContractProps {
  contract: Omit<MaintenanceContract, 'id'>;
  lookups: {
    vendors: { value: string; label: string }[];
    properties: { value: string; label: string }[];
  };
}

export const PrintableMaintenanceContract = React.forwardRef<HTMLDivElement, PrintableContractProps>(
  ({ contract, lookups }, ref) => {
    const { formatCurrency } = useCurrency();
    const { profile } = useCompanyProfile();
    const vendorName = lookups.vendors.find(v => v.value === contract.vendorCode)?.label || contract.vendorCode;
    const propertyName = lookups.properties.find(p => p.value === contract.propertyCode)?.label || contract.propertyCode;

    return (
      <div ref={ref} className="p-8 bg-white text-black font-sans">
        <header className="flex justify-between items-start pb-6 mb-6 border-b">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 text-primary rounded-lg">
                    {profile.logo ? <img src={profile.logo} alt="Company Logo" className="h-8 w-8 object-contain"/> : <Building2 className="h-8 w-8" />}
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{profile.name}</h1>
                    <p className="text-sm text-gray-500">Maintenance Service Contract</p>
                </div>
            </div>
            <div className="text-right">
                <h2 className="text-2xl font-bold text-gray-700">Contract # {contract.contractNo}</h2>
                <p className="text-sm text-gray-500 mt-1">Date: {format(new Date(contract.contractDate), 'PP')}</p>
            </div>
        </header>

        <section className="grid grid-cols-2 gap-8 mb-8 text-sm">
            <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Vendor Details</h3>
                <p className="font-bold text-gray-800">{vendorName}</p>
                {/* Add more vendor details if needed */}
            </div>
             <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Property Details</h3>
                <p className="font-bold text-gray-800">{propertyName}</p>
                {/* Add more property details if needed */}
            </div>
        </section>

        <section className="mb-8">
            <Table>
                <TableBody>
                    <TableRow><TableCell className="font-semibold">Service Type</TableCell><TableCell>{contract.serviceType}</TableCell></TableRow>
                    <TableRow><TableCell className="font-semibold">Contract Period</TableCell><TableCell>{format(new Date(contract.startDate), 'PP')} to {format(new Date(contract.endDate), 'PP')}</TableCell></TableRow>
                    <TableRow><TableCell className="font-semibold">Total Contract Value</TableCell><TableCell className="font-bold">{formatCurrency(contract.totalValue)}</TableCell></TableRow>
                    <TableRow><TableCell className="font-semibold">Status</TableCell><TableCell>{contract.status}</TableCell></TableRow>
                </TableBody>
            </Table>
        </section>

        <section className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Payment Schedule</h3>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Installment</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {contract.paymentSchedule.map(item => (
                        <TableRow key={item.installment}>
                            <TableCell>{item.installment}</TableCell>
                            <TableCell>{format(new Date(item.dueDate), 'PP')}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </section>

         {contract.terms && (
            <section className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Terms & Conditions</h3>
                <div className="text-xs p-4 border rounded-md bg-gray-50 whitespace-pre-wrap">
                    {contract.terms}
                </div>
            </section>
        )}

        <footer className="mt-16 pt-8 grid grid-cols-2 gap-8 text-center text-xs text-gray-600">
             <div className="border-t border-gray-400 pt-2">
                <p className="font-semibold">For {profile.name}</p>
            </div>
            <div className="border-t border-gray-400 pt-2">
                <p className="font-semibold">For Vendor</p>
            </div>
        </footer>
      </div>
    );
  }
);

PrintableMaintenanceContract.displayName = 'PrintableMaintenanceContract';
