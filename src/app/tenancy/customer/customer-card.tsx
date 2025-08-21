
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
import { Mail, Phone, User } from 'lucide-react';
import type { Customer } from './schema';
import Link from 'next/link';

interface CustomerCardProps {
  customer: Customer;
}

export function CustomerCard({ customer }: CustomerCardProps) {

  return (
    <Card className="flex flex-col">
       <CardHeader className="flex-row items-start gap-4 space-y-0">
          <div className="flex-shrink-0">
              <div className="w-12 h-12 flex items-center justify-center bg-secondary rounded-lg">
                  <User className="h-6 w-6 text-secondary-foreground" />
              </div>
          </div>
          <div className="flex-1">
              <CardDescription>{customer.code}</CardDescription>
              <CardTitle className="text-lg">{customer.name}</CardTitle>
          </div>
      </CardHeader>
      <CardContent className="space-y-3 flex-grow">
        {customer.mobile && (
             <div className="flex items-center text-sm">
                <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{customer.mobile}</span>
            </div>
        )}
        {customer.email && (
            <div className="flex items-center text-sm">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="font-medium truncate">{customer.email}</span>
            </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/tenancy/customer/add?code=${customer.code}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
