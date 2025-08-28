
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
    FileText, 
    ArrowRight, 
    Users, 
    Home, 
    Banknote, 
    Clock, 
    Wrench, 
    Briefcase,
    AlertTriangle,
    Shuffle
} from 'lucide-react';

const reportList = [
    {
        title: "Due Payments Report",
        description: "View all upcoming and overdue rent payments from tenants and to landlords.",
        href: "/finance/due-payments",
        icon: <Clock className="h-8 w-8 text-primary" />,
    },
    {
        title: "Cheque Management",
        description: "Track and manage the status of all post-dated cheques.",
        href: "/finance/cheque-management",
        icon: <Banknote className="h-8 w-8 text-primary" />,
    },
    {
        title: "Book Management Reports",
        description: "Detailed reports on receipt and cheque book usage.",
        href: "/finance/book-management",
        icon: <FileText className="h-8 w-8 text-primary" />,
    },
    {
        title: "Contract Continuity",
        description: "Identify and resolve gaps or overlaps in tenant contracts.",
        href: "/admin/contract-continuity",
        icon: <AlertTriangle className="h-8 w-8 text-primary" />,
    },
    {
        title: "Tenant Movement History",
        description: "A log of all tenant relocations between properties or units.",
        href: "/admin/contract-continuity",
        icon: <Shuffle className="h-8 w-8 text-primary" />,
    },
    {
        title: "Vacant Units Report",
        description: "A list of all currently available units across all properties.",
        href: "/property/units/vacant",
        icon: <Home className="h-8 w-8 text-primary" />,
    },
     {
        title: "Asset Register",
        description: "View and manage a complete list of all company assets.",
        href: "/assets",
        icon: <Briefcase className="h-8 w-8 text-primary" />,
    },
];


export default function ReportCenterPage() {
  return (
    <div className="container mx-auto py-10">
       <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Report Center</h1>
        <p className="text-muted-foreground">
          Access all your financial and operational reports from one place.
        </p>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportList.map((report) => (
          <Card key={report.title} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start gap-4">
                 <div className="p-3 bg-primary/10 rounded-lg">
                    {report.icon}
                </div>
                <div>
                  <CardTitle>{report.title}</CardTitle>
                  <CardDescription className="mt-1">{report.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardFooter className="mt-auto">
              <Button asChild className="w-full">
                <Link href={report.href}>
                  View Report <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
