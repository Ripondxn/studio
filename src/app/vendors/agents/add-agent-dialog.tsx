

'use client';

import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

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
import { Loader2, Plus } from 'lucide-react';

import { addAgent } from '../actions';

const formSchema = z.object({
  agentName: z.string().min(1, "Agent name is required."),
  agentMobile: z.string().optional(),
  agentEmail: z.string().email().optional().or(z.literal('')),
  agentCommission: z.coerce.number().optional(),
});

type AgentFormData = z.infer<typeof formSchema>;


export function AddAgentDialog({onSuccess}: {onSuccess: () => void}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AgentFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agentName: '',
      agentMobile: '',
      agentEmail: '',
      agentCommission: 0,
    }
  });
  
  useEffect(() => {
    if (isOpen) {
        reset();
    }
  }, [isOpen, reset])

  const onSubmit = async (data: AgentFormData) => {
    setIsSaving(true);
    const result = await addAgent(data);

    if (result.success) {
      toast({
        title: 'Agent Added',
        description: `Successfully added agent "${data.agentName}".`,
      });
      setIsOpen(false);
      onSuccess();
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'Failed to add agent.',
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add New Agent</DialogTitle>
            <DialogDescription>
              A new agent will be created and assigned to the next available vendor.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="agentName">Agent Name</Label>
              <Input id="agentName" {...register('agentName')} />
              {errors.agentName && <p className="text-destructive text-xs mt-1">{errors.agentName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="agentMobile">Agent Mobile</Label>
              <Input id="agentMobile" {...register('agentMobile')} />
               {errors.agentMobile && <p className="text-destructive text-xs mt-1">{errors.agentMobile.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="agentEmail">Agent Email</Label>
              <Input id="agentEmail" type="email" {...register('agentEmail')} />
               {errors.agentEmail && <p className="text-destructive text-xs mt-1">{errors.agentEmail.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="agentCommission">Agent Commission (Amount)</Label>
              <Input id="agentCommission" type="number" {...register('agentCommission')} />
              {errors.agentCommission && <p className="text-destructive text-xs mt-1">{errors.agentCommission.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={() => reset()}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Agent
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
