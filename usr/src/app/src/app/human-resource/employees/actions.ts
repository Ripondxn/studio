'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { employeeSchema, type Employee } from './schema';

const employeesFilePath = path.join(process.cwd(), 'src/app/human-resource/employees/employees-data.json');

async function readEmployees(): Promise<Employee[]> {
    try {
        await fs.access(employeesFilePath);
        const data = await fs.readFile(employeesFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            await fs.writeFile(employeesFilePath, JSON.stringify([], null, 2), 'utf-8');
            return [];
        }
        throw error;
    }
}

async function writeEmployees(data: Employee[]) {
    await fs.writeFile(employeesFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getAllEmployees() {
    return await readEmployees();
}

async function getNextEmployeeId() {
    const allEmployees = await readEmployees();
    let maxNum = 0;
    allEmployees.forEach(e => {
        const match = e.employeeId.match(/^EMP-(\d+)$/);
        if(match) {
            const num = parseInt(match[1], 10);
            if (num > maxNum) {
                maxNum = num;
            }
        }
    });
    return `EMP-${(maxNum + 1).toString().padStart(4, '0')}`;
}

export async function saveEmployeeData(dataToSave: Omit<Employee, 'id'>, isNewRecord: boolean, isAutoCode: boolean) {
    const validation = employeeSchema.omit({id: true}).safeParse(dataToSave);
    if (!validation.success) {
        return { success: false, error: validation.error.errors.map(e => e.message).join(', ') };
    }

    try {
        const allEmployees = await readEmployees();
        let savedEmployee: Employee;

        if (isNewRecord) {
            let employeeId = validation.data.employeeId;
            if (isAutoCode || !employeeId) {
                employeeId = await getNextEmployeeId();
            }
            const employeeExists = allEmployees.some(e => e.employeeId === employeeId);
            if (employeeExists) {
                return { success: false, error: `Employee with ID "${employeeId}" already exists.` };
            }
            const newEmployee = { ...validation.data, employeeId, id: `EMP-${Date.now()}` };
            allEmployees.push(newEmployee);
            savedEmployee = newEmployee;
        } else {
            const index = allEmployees.findIndex(e => e.id === dataToSave.id);
            if (index === -1) return { success: false, error: 'Employee not found.' };
            allEmployees[index] = { ...allEmployees[index], ...validation.data };
            savedEmployee = allEmployees[index];
        }

        await writeEmployees(allEmployees);
        revalidatePath('/human-resource/employees');
        return { success: true, data: savedEmployee };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function findEmployeeData(id: string) {
    try {
        const allEmployees = await readEmployees();
        if (id === 'new') {
            const newId = await getNextEmployeeId();
            return { success: true, data: { employeeId: newId } };
        }
        const employee = allEmployees.find(e => e.id === id);
        if (employee) {
            return { success: true, data: employee };
        }
        return { success: false, error: 'Employee not found.' };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function deleteEmployeeData(id: string) {
    try {
        const allEmployees = await readEmployees();
        const updatedEmployees = allEmployees.filter(e => e.id !== id);
        if (allEmployees.length === updatedEmployees.length) {
            return { success: false, error: 'Employee not found.' };
        }
        await writeEmployees(updatedEmployees);
        revalidatePath('/human-resource/employees');
        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}