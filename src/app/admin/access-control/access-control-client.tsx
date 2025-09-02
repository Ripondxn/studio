
'use client';

import { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ChevronDown, Loader2, Save, FileText, FileSpreadsheet } from 'lucide-react';
import { type FeaturePermission } from './permissions';
import { savePermissions } from './actions';
import { useToast } from '@/hooks/use-toast';
import React from 'react';
import { cn } from '@/lib/utils';

// Extend jsPDF type to include autoTable from the plugin
declare module 'jspdf' {
    interface jsPDF {
      autoTable: (options: any) => jsPDF;
    }
}

interface AccessControlClientProps {
  initialPermissions: FeaturePermission[];
  roles: string[];
}

export function AccessControlClient({ initialPermissions, roles }: AccessControlClientProps) {
  const [permissions, setPermissions] = useState<FeaturePermission[]>(initialPermissions);
  const [isSaving, setIsSaving] = useState(false);
  const [openFeatures, setOpenFeatures] = useState<Record<string, boolean>>(() => {
    // Initially open all feature sections
    const initialState: Record<string, boolean> = {};
    initialPermissions.forEach(p => {
        initialState[p.feature] = true;
    });
    return initialState;
  });
  const { toast } = useToast();
  
  const toggleFeature = (featureName: string) => {
    setOpenFeatures(prev => ({ ...prev, [featureName]: !prev[featureName] }));
  };

  const handleRoleChange = (
    featureIndex: number,
    actionIndex: number,
    role: string,
    checked: boolean
  ) => {
    const newPermissions = [...permissions];
    const action = newPermissions[featureIndex].actions[actionIndex];
    if (checked) {
      action.allowedRoles = [...new Set([...action.allowedRoles, role])];
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

  const handleExportPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    const head = [['Feature', 'Action', ...roles]];
    const body = permissions.flatMap(feature => 
        feature.actions.map(action => [
            feature.feature,
            action.action.replace(/_/g, ' '),
            ...roles.map(role => (action.allowedRoles.includes(role) ? '✔' : ''))
        ])
    );
    doc.text("Role-Based Feature Permissions", 14, 10);
    doc.autoTable({
        head,
        body,
        startY: 15,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [42, 63, 84] }
    });
    doc.save('role_permissions.pdf');
  };

  const handleExportExcel = () => {
    const dataToExport = permissions.flatMap(feature => 
        feature.actions.map(action => {
            const row: {[key: string]: string} = {
                'Feature': feature.feature,
                'Action': action.action.replace(/_/g, ' ')
            };
            roles.forEach(role => {
                row[role] = action.allowedRoles.includes(role) ? 'Yes' : 'No';
            });
            return row;
        })
    );
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Permissions');
    XLSX.writeFile(wb, 'role_permissions.xlsx');
  };

  return (
    <CardContent className="p-0">
        <div className="p-4 border-b flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={handleExportPDF}><FileText className="mr-2 h-4 w-4" /> Export PDF</Button>
            <Button variant="outline" size="sm" onClick={handleExportExcel}><FileSpreadsheet className="mr-2 h-4 w-4" /> Export Excel</Button>
        </div>
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
                        <TableRow className="bg-muted/50 font-bold hover:bg-muted/60 cursor-pointer" onClick={() => toggleFeature(feature.feature)}>
                            <TableCell colSpan={4}>
                                <div className="flex w-full items-center justify-between">
                                    <span>{feature.feature}</span>
                                    <ChevronDown className={cn("h-4 w-4 transition-transform", openFeatures[feature.feature] && "rotate-180")} />
                                </div>
                            </TableCell>
                        </TableRow>
                        {openFeatures[feature.feature] && feature.actions.map((action, actionIndex) => (
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
                ))}
            </TableBody>
        </Table>
        <CardFooter className="p-4 border-t flex justify-end">
            <Button onClick={handleSaveChanges} disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Changes
            </Button>
        </CardFooter>
    </CardContent>
  );
}
