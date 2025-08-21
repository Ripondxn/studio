
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
import { Mail, Phone } from 'lucide-react';
import type { Landlord } from './schema';
import Link from 'next/link';

interface LandlordCardProps {
  landlord: Landlord;
}

export function LandlordCard({ landlord }: LandlordCardProps) {

  return (
    <Card>
      <CardHeader>
        <CardDescription>{landlord.code}</CardDescription>
        <CardTitle>{landlord.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {landlord.mobile && (
             <div className="flex items-center text-sm">
                <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{landlord.mobile}</span>
            </div>
        )}
        {landlord.email && (
            <div className="flex items-center text-sm">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="font-medium truncate">{landlord.email}</span>
            </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/landlord/add?code=${landlord.code}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
