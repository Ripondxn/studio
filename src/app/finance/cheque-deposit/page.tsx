import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function ChequeDepositPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold font-headline">Cheque Deposit</h1>
            <p className="text-muted-foreground">
                Manage and track cheque deposits.
            </p>
        </div>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Under Construction</CardTitle>
        </CardHeader>
        <CardContent>
            <p>This page is currently under construction. Please check back later.</p>
        </CardContent>
      </Card>
    </div>
  );
}
