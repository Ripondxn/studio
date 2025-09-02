
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HelpCircle, Printer } from 'lucide-react';
import { useRef } from 'react';

export function AccessControlGuide() {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        const printContent = printRef.current?.innerHTML;
        if (printContent) {
            const printWindow = window.open('', '', 'height=800,width=800');
            if (printWindow) {
                printWindow.document.write('<html><head><title>Access Control Guide</title>');
                printWindow.document.write('<style>body { font-family: sans-serif; line-height: 1.6; } h3 { font-size: 1.25rem; margin-top: 1.5rem; margin-bottom: 0.5rem; border-bottom: 1px solid #ccc; padding-bottom: 0.25rem; } ol, ul { padding-left: 1.5rem; } li { margin-bottom: 0.5rem; } strong { font-weight: bold; } code { background-color: #f1f1f1; padding: 2px 4px; border-radius: 4px; font-family: monospace; } </style>');
                printWindow.document.write('</head><body>');
                printWindow.document.write(printContent);
                printWindow.document.write('</body></html>');
                printWindow.document.close();
                printWindow.print();
            }
        }
    };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <HelpCircle className="mr-2 h-4 w-4" />
          How to Use
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Guide: Managing Access Control</DialogTitle>
          <DialogDescription>
            How to configure user access for different modules and features.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto p-1" ref={printRef}>
            <div className="prose prose-sm max-w-none p-4">
                <p>This system uses a combination of three settings to give you precise control over what each user can see and do in the application.</p>
                
                <h3>1. Module Management (Global Switch)</h3>
                <p>This is the master switch for major parts of the application. If a module is turned <strong>off</strong> here, <strong>no one</strong> can access it, regardless of their role or individual permissions. Use this to globally enable or disable features for your entire business.</p>
                
                <h3>2. User Permission Overrides (Individual Access)</h3>
                <p>This is the most specific level of control. It allows you to grant a specific user access to certain modules, completely ignoring their assigned role for those modules. This is useful for special cases where a user needs a unique set of permissions.</p>
                <ul>
                    <li><strong>How it works:</strong> Select a user, and then check the modules they should have access to.</li>
                    <li><strong>Important:</strong> If a user has an override set, it will always take priority over their role's permissions. To make them use their role permissions again, you must clear their override.</li>
                </ul>

                <h3>3. Role-Based Feature Permissions (Primary Control)</h3>
                <p>This is the main way you will manage permissions for most users. You define what each <strong>role</strong> (e.g., "Admin", "User", "Accountant") can do.</p>
                <ol>
                    <li>Find the feature you want to configure (e.g., "Finance", "Properties").</li>
                    <li>For each action (like `view` or `edit`), click the "Role(s)" button.</li>
                    <li>Check the boxes for each role that should be allowed to perform that action.</li>
                    <li>Save your changes.</li>
                </ol>
                <p>The sidebar navigation is built based on these permissions. A user will only see a module in the sidebar if their role (or a user-specific override) gives them permission to access at least one feature within that module.</p>
            </div>
        </div>
         <DialogFooter>
            <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" /> Print Guide
            </Button>
            <DialogClose asChild>
                <Button>Close</Button>
            </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
