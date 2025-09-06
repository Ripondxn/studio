
'use client';

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Printer } from "lucide-react";
import { type ModuleSettings, type Permission, type UserOverride } from "./schema";
import { type UserRole } from "../user-roles/schema";
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface PermissionReportProps {
    modules: ModuleSettings;
    permissions: Permission[];
    users: UserRole[];
    overrides: UserOverride[];
    roles: string[];
}

export function PermissionReport({ modules, permissions, users, overrides, roles }: PermissionReportProps) {
    const printRef = React.useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        const printContent = printRef.current?.innerHTML;
        if (printContent) {
            const printWindow = window.open('', '', 'height=800,width=1000');
            printWindow?.document.write('<html><head><title>Permission Report</title>');
            printWindow?.document.write('<style>body { font-family: sans-serif; } table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #ddd; padding: 8px; text-align: left; } th { background-color: #f2f2f2; } h2, h3, h4 { margin-top: 1.5em; margin-bottom: 0.5em; } </style>');
            printWindow?.document.write('</head><body>');
            printWindow?.document.write(printContent);
            printWindow?.document.write('</body></html>');
            printWindow?.document.close();
            printWindow?.print();
        }
    };
    
    const getRolePermissions = (role: string) => {
        return permissions.filter(p => p.role === role);
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline">
                    <Printer className="mr-2 h-4 w-4" />
                    Permission Report
                </Button>
            </SheetTrigger>
            <SheetContent className="w-[80vw] sm:w-[90vw] max-w-none">
                <SheetHeader>
                    <SheetTitle>Permission Report</SheetTitle>
                </SheetHeader>
                <div className="py-4" ref={printRef}>
                    <h2 className="text-xl font-bold mb-4">Role-Based Permissions</h2>
                    <Accordion type="multiple" className="w-full">
                        {roles.map(role => {
                            const rolePermissions = getRolePermissions(role);
                            const usersInRole = users.filter(u => u.role === role);

                            return (
                                <AccordionItem value={role} key={role}>
                                    <AccordionTrigger>{role}</AccordionTrigger>
                                    <AccordionContent>
                                        <div>
                                            <h4 className="font-semibold mb-2">Permissions for {role}:</h4>
                                            {rolePermissions.length > 0 ? (
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>Module</th>
                                                            <th>Permissions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {rolePermissions.map(p => (
                                                            <tr key={p.moduleId}>
                                                                <td>{modules[p.moduleId]?.name}</td>
                                                                <td>{p.permissions.join(', ')}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <p>No specific module permissions defined for this role.</p>
                                            )}

                                            <h4 className="font-semibold mt-4 mb-2">Users in this role ({usersInRole.length}):</h4>
                                            {usersInRole.length > 0 ? (
                                                <ul>
                                                    {usersInRole.map(user => (
                                                        <li key={user.id}>- {user.name} ({user.email})</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p>No users are assigned to this role.</p>
                                            )}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            );
                        })}
                    </Accordion>

                    <h2 className="text-xl font-bold mb-4 mt-8">User-Specific Permission Overrides</h2>
                    {overrides.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Allowed Modules</th>
                                </tr>
                            </thead>
                            <tbody>
                                {overrides.map(override => (
                                    <tr key={override.email}>
                                        <td>{users.find(u => u.email === override.email)?.name} ({override.email})</td>
                                        <td>{override.allowedModules.map(m => modules[m]?.name).join(', ')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No user-specific overrides are currently configured.</p>
                    )}
                </div>
                <Button onClick={handlePrint} className="mt-4">
                    <Printer className="mr-2 h-4 w-4" />
                    Print Report
                </Button>
            </SheetContent>
        </Sheet>
    );
}
