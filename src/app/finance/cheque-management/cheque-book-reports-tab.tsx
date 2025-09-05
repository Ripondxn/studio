
'use client';

import { useEffect, useState } from 'react';
import { ChequeBookReportsClient } from './cheque-book-reports-client';
import { getChequeLeaves, getChequeBooks } from './actions';
import { type ChequeLeaf, type ChequeBook } from './schema';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FileText, File } from 'lucide-react';

interface ChequeBookReportsTabProps {
    key: number;
}

export function ChequeBookReportsTab({ key }: ChequeBookReportsTabProps) {
    const [initialReportData, setInitialReportData] = useState<ChequeLeaf[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [banks, setBanks] = useState<string[]>([]);
    const [bookNos, setBookNos] = useState<string[]>([]);

    const fetchData = async () => {
        setIsLoading(true);
        const [leaves, books] = await Promise.all([getChequeLeaves(), getChequeBooks()]);
        setInitialReportData(leaves);
        setBanks([...new Set(books.map(book => book.bankName))]);
        setBookNos([...new Set(books.map(book => book.bookNo))]);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [key]);

    const handleFilterChange = async (filters: { bank?: string; bookNo?: string; status?: string }) => {
        setIsLoading(true);
        const leaves = await getChequeLeaves(filters);
        setInitialReportData(leaves);
        setIsLoading(false);
    };

    return (
        <div>
             <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-2xl font-bold">Cheque Book Report</h2>
                    <p className="text-muted-foreground">A detailed list of every cheque leaf and its status.</p>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline">
                        <FileText className="mr-2 h-4 w-4" />
                        PDF
                    </Button>
                    <Button variant="outline">
                        <File className="mr-2 h-4 w-4" />
                        Excel
                    </Button>
                </div>
            </div>

            <div className="flex space-x-4 mb-4">
                <Select onValueChange={value => handleFilterChange({ bank: value })}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Filter by Bank..." />
                    </SelectTrigger>
                    <SelectContent>
                        {banks.map(bank => (
                            <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select onValueChange={value => handleFilterChange({ bookNo: value })}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Filter by Book No..." />
                    </SelectTrigger>
                    <SelectContent>
                        {bookNos.map(bookNo => (
                            <SelectItem key={bookNo} value={bookNo}>{bookNo}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                 <Select onValueChange={value => handleFilterChange({ status: value })}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Filter by Status..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Used">Used</SelectItem>
                        <SelectItem value="Unused">Unused</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <ChequeBookReportsClient 
                initialReportData={initialReportData} 
                isLoading={isLoading} 
            />
        </div>
    );
}
