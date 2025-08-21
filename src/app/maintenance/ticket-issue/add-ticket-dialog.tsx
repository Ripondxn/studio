
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus, Loader2 } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { maintenanceTicketSchema, type MaintenanceTicket } from './schema';
import { addTicket, getLookups } from './actions';
import { Combobox } from '@/components/ui/combobox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

type TicketFormData = Omit<MaintenanceTicket, 'id'>;
const ticketFormSchema = maintenanceTicketSchema.omit({ id: true });

type Lookups = {
    properties: { value: string, label: string }[];
    units: { value: string, label: string, propertyCode: string }[];
    tenants: { value: string, label: string }[];
}

export function AddTicketDialog({ onTicketAdded }: { onTicketAdded: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const [lookups, setLookups] = useState<Lookups>({ properties: [], units: [], tenants: [] });

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
        ticketNo: `TKT-${Date.now()}`,
        requestDate: format(new Date(), 'yyyy-MM-dd'),
        propertyCode: '',
        unitCode: '',
        tenantName: '',
        issueType: '',
        description: '',
        priority: 'Medium',
        status: 'Open',
        assignedTo: '',
        resolutionDetails: '',
        completedDate: '',
    }
  });

  const watchedPropertyCode = watch('propertyCode');

  const filteredUnits = lookups.units.filter(u => u.propertyCode === watchedPropertyCode);

  useEffect(() => {
      if(isOpen) {
        getLookups().then(setLookups);
        reset({
            ticketNo: `TKT-${Date.now()}`,
            requestDate: format(new Date(), 'yyyy-MM-dd'),
            propertyCode: '',
            unitCode: '',
            tenantName: '',
            issueType: '',
            description: '',
            priority: 'Medium',
            status: 'Open',
            assignedTo: '',
            resolutionDetails: '',
            completedDate: '',
        });
      }
  }, [isOpen, reset]);

  const onSubmit = async (data: TicketFormData) => {
    setIsSaving(true);
    const result = await addTicket(data);

    if (result.success) {
      toast({
        title: 'Ticket Created',
        description: `Successfully created new ticket "${data.ticketNo}".`,
      });
      setIsOpen(false);
      onTicketAdded(); // Refresh data on parent
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
    setIsSaving(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create New Ticket
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
            <DialogTitle>Create New Maintenance Ticket</DialogTitle>
            <DialogDescription>
                Fill in the details below to log a new maintenance issue.
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="tenantName">Tenant Name</Label>
                    <Input id="tenantName" {...register('tenantName')} />
                    {errors.tenantName && <p className="text-destructive text-xs mt-1">{errors.tenantName.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="issueType">Issue Type</Label>
                    <Input id="issueType" placeholder="e.g., Plumbing, Electrical, HVAC" {...register('issueType')} />
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline" onClick={() => reset()}>Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Ticket
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
