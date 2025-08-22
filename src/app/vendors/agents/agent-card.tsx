
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
import { Mail, Phone, User, Building } from 'lucide-react';
import type { Agent } from './schema';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';


interface AgentCardProps {
  agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {

  const commissionRate = agent.commissionRate || 0;
  const totalPaid = agent.totalCommissionPaid || 0;

  let status: 'Paid' | 'Unpaid' | 'N/A' = 'N/A';
  let badgeClass = '';

  if (commissionRate > 0) {
    if (totalPaid >= commissionRate) {
        status = 'Paid';
        badgeClass = 'bg-green-100 text-green-800';
    } else {
        status = 'Unpaid';
        badgeClass = 'bg-red-100 text-red-800';
    }
  }

  return (
    <Card className="flex flex-col">
       <CardHeader className="flex-row items-start gap-4 space-y-0">
          <div className="flex-shrink-0">
              <div className="w-12 h-12 flex items-center justify-center bg-secondary rounded-lg">
                  <User className="h-6 w-6 text-secondary-foreground" />
              </div>
          </div>
          <div className="flex-1">
              <CardDescription>{agent.code}</CardDescription>
              <CardTitle className="text-lg">{agent.name}</CardTitle>
          </div>
      </CardHeader>
      <CardContent className="space-y-3 flex-grow">
        {agent.mobile && (
             <div className="flex items-center text-sm">
                <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{agent.mobile}</span>
            </div>
        )}
        {agent.email && (
            <div className="flex items-center text-sm">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="font-medium truncate">{agent.email}</span>
            </div>
        )}
        {agent.vendorName && (
            <div className="flex items-center text-sm">
                <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="font-medium truncate">{agent.vendorName}</span>
            </div>
        )}
        <div className="text-sm pt-2">
            <p className="text-muted-foreground">Commission</p>
            <p className="font-semibold text-lg">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalPaid)} / {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(commissionRate)}</p>
             {status !== 'N/A' && <Badge variant="secondary" className={cn("mt-1", badgeClass)}>{status}</Badge>}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/vendors/agents/add?code=${agent.code}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
