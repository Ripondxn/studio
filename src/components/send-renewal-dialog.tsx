
'use client';

import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from './ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from './ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Loader2, Mail } from 'lucide-react';

type ExpiringContract = {
  unit: string;
  tenant: string;
  endDate: string;
};

type SendRenewalDialogProps = {
  expiringContracts: ExpiringContract[];
};

const emailTemplate = `Dear [Tenant Name],

This is a friendly reminder that your tenancy contract for unit [Unit No.] is due for renewal on [End Date].

We hope you've enjoyed your time with us and would love for you to continue your stay. Please let us know if you wish to renew your contract.

Best regards,
Atlas PM`;

const whatsappTemplate = `Hi [Tenant Name]! Just a reminder that your contract for unit [Unit No.] expires on [End Date]. Let us know if you'd like to renew! Thanks, Atlas PM`;


export function SendRenewalDialog({
  expiringContracts,
}: SendRenewalDialogProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [notificationType, setNotificationType] = useState<'email' | 'whatsapp'>('email');
  const [selectedTenants, setSelectedTenants] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState(emailTemplate);

  const handleToggleAll = () => {
    if (selectedTenants.length === expiringContracts.length) {
      setSelectedTenants([]);
    } else {
      setSelectedTenants(expiringContracts.map(c => c.tenant));
    }
  };

  const handleSelectTenant = (tenantName: string) => {
    setSelectedTenants(prev => 
      prev.includes(tenantName)
        ? prev.filter(t => t !== tenantName)
        : [...prev, tenantName]
    );
  };
  
  const handleTypeChange = (isWhatsapp: boolean) => {
    const type = isWhatsapp ? 'whatsapp' : 'email';
    setNotificationType(type);
    setMessage(type === 'email' ? emailTemplate : whatsappTemplate);
  }

  const handleSend = () => {
    if (selectedTenants.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No tenants selected',
        description: 'Please select at least one tenant to notify.',
      });
      return;
    }

    setIsSending(true);

    // Simulate sending action
    setTimeout(() => {
      toast({
        title: 'Simulation Complete',
        description: `This is a demo. In a real app, ${selectedTenants.length} ${notificationType} notifications would have been sent.`,
      });
      setIsSending(false);
      setIsOpen(false);
      setSelectedTenants([]);
    }, 1500);
  };
  
  const isAllSelected = useMemo(() => selectedTenants.length > 0 && selectedTenants.length === expiringContracts.length, [selectedTenants, expiringContracts]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
            <Button variant="outline"><Mail className="mr-2 h-4 w-4"/> Send Renewal Email</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
            <DialogTitle>Send Renewal Notifications</DialogTitle>
            <DialogDescription>
                Select tenants and choose the notification method.
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="flex items-center space-x-2">
                    <Label htmlFor="notification-type">Email</Label>
                    <Switch 
                        id="notification-type"
                        checked={notificationType === 'whatsapp'}
                        onCheckedChange={handleTypeChange}
                    />
                    <Label htmlFor="notification-type">WhatsApp</Label>
                </div>
                
                <div className="h-64 rounded-md border">
                    <ScrollArea className="h-full w-full">
                    <Table>
                        <TableHeader className="sticky top-0 bg-background">
                            <TableRow>
                                <TableHead className="w-12">
                                    <Checkbox
                                        checked={isAllSelected}
                                        onCheckedChange={handleToggleAll}
                                        aria-label="Select all tenants"
                                    />
                                </TableHead>
                                <TableHead>Tenant</TableHead>
                                <TableHead>Unit</TableHead>
                                <TableHead>End Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {expiringContracts.map((contract) => (
                                <TableRow key={contract.tenant} data-state={selectedTenants.includes(contract.tenant) && "selected"}>
                                    <TableCell>
                                        <Checkbox 
                                            checked={selectedTenants.includes(contract.tenant)}
                                            onCheckedChange={() => handleSelectTenant(contract.tenant)}
                                            aria-label={`Select ${contract.tenant}`}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">{contract.tenant}</TableCell>
                                    <TableCell>{contract.unit}</TableCell>
                                    <TableCell>{contract.endDate}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    </ScrollArea>
                </div>

                <div>
                    <Label htmlFor="message-template">Message Template</Label>
                    <Textarea
                        id="message-template"
                        rows={8}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Enter your message here. Use placeholders like [Tenant Name], [Unit No.], and [End Date]."
                    />
                    <p className="text-xs text-muted-foreground mt-1">Placeholders: [Tenant Name], [Unit No.], [End Date]</p>
                </div>

            </div>
            <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="outline">
                Cancel
                </Button>
            </DialogClose>
            <Button onClick={handleSend} disabled={isSending}>
                {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                Send to {selectedTenants.length} Tenant(s)
            </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  );
}
