
'use client';

import { AddPaymentDialog } from '@/app/finance/payment/add-payment-dialog';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AddSingleReceiptPage() {
    const [isOpen, setIsOpen] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!isOpen) {
            router.back();
        }
    }, [isOpen, router]);

    const handleSuccess = () => {
        router.push('/finance/receipt-vouchers');
    }
    
    // This reuses the powerful AddPaymentDialog component for a single entry form
    return (
        <AddPaymentDialog
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            onPaymentAdded={handleSuccess}
            defaultValues={{
                type: 'Receipt',
                status: 'Received',
            }}
        />
    )
}
