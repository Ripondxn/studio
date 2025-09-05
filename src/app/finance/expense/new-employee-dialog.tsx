
'use client';

import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { addEmployeeData, generateNewEmployeeId } from '@/app/human-resource/employees/actions';
import { employeeSchema } from '@/app/human-resource/employees/schema';

interface NewEmployeeDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function NewEmployeeDialog({ isOpen, onOpenChange }: NewEmployeeDialogProps) {
  const { toast } = useToast();
  const [autoGenerateId, setAutoGenerateId] = useState(true);

  const form = useForm<z.infer<typeof employeeSchema>>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      employeeId: '',
      name: '',
      email: '',
      mobile: '',
      profession: '',
      photo: '',
    },
  });

  useEffect(() => {
    if (isOpen && autoGenerateId) {
      const fetchNewId = async () => {
        const newId = await generateNewEmployeeId();
        form.setValue('employeeId', newId);
      };
      fetchNewId();
    } else if (!isOpen) {
        form.reset();
        setAutoGenerateId(true);
    }
  }, [isOpen, autoGenerateId, form]);

  const handleToggleAutoGenerate = async (checked: boolean) => {
    setAutoGenerateId(checked);
    if (checked) {
      const newId = await generateNewEmployeeId();
      form.setValue('employeeId', newId);
    } else {
      form.setValue('employeeId', '');
    }
  };

  const onSubmit = async (values: z.infer<typeof employeeSchema>) => {
    try {
      await addEmployeeData(values);
      toast({ title: 'Success', description: 'Employee added successfully.' });
      onOpenChange(false);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: (error as Error).message });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>Fill in the details to add a new employee to the system.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="employeeId"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Employee ID</FormLabel>
                        <div className="flex items-center gap-4">
                            <FormControl>
                                <Input {...field} disabled={autoGenerateId} />
                            </FormControl>
                            <div className="flex items-center gap-2">
                                <Switch
                                    id="auto-generate-id-dialog"
                                    checked={autoGenerateId}
                                    onCheckedChange={handleToggleAutoGenerate}
                                />
                                <Label htmlFor="auto-generate-id-dialog">Auto</Label>
                            </div>
                        </div>
                        <FormMessage />
                        </FormItem>
                    )}
                />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter mobile number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="profession"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profession</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter profession" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button type="submit">Save Employee</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
