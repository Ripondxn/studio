'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
    ArrowRight,
    Clock, 
    Banknote,
    FileText,
    AlertTriangle,
    Shuffle,
    Home
} from 'lucide-react';

const reportList = [
    {
        title: "Due Payments Report",
        href: "/finance/due-payments",
        icon: <Clock className="h-6 w-6 text-primary" />,
    },
    {
        title: "Cheque Management",
        href: "/finance/cheque-management",
        icon: <Banknote className="h-6 w-6 text-primary" />,
    },
    {
        title: "Contract Continuity",
        href: "/admin/contract-continuity",
        icon: <AlertTriangle className="h-6 w-6 text-primary" />,
    },
     {
        title: "Vacant Units Report",
        href: "/property/units/vacant",
        icon: <Home className="h-6 w-6 text-primary" />,
    },
];

export function ReportCenterWidget() {
  return (
    <Card className="h-full">
        <CardHeader>
            <CardTitle>Report Center</CardTitle>
            <CardDescription>Quick access to key operational and financial reports.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {reportList.map((report) => (
                <div key={report.title} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            {report.icon}
                        </div>
                        <p className="font-medium">{report.title}</p>
                    </div>
                    <Button asChild variant="ghost" size="icon">
                        <Link href={report.href}>
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            ))}
        </CardContent>
    </Card>
  );
}
