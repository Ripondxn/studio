
'use client';

import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

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

import { type Agent } from './schema';
import { updateAgentData } from '../actions';

const formSchema = z.object({
  vendorCode: z.string(),
  agentCode: z.string().optional(),
  agentName: z.string().optional(),
  agentMobile: z.string().optional(),
  agentEmail: z.string().email().optional().or(z.literal('')),
  agentCommission: z.coerce.number().optional(),
});

type AgentFormData = z.infer<typeof formSchema>;

interface EditAgentDialogProps {
  agent: Agent;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function EditAgentDialog({ agent, isOpen, setIsOpen }: EditAgentDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<AgentFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vendorCode: agent.vendorCode,
      agentCode: agent.code,
      agentName: agent.name,
      agentMobile: agent.mobile,
      agentEmail: agent.email,
      agentCommission: agent.commission,
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        vendorCode: agent.vendorCode,
        agentCode: agent.code,
        agentName: agent.name,
        agentMobile: agent.mobile,
        agentEmail: agent.email,
        agentCommission: agent.commission,
      });
    }
  }, [agent, isOpen, reset]);

  const onSubmit = async (data: AgentFormData) => {
    setIsSaving(true);
    const result = await updateAgentData(data);

    if (result.success) {
      toast({
        title: 'Agent Updated',
        description: `Successfully updated agent "${data.agentName}".`,
      });
      setIsOpen(false);
      router.refresh();
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'Failed to update agent.',
      });
    }
    setIsSaving(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Agent Details</DialogTitle>
            <DialogDescription>
              Update the information for {agent.name}.
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
              <Label htmlFor="agentCommission">Agent Commission</Label>
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
