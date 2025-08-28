
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { userRoleSchema, type UserRole } from './schema';
import { addUser } from './actions';


type UserFormData = Omit<UserRole, 'id' | 'lastLogin'>;

// We need a slightly different schema for the form (no id, no lastLogin)
const userFormSchema = userRoleSchema.omit({ id: true, lastLogin: true });


export function AddUserDialog() {
  const [isOpen, setIsOpen] = useState(false);
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
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
        name: '',
        email: '',
        password: '',
        role: 'User',
        status: 'Active',
    }
  });

  const onSubmit = async (data: UserFormData) => {
    if (!currentUser) {
        toast({ variant: 'destructive', title: 'Error', description: 'Cannot determine current user. Please log in again.'});
        return;
    }
    setIsSaving(true);
    const result = await addUser(data, currentUser);

    if (result.success) {
      toast({
        title: 'User Added',
        description: `Successfully added new user "${data.name}".`,
      });
      setIsOpen(false);
      router.refresh();
      reset();
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
          <Plus className="mr-2 h-4 w-4" /> Add New User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
                Fill in the details below to create a new user account.
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
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
                        <Input id="password" type="password" {...register('password')} />
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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="User">User</SelectItem>
                                        <SelectItem value="Admin">Admin</SelectItem>
                                        <SelectItem value="Super Admin">Super Admin</SelectItem>
                                        <SelectItem value="Property Manager">Property Manager</SelectItem>
                                        <SelectItem value="Accountant">Accountant</SelectItem>
                                        <SelectItem value="Developer">Developer</SelectItem>
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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <Button type="button" variant="outline" onClick={() => reset()}>Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save User
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
