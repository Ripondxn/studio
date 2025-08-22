

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

import { addAgent } from '../agents/actions';
import { agentSchema } from './schema';

const formSchema = agentSchema.omit({ 
    id: true, 
    code: true, 
    vendorCode: true,
    vendorName: true,
    totalCommissionPaid: true
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
      name: '',
      mobile: '',
      email: '',
      commissionRate: 0,
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
        description: `Successfully added agent "${data.name}".`,
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
              Create a new independent agent profile.
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
              <Label htmlFor="commissionRate">Default Commission (Amount)</Label>
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
