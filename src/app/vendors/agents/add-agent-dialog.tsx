
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
import { useToast } from '@/hooks/use-toast';
import { Plus, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { agentSchema, type Agent } from './schema';
import { saveAgentData, findAgentData } from './actions';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

export function AddAgentDialog({ onAgentAdded }: { onAgentAdded: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const form = useForm<Agent>({
    resolver: zodResolver(agentSchema.omit({id: true, totalCommissionPaid: true, vendorName: true, vendorCode: true})),
    defaultValues: {
        code: '',
        name: '',
        mobile: '',
        email: '',
        commissionRate: 0,
    }
  });

  useEffect(() => {
      if(isOpen) {
        findAgentData('new').then(result => {
            if(result.success && result.data){
                form.reset(result.data);
            }
        });
      }
  }, [isOpen, form]);


  const onSubmit = async (data: Agent) => {
    setIsSaving(true);
    const result = await saveAgentData(data, true);

    if (result.success) {
      toast({
        title: 'Agent Added',
        description: `Successfully added new agent "${data.name}".`,
      });
      setIsOpen(false);
      onAgentAdded();
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
          <Plus className="mr-2 h-4 w-4" /> Add New Agent
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <DialogHeader>
                <DialogTitle>Add New Agent</DialogTitle>
                <DialogDescription>
                    Fill in the details for the new agent.
                </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                                <Label>Agent Code</Label>
                                <FormControl><Input {...field} disabled /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <Label>Agent Name</Label>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="mobile"
                        render={({ field }) => (
                            <FormItem>
                                <Label>Mobile</Label>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <Label>Email</Label>
                                <FormControl><Input {...field} type="email" /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="commissionRate"
                        render={({ field }) => (
                            <FormItem>
                                <Label>Default Commission</Label>
                                <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)}/></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline" onClick={() => form.reset()}>Cancel</Button>
                    </DialogClose>
                    <Button type="submit" disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Agent
                    </Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
