

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

import { type Agent, agentSchema } from './schema';
import { updateAgentData } from '../agents/actions';

const formSchema = agentSchema.omit({ totalCommissionPaid: true });

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
  });

  useEffect(() => {
    if (isOpen) {
      reset(agent);
    }
  }, [agent, isOpen, reset]);

  const onSubmit = async (data: AgentFormData) => {
    setIsSaving(true);
    const result = await updateAgentData(data);

    if (result.success) {
      toast({
        title: 'Agent Updated',
        description: `Successfully updated agent "${data.name}".`,
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
              <Label htmlFor="name">Agent Name</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Agent Mobile</Label>
              <Input id="mobile" {...register('mobile')} />
               {errors.mobile && <p className="text-destructive text-xs mt-1">{errors.mobile.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Agent Email</Label>
              <Input id="email" type="email" {...register('email')} />
               {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="commissionRate">Default Commission Rate</Label>
              <Input id="commissionRate" type="number" {...register('commissionRate')} />
              {errors.commissionRate && <p className="text-destructive text-xs mt-1">{errors.commissionRate.message}</p>}
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
