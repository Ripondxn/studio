
'use client';

import { useState, useEffect } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { projectSchema, type Project } from './schema';
import { saveProject } from './actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Combobox } from '@/components/ui/combobox';
import { getLookups } from '@/app/lookups/actions';

const formSchema = projectSchema.omit({ id: true, partyName: true });

type ProjectFormData = z.infer<typeof formSchema>;

interface AddProjectDialogProps {
    project?: Project;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    onSuccess: () => void;
}

type Lookups = {
    vendors: { value: string, label: string }[];
    customers: { value: string, label: string }[];
}

export function AddProjectDialog({ project, isOpen, setIsOpen, onSuccess }: AddProjectDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isAutoCode, setIsAutoCode] = useState(true);
  const { toast } = useToast();
  const [lookups, setLookups] = useState<Lookups>({ vendors: [], customers: [] });

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (isOpen) {
        getLookups().then(data => {
            setLookups(prev => ({
                ...prev,
                vendors: data.vendors || [],
                customers: data.customers || []
            }));
        });
        
        if(project) {
            reset(project);
            setIsAutoCode(false);
        } else {
            reset({
                projectNo: '',
                projectName: '',
                projectType: 'Main Contractor',
                partyType: 'Customer',
                partyCode: '',
                status: 'Planning',
                startDate: new Date().toISOString().split('T')[0],
                endDate: new Date().toISOString().split('T')[0],
                contractValue: 0,
                retentionPercentage: 0,
                notes: '',
            });
            setIsAutoCode(true);
        }
    }
  }, [isOpen, project, reset]);

  const projectType = watch('projectType');
  const partyOptions = projectType === 'Main Contractor' ? lookups.customers : lookups.vendors;

  const onSubmit = async (data: ProjectFormData) => {
    setIsSaving(true);
    const selectedParty = partyOptions.find(p => p.value === data.partyCode);
    const partyName = selectedParty ? selectedParty.label : data.partyCode;

    const result = await saveProject({ 
        ...data, 
        id: project?.id, 
        isAutoProjectNo: !project && isAutoCode,
        partyName,
    });

    if (result.success) {
      toast({
        title: project ? 'Project Updated' : 'Project Added',
        description: `Successfully ${project ? 'updated' : 'added'} project.`,
      });
      onSuccess();
      setIsOpen(false);
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
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
                <DialogTitle>{project ? 'Edit Project' : 'Add New Project'}</DialogTitle>
                <DialogDescription>
                    Fill in the details for the project.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="projectNo">Project No</Label>
                        <Input id="projectNo" {...register('projectNo')} disabled={isAutoCode} />
                        {errors.projectNo && <p className="text-destructive text-xs mt-1">{errors.projectNo.message}</p>}
                    </div>
                     <div className="flex items-end space-x-2 pb-1">
                        <Switch
                            id="auto-code-switch"
                            checked={isAutoCode}
                            onCheckedChange={setIsAutoCode}
                            disabled={!!project}
                        />
                        <Label htmlFor="auto-code-switch">Auto-generate No.</Label>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="projectName">Project Name</Label>
                        <Input id="projectName" {...register('projectName')} />
                        {errors.projectName && <p className="text-destructive text-xs mt-1">{errors.projectName.message}</p>}
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="projectType">Project Type</Label>
                        <Controller name="projectType" control={control} render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>
                                <SelectItem value="Main Contractor">Main Contractor (For a Customer)</SelectItem>
                                <SelectItem value="Subcontractor">Subcontractor (To a Vendor)</SelectItem>
                            </SelectContent></Select>
                        )} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="partyCode">{projectType === 'Main Contractor' ? 'Customer' : 'Vendor'}</Label>
                        <Controller name="partyCode" control={control} render={({ field }) => (
                           <Combobox options={partyOptions} value={field.value || ''} onSelect={field.onChange} placeholder="Select Party" />
                        )} />
                        {errors.partyCode && <p className="text-destructive text-xs mt-1">{errors.partyCode.message}</p>}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input id="startDate" type="date" {...register('startDate')} />
                        {errors.startDate && <p className="text-destructive text-xs mt-1">{errors.startDate.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="endDate">End Date</Label>
                        <Input id="endDate" type="date" {...register('endDate')} />
                        {errors.endDate && <p className="text-destructive text-xs mt-1">{errors.endDate.message}</p>}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="contractValue">Contract Value</Label>
                        <Input id="contractValue" type="number" {...register('contractValue')} />
                        {errors.contractValue && <p className="text-destructive text-xs mt-1">{errors.contractValue.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Controller name="status" control={control} render={({ field }) => (
                           <Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>
                               <SelectItem value="Planning">Planning</SelectItem>
                               <SelectItem value="In Progress">In Progress</SelectItem>
                               <SelectItem value="On Hold">On Hold</SelectItem>
                               <SelectItem value="Completed">Completed</SelectItem>
                               <SelectItem value="Cancelled">Cancelled</SelectItem>
                           </SelectContent></Select>
                        )} />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea id="notes" {...register('notes')} />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {project ? 'Save Changes' : 'Add Project'}
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
