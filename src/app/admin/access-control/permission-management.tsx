
"use client";

import { useState, useEffect, useTransition } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCombinedAccessControlData, savePermissions } from './actions';
import { type FeaturePermission } from './permissions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface PermissionManagementProps {}

export default function PermissionManagement(props: PermissionManagementProps) {
    const [permissions, setPermissions] = useState<FeaturePermission[]>([]);
    const [originalPermissions, setOriginalPermissions] = useState<FeaturePermission[]>([]);
    const [roles, setRoles] = useState<string[]>([]);
    const [selectedRole, setSelectedRole] = useState("Admin");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const result = await getCombinedAccessControlData();
            if (result.success) {
                const fetchedPermissions = result.permissions || [];
                setPermissions(JSON.parse(JSON.stringify(fetchedPermissions)));
                setOriginalPermissions(JSON.parse(JSON.stringify(fetchedPermissions)));
                setRoles(['Super Admin', 'Admin', 'Property Manager', 'Accountant', 'User', 'Developer']);
                const defaultRole = ['Super Admin', 'Admin', 'Property Manager', 'Accountant', 'User', 'Developer'].find(r => r !== 'Super Admin') || 'Admin';
                setSelectedRole(defaultRole);
            } else {
                toast({ variant: 'destructive', title: 'Error', description: result.error });
            }
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: "Could not fetch permission data." });
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handlePermissionChange = (featureName: string, actionName: string, role: string, checked: boolean) => {
        setPermissions(currentPermissions => 
            currentPermissions.map(feature => {
                if (feature.feature === featureName) {
                    return {
                        ...feature,
                        actions: feature.actions.map(action => {
                            if (action.action === actionName) {
                                const newAllowedRoles = checked 
                                    ? [...action.allowedRoles, role]
                                    : action.allowedRoles.filter(r => r !== role);
                                return { ...action, allowedRoles: Array.from(new Set(newAllowedRoles)) }; // Ensure uniqueness
                            }
                            return action;
                        })
                    };
                }
                return feature;
            })
        );
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        try {
            const result = await savePermissions(permissions);
            if (result.success) {
                toast({ title: 'Success', description: `Permissions have been saved successfully.` });
                setOriginalPermissions(JSON.parse(JSON.stringify(permissions)));
            } else {
                throw new Error(result.error || "An unknown error occurred.");
            }
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: (error as Error).message });
        }
        setIsSaving(false);
    };

    const handleCancelChanges = () => {
        setPermissions(JSON.parse(JSON.stringify(originalPermissions)));
    };

    const hasPermission = (featureName: string, actionName: string, role: string) => {
        const feature = permissions.find(f => f.feature === featureName);
        const action = feature?.actions.find(a => a.action === actionName);
        return action?.allowedRoles.includes(role) ?? false;
    };

    if (isLoading) {
        return <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    const availableActions = ["view", "create", "edit", "delete", "approve", "report"];
    const isDirty = JSON.stringify(permissions) !== JSON.stringify(originalPermissions);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Role-Based Feature Permissions</CardTitle>
                <CardDescription>
                    Assign specific feature access to user roles. This is the primary permission layer.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="flex flex-wrap gap-2 mb-4">
                    {roles.map(role => (
                        <Button
                            key={role}
                            variant={selectedRole === role ? "default" : "outline"}
                            onClick={() => setSelectedRole(role)}
                        >
                            {role}
                        </Button>
                    ))}
                </div>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="sticky left-0 bg-background z-10">Module / Feature</TableHead>
                                {availableActions.map(p => <TableHead key={p} className="capitalize text-center">{p}</TableHead>)}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {permissions.map(feature => (
                                <>
                                    <TableRow key={feature.feature} className="bg-muted/50">
                                        <TableCell colSpan={availableActions.length + 1} className="font-bold sticky left-0 bg-muted/50 z-10">{feature.feature}</TableCell>
                                    </TableRow>
                                    <TableRow key={`${feature.feature}-actions`}>
                                        <TableCell className="pl-8 sticky left-0 bg-background z-10">{feature.description}</TableCell>
                                         {availableActions.map(actionName => (
                                            <TableCell key={actionName} className="text-center">
                                                {feature.actions.some(a => a.action === actionName) ? (
                                                    <Checkbox
                                                        checked={hasPermission(feature.feature, actionName, selectedRole)}
                                                        onCheckedChange={(checked) => handlePermissionChange(feature.feature, actionName, selectedRole, !!checked)}
                                                        disabled={isSaving}
                                                    />
                                                ) : <span className="text-muted-foreground">-</span>}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </>    
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 mt-4">
                <Button 
                    variant="outline"
                    onClick={handleCancelChanges}
                    disabled={!isDirty || isSaving}
                >
                    Cancel
                </Button>
                <Button 
                    onClick={handleSaveChanges}
                    disabled={!isDirty || isSaving}
                >
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Save Changes
                </Button>
            </CardFooter>
        </Card>
    );
}
