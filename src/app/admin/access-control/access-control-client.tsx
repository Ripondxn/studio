
'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, Loader2, Save } from 'lucide-react';
import { type FeaturePermission } from './permissions';
import { savePermissions } from './actions';
import { useToast } from '@/hooks/use-toast';
import React from 'react';

interface AccessControlClientProps {
  initialPermissions: FeaturePermission[];
  roles: string[];
}

export function AccessControlClient({ initialPermissions, roles }: AccessControlClientProps) {
  const [permissions, setPermissions] = useState<FeaturePermission[]>(initialPermissions);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleRoleChange = (
    featureIndex: number,
    actionIndex: number,
    role: string,
    checked: boolean
  ) => {
    const newPermissions = [...permissions];
    const action = newPermissions[featureIndex].actions[actionIndex];
    if (checked) {
      action.allowedRoles = [...action.allowedRoles, role];
    } else {
      action.allowedRoles = action.allowedRoles.filter((r) => r !== role);
    }
    setPermissions(newPermissions);
  };
  
  const handleSaveChanges = async () => {
    setIsSaving(true);
    const result = await savePermissions(permissions);
    if(result.success) {
        toast({ title: "Permissions Saved", description: "Access control settings have been updated."});
    } else {
        toast({ variant: 'destructive', title: "Error", description: result.error });
    }
    setIsSaving(false);
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/4">Feature</TableHead>
              <TableHead className="w-1/4">Action</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Allowed Roles</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissions.map((feature, featureIndex) => (
                <React.Fragment key={feature.feature}>
                    <Collapsible asChild>
                        <>
                        <TableRow className="bg-muted/50 font-bold">
                            <TableCell colSpan={4}>
                                <CollapsibleTrigger className="flex w-full items-center justify-between">
                                    <span>{feature.feature}</span>
                                    <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                                </CollapsibleTrigger>
                            </TableCell>
                        </TableRow>
                        <CollapsibleContent asChild>
                            <React.Fragment>
                            {feature.actions.map((action, actionIndex) => (
                                <TableRow key={action.action}>
                                <TableCell></TableCell>
                                <TableCell className="font-medium capitalize">{action.action.replace(/_/g, ' ')}</TableCell>
                                <TableCell className="text-muted-foreground">{action.description}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm">{action.allowedRoles.length} Role(s)</Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>Select Roles</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {roles.map((role) => (
                                        <DropdownMenuCheckboxItem
                                            key={role}
                                            checked={action.allowedRoles.includes(role)}
                                            onCheckedChange={(checked) => handleRoleChange(featureIndex, actionIndex, role, !!checked)}
                                            disabled={role === 'Super Admin'}
                                        >
                                            {role}
                                        </DropdownMenuCheckboxItem>
                                        ))}
                                    </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                                </TableRow>
                            ))}
                            </React.Fragment>
                        </CollapsibleContent>
                        </>
                    </Collapsible>
                </React.Fragment>
            ))}
          </TableBody>
        </Table>
        <div className="p-4 border-t flex justify-end">
            <Button onClick={handleSaveChanges} disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Changes
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
