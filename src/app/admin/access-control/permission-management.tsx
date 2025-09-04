
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type Role, type Permission } from './schema'; // Assuming you have a schema file

// Defines the structure for modules and their permissions
const initialModules = {
    "Lease": ["Properties", "Landlords", "Lease Contracts"],
    "Finance": ["Invoices", "Bills", "Payments", "Chart of Accounts", "Book Management"],
    "Tenant": ["Tenant Directory", "Tenant Contracts"],
    "Customer": ["Customer List", "Service Invoices"],
    "Vendor": ["Vendor List", "Vendor Bills"],
    "Products": ["Item Catalog", "Service Catalog"],
    "Asset Management": ["Asset List", "Depreciation Schedules"],
    "Maintenance": ["Maintenance Tickets", "Service Contracts"],
    "Project Management": ["Projects", "Tasks", "Gantt Chart"],
    "Human Resource": ["Employees", "Leave Management", "Compensation"],
    "Stores": ["Inventory", "Stock Locations", "Purchase Orders"],
    "Rent-A-Car": ["Vehicle Fleet", "Bookings", "Rental Agreements"],
    "Car Sales": ["Vehicle Inventory", "Sales", "Purchase Agreements"],
};

const permissions = ["view", "create", "edit", "delete"];

// Helper function to create full permissions for all modules
const createFullPermissions = () => {
    const perms: { [key: string]: { [key: string]: string[] } } = {};
    for (const module in initialModules) {
        perms[module] = {};
        for (const subModule of initialModules[module as keyof typeof initialModules]) {
            perms[module][subModule] = ["view", "create", "edit", "delete"];
        }
    }
    return perms;
};

// Mock role data - in a real app, this would come from your database
const initialRoles = {
    "Super Admin": createFullPermissions(),
    "Admin": {
        "Lease": { "Properties": ["view", "create", "edit", "delete"], "Landlords": ["view", "create", "edit", "delete"], "Lease Contracts": ["view", "create", "edit", "delete"] },
        "Finance": { "Invoices": ["view", "create", "edit", "delete"], "Bills": ["view", "create", "edit", "delete"], "Payments": ["view", "create", "edit", "delete"], "Chart of Accounts": ["view", "create", "edit", "delete"], "Book Management": ["view", "create", "edit", "delete"] },
    },
    "Accountant": {
        "Finance": { "Invoices": ["view", "create", "edit"], "Bills": ["view", "create", "edit"], "Payments": ["view", "create"], "Chart of Accounts": ["view"], "Book Management": ["view", "create", "edit"] },
    },
    "User": {
        "Lease": { "Properties": ["view"] },
    }
};

interface PermissionManagementProps {
    // In a real app, you would pass initial roles and permissions from server actions
}

export default function PermissionManagement(props: PermissionManagementProps) {
    const [roles, setRoles] = useState<any>(initialRoles);
    const [selectedRole, setSelectedRole] = useState("Admin");

    const handlePermissionChange = (module: string, subModule: string, permission: string, checked: boolean) => {
        if (selectedRole === 'Super Admin') return;
        setRoles((prevRoles:any) => {
            const newRoles = JSON.parse(JSON.stringify(prevRoles));
            if (!newRoles[selectedRole]) newRoles[selectedRole] = {};
            if (!newRoles[selectedRole][module]) newRoles[selectedRole][module] = {};
            if (!newRoles[selectedRole][module][subModule]) newRoles[selectedRole][module][subModule] = [];

            if (checked) {
                newRoles[selectedRole][module][subModule].push(permission);
            } else {
                const index = newRoles[selectedRole][module][subModule].indexOf(permission);
                if (index > -1) newRoles[selectedRole][module][subModule].splice(index, 1);
            }
            return newRoles;
        });
    };

    const hasPermission = (module: string, subModule: string, permission: string) => {
        return roles[selectedRole]?.[module]?.[subModule]?.includes(permission) ?? false;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Role-Based Feature Permissions</CardTitle>
                <CardDescription>
                    Assign specific feature access to user roles. This is the primary permission layer.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="flex space-x-2 mb-4">
                    {Object.keys(roles).map(role => (
                        <Button
                            key={role}
                            variant={selectedRole === role ? "default" : "outline"}
                            onClick={() => setSelectedRole(role)}
                        >
                            {role}
                        </Button>
                    ))}
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Module / Feature</TableHead>
                            {permissions.map(p => <TableHead key={p} className="capitalize text-center">{p}</TableHead>)}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Object.entries(initialModules).map(([module, subModules]) => (
                            <>
                                <TableRow key={module} className="bg-gray-50 dark:bg-gray-800">
                                    <TableCell colSpan={permissions.length + 1} className="font-bold">{module}</TableCell>
                                </TableRow>
                                {subModules.map(subModule => (
                                    <TableRow key={subModule}>
                                        <TableCell className="pl-8">{subModule}</TableCell>
                                        {permissions.map(permission => (
                                            <TableCell key={permission} className="text-center">
                                                <Checkbox
                                                    checked={hasPermission(module, subModule, permission)}
                                                    onCheckedChange={(checked) => handlePermissionChange(module, subModule, permission, !!checked)}
                                                    disabled={selectedRole === 'Super Admin'}
                                                />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </>
                        ))}
                    </TableBody>
                </Table>
                <div className="flex justify-end mt-6">
                    <Button 
                        onClick={() => alert("Permissions saved! (This would call a server action in a real app)")}
                        disabled={selectedRole === 'Super Admin'}
                    >
                        Save Changes for {selectedRole}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
