
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Building2, Loader2, AlertCircle } from 'lucide-react';
import { useCurrency } from '@/context/currency-context';
import { initiatePayment } from './actions';
import { useState } from 'react';

function PaymentPageContent() {
    const searchParams = useSearchParams();
    const { formatCurrency } = useCurrency();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const invoiceNo = searchParams.get('invoice');
    const amount = searchParams.get('amount');
    const description = searchParams.get('description');

    const handlePayment = async () => {
        if (!invoiceNo || !amount) return;

        setIsLoading(true);
        setError(null);

        const result = await initiatePayment({
            invoiceNo,
            amount: parseFloat(amount),
            description: description || `Payment for Invoice ${invoiceNo}`
        });

        if (result.success && result.paymentUrl) {
            // In a real scenario, we would redirect the user to the payment gateway
            window.location.href = result.paymentUrl;
        } else {
            setError(result.error || 'Failed to initiate payment. Please try again.');
        }

        setIsLoading(false);
    }
    
    if (!invoiceNo || !amount) {
        return (
             <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Invalid Payment Link</AlertTitle>
                <AlertDescription>
                    The payment link is missing required information. Please contact support.
                </AlertDescription>
            </Alert>
        )
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                 <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full">
                    <Building2 className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-headline text-2xl">Trust Famous Real Estate</CardTitle>
                <CardDescription>
                    Secure Online Payment
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg bg-muted/50 text-center">
                    <p className="text-sm text-muted-foreground">Amount to Pay</p>
                    <p className="text-4xl font-bold font-mono tracking-tight">{formatCurrency(parseFloat(amount))}</p>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                    <p><strong>For:</strong> {description || `Invoice ${invoiceNo}`}</p>
                    <p><strong>Reference:</strong> {invoiceNo}</p>
                </div>
                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Payment Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
            </CardContent>
            <CardFooter>
                 <Button className="w-full" onClick={handlePayment} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                    {isLoading ? 'Processing...' : 'Pay with Ziina'}
                </Button>
            </CardFooter>
        </Card>
    );
}


export default function PayPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted p-4">
            <Suspense fallback={<Loader2 className="h-10 w-10 animate-spin text-primary" />}>
                <PaymentPageContent />
            </Suspense>
        </div>
    )
}
