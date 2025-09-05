
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { employeeSchema, type Employee } from './schema';

const employeesFilePath = path.join(process.cwd(), 'src/app/human-resource/employees/employees-data.json');

// Helper to read the JSON file
async function readEmployees(): Promise<Employee[]> {
    try {
        await fs.access(employeesFilePath);
        const data = await fs.readFile(employeesFilePath, 'utf-8');
        return JSON.parse(data) as Employee[];
    } catch (error) {
        // If the file doesn't exist, create it with an empty array
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            await fs.writeFile(employeesFilePath, JSON.stringify([], null, 2), 'utf-8');
            return [];
        }
        throw error;
    }
}

// Helper to write to the JSON file
async function writeEmployees(data: Employee[]) {
    await fs.writeFile(employeesFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

// --- Exported Server Actions ---

/**
 * Fetches all employees.
 */
export async function getAllEmployees(): Promise<Employee[]> {
    return await readEmployees();
}

/**
 * Generates a new unique employee ID.
 */
export async function generateNewEmployeeId(): Promise<string> {
    const allEmployees = await readEmployees();
    let maxNum = 0;
    allEmployees.forEach(e => {
        const match = e.employeeId.match(/^EMP-(\d+)$/);
        if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxNum) {
                maxNum = num;
            }
        }
    });
    return `EMP-${(maxNum + 1).toString().padStart(4, '0')}`;
}

/**
 * Adds a new employee to the database.
 */
export async function addEmployeeData(data: z.infer<typeof employeeSchema>) {
    const validation = employeeSchema.safeParse(data);
    if (!validation.success) {
        throw new Error(validation.error.errors.map(e => e.message).join(', '));
    }

    const allEmployees = await readEmployees();
    const employeeExists = allEmployees.some(e => e.employeeId === validation.data.employeeId);

    if (employeeExists) {
        throw new Error(`Employee with ID "${validation.data.employeeId}" already exists.`);
    }

    const newEmployee: Employee = {
        ...validation.data,
        id: `emp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    };

    allEmployees.push(newEmployee);
    await writeEmployees(allEmployees);
    revalidatePath('/human-resource/employees');
    return { success: true, data: newEmployee };
}

/**
 * Updates an existing employee's data.
 */
export async function updateEmployeeData(id: string, data: Partial<Omit<Employee, 'id'>>) {
    const validation = employeeSchema.partial().safeParse(data);
    if (!validation.success) {
        throw new Error(validation.error.errors.map(e => e.message).join(', '));
    }

    const allEmployees = await readEmployees();
    const index = allEmployees.findIndex(e => e.id === id);

    if (index === -1) {
        throw new Error('Employee not found.');
    }

    allEmployees[index] = { ...allEmployees[index], ...validation.data };
    await writeEmployees(allEmployees);
    revalidatePath('/human-resource/employees');
    return { success: true, data: allEmployees[index] };
}


/**
 * Fetches a single employee by their unique ID.
 */
export async function getEmployeeDataById(id: string): Promise<Employee | null> {
    const allEmployees = await readEmployees();
    return allEmployees.find(e => e.id === id) || null;
}

/**
 * Deletes an employee by their unique ID.
 */
export async function deleteEmployeeData(id: string) {
    const allEmployees = await readEmployees();
    const updatedEmployees = allEmployees.filter(e => e.id !== id);

    if (allEmployees.length === updatedEmployees.length) {
        return { success: false, error: 'Employee not found.' };
    }

    await writeEmployees(updatedEmployees);
    revalidatePath('/human-resource/employees');
    return { success: true };
}

/**
 * Fetches the change history for an employee.
 * This is a placeholder and returns a mock history.
 */
export async function getEmployeeHistory(id: string): Promise<any[]> {
    // In a real application, you would fetch this from a database or a log file.
    console.log(`Fetching history for employee ID: ${id}`);
    return [
        {
            action: 'Employee Created',
            changedBy: 'Admin',
            changedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
            changes: { name: { old: '', new: 'John Doe' }, email: { old: '', new: 'john.doe@example.com' } },
        },
        {
            action: 'Details Updated',
            changedBy: 'HR Manager',
            changedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
            changes: { profession: { old: 'Software Engineer', new: 'Senior Software Engineer' } },
        },
    ];
}
