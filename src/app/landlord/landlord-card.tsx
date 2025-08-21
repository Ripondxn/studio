
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
import { Mail, Phone, Banknote, FileText, Paperclip } from 'lucide-react';
import type { Landlord } from './schema';
import Link from 'next/link';

interface LandlordCardProps {
  landlord: Landlord;
}

export function LandlordCard({ landlord }: LandlordCardProps) {

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardDescription>{landlord.code}</CardDescription>
        <CardTitle>{landlord.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 flex-grow">
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
        {landlord.bankName && (
            <div className="flex items-center text-sm">
                <Banknote className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="font-medium truncate">{landlord.bankName}</span>
            </div>
        )}
        <div className="flex justify-between text-sm pt-2">
            <div className="flex items-center gap-1">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{landlord.leaseContracts?.length || 0}</span>
                <span className="text-muted-foreground">Contracts</span>
            </div>
             <div className="flex items-center gap-1">
                <Paperclip className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{landlord.attachments?.length || 0}</span>
                <span className="text-muted-foreground">Files</span>
            </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/landlord/add?code=${landlord.code}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
