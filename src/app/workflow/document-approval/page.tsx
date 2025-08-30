
'use client';

import { useState, useEffect, useMemo } from 'react';
import { type Role, type Status } from './types';
import type { DocumentForApproval } from './schema';
import { getDocumentsForApproval } from './actions';
import { columns } from './columns';
import { DataTable } from './data-table';
import { AddDocumentDialog } from './add-dialog';
import { type UserRole } from '@/app/admin/user-roles/schema';
import { useRouter } from 'next/navigation';

export default function DocumentApprovalPage() {
    const [documents, setDocuments] = useState<DocumentForApproval[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<UserRole | null>(null);
    const router = useRouter();

    const refreshData = async (user: UserRole) => {
        setIsLoading(true);
        const data = await getDocumentsForApproval(user);
        setDocuments(data);
        setIsLoading(false);
    }
    
    useEffect(() => {
        const userProfile = sessionStorage.getItem('userProfile');
        if (userProfile) {
            const parsedProfile = JSON.parse(userProfile);
            setCurrentUser(parsedProfile);
            refreshData(parsedProfile);
        } else {
            router.push('/login');
        }
    }, [router]);
    
    if (!currentUser) {
        return <div>Loading...</div>; // Or a spinner
    }

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Document Approval Workflow</h1>
                    <p className="text-muted-foreground">
                        Manage and track physical documents through the approval process.
                    </p>
                </div>
                 <AddDocumentDialog 
                    currentUser={currentUser} 
                    onSuccess={() => refreshData(currentUser)} 
                />
            </div>

            <DataTable 
                columns={columns({ currentUser: currentUser, onUpdate: () => refreshData(currentUser) })}
                data={documents}
                isLoading={isLoading}
            />
        </div>
    )
}
