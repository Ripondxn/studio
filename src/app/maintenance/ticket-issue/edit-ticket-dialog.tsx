

'use client';

import { useState, useEffect } from 'react';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { maintenanceTicketSchema, type MaintenanceTicket } from './schema';
import { updateTicket, getLookups } from './actions';
import { Combobox } from '@/components/ui/combobox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type Room } from '@/app/property/rooms/schema';


const ticketFormSchema = maintenanceTicketSchema;

type Lookups = {
    properties: { value: string, label: string }[];
    units: { value: string, label: string, propertyCode: string }[];
    rooms: (Room & { value: string, label: string })[];
    tenants: { value: string, label: string }[];
}

const commonIssues = [
  { value: 'Plumbing', label: 'Plumbing' },
  { value: 'Electrical', label: 'Electrical' },
  { value: 'HVAC', label: 'HVAC' },
  { value: 'AC Not Cooling', label: 'AC Not Cooling' },
  { value: 'Split AC Repair', label: 'Split AC Repair' },
  { value: 'Washing Machine Repair', label: 'Washing Machine Repair' },
  { value: 'Water Faucet Change', label: 'Water Faucet Change' },
  { value: 'Burner Repair', label: 'Burner Repair' },
  { value: 'Wash Basin Issue', label: 'Wash Basin Issue' },
  { value: 'Water Leakage', label: 'Water Leakage' },
  { value: 'Power Failure', label: 'Power Failure' },
  { value: 'Painting', label: 'Painting' },
  { value: 'Pest Control', label: 'Pest Control' },
  { value: 'Carpentry', label: 'Carpentry' },
  { value: 'General Maintenance', label: 'General Maintenance' },
];

export function EditTicketDialog({ ticket, isOpen, setIsOpen }: { ticket: MaintenanceTicket, isOpen: boolean, setIsOpen: (open: boolean) => void }) {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [lookups, setLookups] = useState<Lookups>({ properties: [], units: [], rooms: [], tenants: [] });

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<z.infer<typeof ticketFormSchema>>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
        ...ticket,
        assignedTo: ticket.assignedTo || '',
        resolutionDetails: ticket.resolutionDetails || '',
        completedDate: ticket.completedDate || '',
    }
  });

  const watchedPropertyCode = watch('propertyCode');
  const filteredUnits = lookups.units.filter(u => u.propertyCode === watchedPropertyCode);
  const filteredRooms = lookups.rooms.filter(r => r.propertyCode === watchedPropertyCode && r.unitCode === watch('unitCode'));

  useEffect(() => {
    if(isOpen) {
        getLookups().then(setLookups);
        reset({
            ...ticket,
            assignedTo: ticket.assignedTo || '',
            resolutionDetails: ticket.resolutionDetails || '',
            completedDate: ticket.completedDate || '',
        });
    }
  }, [ticket, reset, isOpen]);

  const onSubmit = async (data: z.infer<typeof ticketFormSchema>) => {
    setIsSaving(true);
    const result = await updateTicket(data);

    if (result.success) {
      toast({
        title: 'Ticket Updated',
        description: `Successfully updated ticket "${data.ticketNo}".`,
      });
      setIsOpen(false);
      router.refresh();
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
    setIsSaving(false);
  };
  
  const handleOpenChange = (open: boolean) => {
    if (!open) {
        reset();
    }
    setIsOpen(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
            <DialogTitle>Edit Maintenance Ticket</DialogTitle>
            <DialogDescription>
                Update the details for ticket {ticket.ticketNo}.
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                <Input type="hidden" {...register('id')} />

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="ticketNo">Ticket No</Label>
                        <Input id="ticketNo" {...register('ticketNo')} disabled />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="requestDate">Request Date</Label>
                        <Input id="requestDate" type="date" {...register('requestDate')} />
                        {errors.requestDate && <p className="text-destructive text-xs mt-1">{errors.requestDate.message}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="propertyCode">Property</Label>
                        <Controller
                            name="propertyCode"
                            control={control}
                            render={({ field }) => (
                            <Combobox
                                options={lookups.properties}
                                value={field.value}
                                onSelect={(value) => {
                                    field.onChange(value);
                                    setValue('unitCode', '');
                                }}
                                placeholder="Select Property"
                            />
                            )}
                        />
                        {errors.propertyCode && <p className="text-destructive text-xs mt-1">{errors.propertyCode.message}</p>}
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="unitCode">Unit</Label>
                        <Controller
                            name="unitCode"
                            control={control}
                            render={({ field }) => (
                            <Combobox
                                options={filteredUnits}
                                value={field.value}
                                onSelect={field.onChange}
                                placeholder="Select Unit"
                                disabled={!watchedPropertyCode}
                            />
                            )}
                        />
                        {errors.unitCode && <p className="text-destructive text-xs mt-1">{errors.unitCode.message}</p>}
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="roomCode">Room</Label>
                        <Controller
                            name="roomCode"
                            control={control}
                            render={({ field }) => (
                            <Combobox
                                options={filteredRooms}
                                value={field.value || ''}
                                onSelect={field.onChange}
                                placeholder="Select Room"
                                disabled={!watch('unitCode')}
                            />
                            )}
                        />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="tenantName">Tenant Name</Label>
                    <Input id="tenantName" {...register('tenantName')} />
                    {errors.tenantName && <p className="text-destructive text-xs mt-1">{errors.tenantName.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="issueType">Issue Type</Label>
                    <Controller
                        name="issueType"
                        control={control}
                        render={({ field }) => (
                            <Combobox
                                options={commonIssues}
                                value={field.value}
                                onSelect={(value) => field.onChange(value)}
                                placeholder="Select or type an issue..."
                            />
                        )}
                    />
                    {errors.issueType && <p className="text-destructive text-xs mt-1">{errors.issueType.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Description of Issue</Label>
                    <Textarea id="description" {...register('description')} />
                    {errors.description && <p className="text-destructive text-xs mt-1">{errors.description.message}</p>}
                </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Controller name="priority" control={control} render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Low">Low</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                    <SelectItem value="Urgent">Urgent</SelectItem>
                                </SelectContent>
                            </Select>
                        )} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Controller name="status" control={control} render={({ field }) => (
                             <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Open">Open</SelectItem>
                                    <SelectItem value="In Progress">In Progress</SelectItem>
                                    <SelectItem value="On Hold">On Hold</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        )} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="assignedTo">Assigned To</Label>
                    <Input id="assignedTo" placeholder="e.g. Maintenance Team, John Doe" {...register('assignedTo')} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="resolutionDetails">Resolution Details</Label>
                    <Textarea id="resolutionDetails" {...register('resolutionDetails')} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="completedDate">Completed Date</Label>
                    <Input id="completedDate" type="date" {...register('completedDate')} />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSaving || !isDirty}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
