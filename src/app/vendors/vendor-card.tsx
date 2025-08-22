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
import { Mail, Phone, Wrench } from 'lucide-react';
import type { Vendor } from './schema';
import Link from 'next/link';

interface VendorCardProps {
  vendor: Vendor;
}

export function VendorCard({ vendor }: VendorCardProps) {

  return (
    <Card className="flex flex-col">
       <CardHeader className="flex-row items-start gap-4 space-y-0">
          <div className="flex-shrink-0">
              <div className="w-12 h-12 flex items-center justify-center bg-secondary rounded-lg">
                  <Wrench className="h-6 w-6 text-secondary-foreground" />
              </div>
          </div>
          <div className="flex-1">
              <CardDescription>{vendor.code}</CardDescription>
              <CardTitle className="text-lg">{vendor.name}</CardTitle>
          </div>
      </CardHeader>
      <CardContent className="space-y-3 flex-grow">
        {vendor.mobile && (
             <div className="flex items-center text-sm">
                <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{vendor.mobile}</span>
            </div>
        )}
        {vendor.email && (
            <div className="flex items-center text-sm">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="font-medium truncate">{vendor.email}</span>
            </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/vendors/add?code=${vendor.code}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
