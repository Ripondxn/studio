
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { getEmployeeDataById, addEmployeeData, updateEmployeeData, generateNewEmployeeId } from '../actions';
import { useToast } from '@/hooks/use-toast';
import { employeeSchema, type Employee } from '../schema';

const AddEmployeePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isEdit, setIsEdit] = useState(false);
  const [employeeId, setEmployeeId] = useState<string | null>(null);
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
    const id = searchParams.get('id');
    if (id) {
      setIsEdit(true);
      setEmployeeId(id);
      const fetchEmployee = async () => {
        try {
          const employee = await getEmployeeDataById(id);
          if (employee) {
            form.reset(employee);
            setAutoGenerateId(false);
          }
        } catch (error) {
          toast({ variant: 'destructive', title: 'Error', description: (error as Error).message });
        }
      };
      fetchEmployee();
    } else {
        if (autoGenerateId) {
            const fetchNewId = async () => {
                const newId = await generateNewEmployeeId();
                form.setValue('employeeId', newId);
            }
            fetchNewId();
        }
    }
  }, [searchParams, form, toast, autoGenerateId]);

  const onSubmit = async (values: z.infer<typeof employeeSchema>) => {
    try {
      if (isEdit && employeeId) {
        await updateEmployeeData(employeeId, values);
        toast({ title: 'Success', description: 'Employee updated successfully.' });
      } else {
        await addEmployeeData(values);
        toast({ title: 'Success', description: 'Employee added successfully.' });
      }
      router.push('/human-resource/employees');
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: (error as Error).message });
    }
  };

  const handleToggleAutoGenerate = async (checked: boolean) => {
    setAutoGenerateId(checked);
    if (checked) {
      const newId = await generateNewEmployeeId();
      form.setValue('employeeId', newId);
    } else {
      form.setValue('employeeId', '');
    }
  };


  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">
                    {isEdit ? 'Edit Employee' : 'Add New Employee'}
                </h2>
                <p className="text-muted-foreground">
                    {isEdit ? 'Update the information for the existing employee.' : 'Fill in the details to add a new employee.'}
                </p>
            </div>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Employee Information</CardTitle>
                <CardDescription>Enter the employee's details below.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="space-y-2">
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
                                                id="auto-generate-id"
                                                checked={autoGenerateId}
                                                onCheckedChange={handleToggleAutoGenerate}
                                                disabled={isEdit}
                                            />
                                            <Label htmlFor="auto-generate-id">Auto-generate</Label>
                                        </div>
                                    </div>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="space-y-2">
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
                        </div>
                        <div className="space-y-2">
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
                        </div>
                        <div className="space-y-2">
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
                        </div>
                        <div className="space-y-2">
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
                    </div>
                        <div className="flex justify-end gap-4 mt-6">
                            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                            <Button type="submit">{isEdit ? 'Update Employee' : 'Save Employee'}</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  );
};

export default AddEmployeePage;
