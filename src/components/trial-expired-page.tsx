import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ShoppingCart } from 'lucide-react';

interface TrialExpiredPageProps {
    daysRemaining: number;
    expiryDate: string;
}

export function TrialExpiredPage({ daysRemaining, expiryDate }: TrialExpiredPageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
          <CardTitle className="mt-4 text-2xl font-bold">Your Trial Has Expired</CardTitle>
          <CardDescription>
            Your 30-day free trial ended on {expiryDate}. To continue using PropVue, please purchase a license.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            All your data is safe and will be available once you activate your license.
            If you have any questions, please contact our support team.
          </p>
        </CardContent>
        <div className="p-6 pt-0">
             <Button className="w-full">
                <ShoppingCart className="mr-2 h-4 w-4" /> Purchase a License
            </Button>
        </div>
      </Card>
    </div>
  );
}
