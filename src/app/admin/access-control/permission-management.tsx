
"use client";

import { useState, useTransition } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { type Module, type Permission } from './schema';
import { savePermissions } from './actions';

interface PermissionManagementProps {
  module?: Module | null;
  permissions: Permission[];
  roles: string[];
  onOpenChange: (isOpen: boolean) => void;
}

export default function PermissionManagement({ module, permissions, roles, onOpenChange }: PermissionManagementProps) {
    const [currentPermissions, setCurrentPermissions] = useState(permissions || []);
    const [isPending, startTransition] = useTransition();

    if (!module) {
        return null;
    }

    const handlePermissionChange = (feature: string, action: string, role: string, checked: boolean) => {
        const updatedPermissions = currentPermissions.map(p => {
            if (p.feature === feature) {
                const updatedActions = p.actions.map(a => {
                    if (a.action === action) {
                        const updatedRoles = checked 
                            ? [...a.allowedRoles, role]
                            : a.allowedRoles.filter(r => r !== role);
                        return { ...a, allowedRoles: updatedRoles };
                    }
                    return a;
                });
                return { ...p, actions: updatedActions };
            }
            return p;
        });
        setCurrentPermissions(updatedPermissions);
    };

    const handleSaveChanges = () => {
        startTransition(async () => {
            console.log("Saving permissions...", currentPermissions);
            onOpenChange(false);
        });
    };

    const relevantPermissions = currentPermissions.filter(p => p.feature === module.name);

    return (
        <Dialog open={true} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Manage Permissions for {module.name}</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                    {roles.map(role => (
                        <div key={role} className="border p-4 rounded-lg">
                            <h3 className="font-semibold mb-2">{role}</h3>
                            {relevantPermissions.map(p => (
                                <div key={p.feature}>
                                    {p.actions.map(action => (
                                        <div key={action.action} className="flex items-center space-x-2">
                                            <Checkbox 
                                                id={`${p.feature}-${action.action}-${role}`}
                                                checked={action.allowedRoles.includes(role)}
                                                onCheckedChange={(checked) => handlePermissionChange(p.feature, action.action, role, !!checked)}
                                            />
                                            <Label htmlFor={`${p.feature}-${action.action}-${role}`}>{action.description}</Label>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)} variant="outline">Cancel</Button>
                    <Button onClick={handleSaveChanges} disabled={isPending}>
                        {isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
