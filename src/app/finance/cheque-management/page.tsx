
'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChequeManagementTab } from './cheque-management-tab';
import { ChequeBookTab } from './cheque-book-tab';
import { ChequeBookReportsTab } from './cheque-book-reports-tab';

export default function ChequeManagementPage() {
    const [key, setKey] = useState(0);

    const handleSuccess = () => {
        setKey(prevKey => prevKey + 1);
    };

    return (
        <Tabs defaultValue="management">
            <TabsList className="mb-4">
                <TabsTrigger value="management">Cheque Management</TabsTrigger>
                <TabsTrigger value="books">Cheque Book</TabsTrigger>
                <TabsTrigger value="reports">Cheque Book Reports</TabsTrigger>
            </TabsList>
            <TabsContent value="management">
                <ChequeManagementTab key={key} onSuccess={handleSuccess} />
            </TabsContent>
            <TabsContent value="books">
                <ChequeBookTab key={key} onSuccess={handleSuccess} />
            </TabsContent>
            <TabsContent value="reports">
                <ChequeBookReportsTab key={key} />
            </TabsContent>
        </Tabs>
    );
}
