
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
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { projectSchema, type Project, type ProgressBilling, progressBillingSchema } from './schema';
import { saveProject } from './actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Combobox } from '@/components/ui/combobox';
import { getLookups } from '@/app/lookups/actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, addMonths } from 'date-fns';
import { useCurrency } from '@/context/currency-context';

const getFormSchema = (isAutoCode: boolean) => projectSchema.omit({ id: true, partyName: true, progressBillings: true }).extend({
    projectNo: isAutoCode ? z.string().optional() : z.string().min(1, 'Project number is required.'),
    contractValue: z.coerce.number().min(0, "Contract value must be a positive number."),
    progressBillings: z.array(progressBillingSchema).optional(),
});


type ProjectFormData = z.infer<ReturnType<typeof getFormSchema>>;

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
  const { formatCurrency } = useCurrency();
  const [generationCount, setGenerationCount] = useState(1);

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(getFormSchema(isAutoCode)),
    defaultValues: {
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
        progressBillings: [],
    }
  });

  useEffect(() => {
    // Re-validate when isAutoCode changes
    form.trigger();
  }, [isAutoCode, form]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = form;
  
  const { fields, append, remove, replace } = useFieldArray({
      control,
      name: "progressBillings"
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
                progressBillings: [],
            });
            setIsAutoCode(true);
        }
    }
  }, [isOpen, project, reset]);

  const projectType = watch('projectType');
  const partyOptions = projectType === 'Main Contractor' ? lookups.customers : lookups.vendors;
  const contractValue = watch('contractValue');

  const handleGenerateBillings = () => {
    const newBillings: ProgressBilling[] = [];
    const percentage = 100 / generationCount;
    const amount = contractValue / generationCount;

    for (let i = 0; i < generationCount; i++) {
        newBillings.push({
            id: `BILL-${Date.now()}-${i}`,
            date: new Date().toISOString().split('T')[0],
            description: `Progress Billing ${i + 1}`,
            percentage: parseFloat(percentage.toFixed(2)),
            amount: parseFloat(amount.toFixed(2)),
            status: 'Draft',
        });
    }

    // Adjust last item for rounding differences
    if (newBillings.length > 0) {
        const totalAmount = newBillings.reduce((sum, b) => sum + b.amount, 0);
        const difference = contractValue - totalAmount;
        newBillings[newBillings.length - 1].amount += difference;

         const totalPercentage = newBillings.reduce((sum, b) => sum + b.percentage, 0);
        const percentDifference = 100 - totalPercentage;
        newBillings[newBillings.length - 1].percentage += percentDifference;
    }
    
    replace(newBillings);
  };


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
      <DialogContent className="sm:max-w-4xl">
        <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
                <DialogTitle>{project ? 'Edit Project' : 'Add New Project'}</DialogTitle>
                <DialogDescription>
                    Fill in the details for the project.
                </DialogDescription>
            </DialogHeader>
            <div className="max-h-[70vh] overflow-y-auto pr-2">
                 <Tabs defaultValue="details">
                    <TabsList>
                        <TabsTrigger value="details">Project Details</TabsTrigger>
                        <TabsTrigger value="billing">Progress Billing</TabsTrigger>
                    </TabsList>
                    <TabsContent value="details" className="space-y-4 pt-4">
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="contractValue">Contract Value</Label>
                                <Input id="contractValue" type="number" {...register('contractValue')} />
                                {errors.contractValue && <p className="text-destructive text-xs mt-1">{errors.contractValue.message}</p>}
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="retentionPercentage">Retention %</Label>
                                <Input id="retentionPercentage" type="number" {...register('retentionPercentage', { valueAsNumber: true })} />
                                {errors.retentionPercentage && <p className="text-destructive text-xs mt-1">{errors.retentionPercentage.message}</p>}
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
                    </TabsContent>
                    <TabsContent value="billing" className="pt-4">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                                <Input 
                                    type="number" 
                                    value={generationCount} 
                                    onChange={(e) => setGenerationCount(parseInt(e.target.value) || 1)} 
                                    className="w-24"
                                    min="1"
                                />
                                <Button type="button" variant="outline" onClick={handleGenerateBillings}>Auto-Generate</Button>
                            </div>
                            <Button type="button" onClick={() => append({ id: `BILL-${Date.now()}`, date: new Date().toISOString().split('T')[0], description: '', percentage: 0, amount: 0, status: 'Draft' })}>
                                <Plus className="mr-2 h-4 w-4" /> Add Bill
                            </Button>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>%</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {fields.map((field, index) => (
                                    <TableRow key={field.id}>
                                        <TableCell><Input type="date" {...register(`progressBillings.${index}.date`)} /></TableCell>
                                        <TableCell><Input {...register(`progressBillings.${index}.description`)} /></TableCell>
                                        <TableCell><Input type="number" {...register(`progressBillings.${index}.percentage`, { valueAsNumber: true })} /></TableCell>
                                        <TableCell><Input type="number" {...register(`progressBillings.${index}.amount`, { valueAsNumber: true })} /></TableCell>
                                        <TableCell>
                                             <Controller
                                                name={`progressBillings.${index}.status`}
                                                control={control}
                                                render={({ field }) => (
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Draft">Draft</SelectItem>
                                                            <SelectItem value="Submitted">Submitted</SelectItem>
                                                            <SelectItem value="Paid">Paid</SelectItem>
                                                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell><Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TabsContent>
                </Tabs>
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
