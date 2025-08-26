
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { userRoleSchema, type UserRole } from './schema';
import { updateUser } from './actions';


type UserFormData = Omit<UserRole, 'lastLogin'>;

// We need a slightly different schema for the form (no lastLogin)
// Also making password optional for editing, so users don't have to re-enter it every time.
const userFormSchema = userRoleSchema.omit({ lastLogin: true }).extend({
    password: z.string().min(6, 'Password must be at least 6 characters long.').or(z.literal(''))
});


export function EditUserDialog({ user, isOpen, setIsOpen }: { user: UserRole, isOpen: boolean, setIsOpen: (open: boolean) => void }) {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{name: string} | null>(null);

  useEffect(() => {
    const storedProfile = sessionStorage.getItem('userProfile');
    if (storedProfile) {
        setCurrentUser(JSON.parse(storedProfile));
    }
  }, []);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
  });

  // Reset form when user data changes or dialog opens/closes
  useEffect(() => {
    if(isOpen) {
        reset({
            ...user,
            password: '', // Don't pre-fill password for security
        });
    }
  }, [user, reset, isOpen]);

  const onSubmit = async (data: UserFormData) => {
    if (!currentUser) {
        toast({ variant: 'destructive', title: 'Error', description: 'Cannot determine current user. Please log in again.'});
        return;
    }
    setIsSaving(true);
    
    // Don't send an empty password to the update function.
    const dataToSubmit = { ...data };
    if (!dataToSubmit.password) {
      // @ts-ignore
      delete dataToSubmit.password;
    }

    const result = await updateUser(dataToSubmit, currentUser);

    if (result.success) {
      toast({
        title: 'User Updated',
        description: `Successfully updated user "${data.name}".`,
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
        reset(); // Reset form if dialog is closed without saving
    }
    setIsOpen(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
                Update the details for {user.name}. Click save when you're done.
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <Input type="hidden" {...register('id')} />
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                        Name
                    </Label>
                    <div className="col-span-3">
                        <Input id="name" {...register('name')} />
                        {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
                    </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                        Email
                    </Label>
                    <div className="col-span-3">
                        <Input id="email" {...register('email')} />
                         {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
                    </div>
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">
                        Password
                    </Label>
                    <div className="col-span-3">
                        <Input id="password" type="password" {...register('password')} placeholder="Leave blank to keep unchanged" />
                         {errors.password && <p className="text-destructive text-xs mt-1">{errors.password.message}</p>}
                    </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">
                        Role
                    </Label>
                     <div className="col-span-3">
                        <Controller
                            name="role"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="User">User</SelectItem>
                                        <SelectItem value="Admin">Admin</SelectItem>
                                        <SelectItem value="Super Admin">Super Admin</SelectItem>
                                        <SelectItem value="Property Manager">Property Manager</SelectItem>
                                        <SelectItem value="Accountant">Accountant</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                         {errors.role && <p className="text-destructive text-xs mt-1">{errors.role.message}</p>}
                    </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                        Status
                    </Label>
                    <div className="col-span-3">
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                         {errors.status && <p className="text-destructive text-xs mt-1">{errors.status.message}</p>}
                    </div>
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
