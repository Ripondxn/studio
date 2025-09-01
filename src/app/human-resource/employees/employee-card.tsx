
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
import { Mail, Phone, User, Briefcase } from 'lucide-react';
import type { Employee } from './schema';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCurrency } from '@/context/currency-context';

interface EmployeeCardProps {
  employee: Employee;
}

export function EmployeeCard({ employee }: EmployeeCardProps) {
  const { formatCurrency } = useCurrency();

  return (
    <Card className="flex flex-col">
       <CardHeader className="flex-row items-start gap-4 space-y-0">
          <Avatar className="h-12 w-12">
            <AvatarImage src={employee.photo || undefined} />
            <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
              <CardDescription>{employee.employeeId}</CardDescription>
              <CardTitle className="text-lg">{employee.name}</CardTitle>
          </div>
      </CardHeader>
      <CardContent className="space-y-3 flex-grow">
         {employee.profession && (
            <div className="flex items-center text-sm">
                <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="font-medium truncate">{employee.profession}</span>
            </div>
        )}
        {employee.mobile && (
             <div className="flex items-center text-sm">
                <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{employee.mobile}</span>
            </div>
        )}
        {employee.email && (
            <div className="flex items-center text-sm">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="font-medium truncate">{employee.email}</span>
            </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/human-resource/employees/add?id=${employee.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
