
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, FileText, User } from 'lucide-react';
import type { Tenant } from './schema';
import Link from 'next/link';

interface TenantCardProps {
  tenant: Tenant;
}

export function TenantCard({ tenant }: TenantCardProps) {

  return (
    <Card className="flex flex-col">
       <CardHeader className="flex-row items-start gap-4 space-y-0">
          <div className="flex-shrink-0">
              <div className="w-12 h-12 flex items-center justify-center bg-secondary rounded-lg">
                  <User className="h-6 w-6 text-secondary-foreground" />
              </div>
          </div>
          <div className="flex-1">
              <CardDescription>{tenant.code}</CardDescription>
              <CardTitle className="text-lg">{tenant.name}</CardTitle>
          </div>
      </CardHeader>
      <CardContent className="space-y-3 flex-grow">
        {tenant.mobile && (
             <div className="flex items-center text-sm">
                <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{tenant.mobile}</span>
            </div>
        )}
        {tenant.email && (
            <div className="flex items-center text-sm">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="font-medium truncate">{tenant.email}</span>
            </div>
        )}
        {tenant.contractNo && (
            <div className="flex items-center text-sm">
                <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-xs">Contract:</span>
                <Button variant="link" asChild className="p-1 h-auto font-normal text-xs">
                    <Link href={`/tenancy/contract?id=${tenant.contractId}`}>{tenant.contractNo}</Link>
                </Button>
            </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/tenancy/tenants/add?code=${tenant.code}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
