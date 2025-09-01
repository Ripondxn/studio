
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { projectSchema, type Project } from './schema';

const projectsFilePath = path.join(process.cwd(), 'src/app/project-management/projects/projects-data.json');

async function readProjects(): Promise<Project[]> {
    try {
        await fs.access(projectsFilePath);
        const data = await fs.readFile(projectsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            await writeProjects([]);
            return [];
        }
        throw error;
    }
}

async function writeProjects(data: Project[]) {
    await fs.writeFile(projectsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getAllProjects() {
    return await readProjects();
}

async function getNextProjectNumber() {
    const allProjects = await readProjects();
    let maxNum = 0;
    allProjects.forEach(p => {
        const match = p.projectNo.match(/^PROJ-(\d+)$/);
        if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxNum) {
                maxNum = num;
            }
        }
    });
    return `PROJ-${(maxNum + 1).toString().padStart(4, '0')}`;
}

const formSchema = projectSchema.omit({ id: true });

export async function saveProject(data: Omit<Project, 'id'> & { id?: string, isAutoProjectNo?: boolean }) {
    const { isAutoProjectNo, ...projectData } = data;
    const validation = formSchema.safeParse(projectData);
    if (!validation.success) {
        return { success: false, error: validation.error.errors.map(e => e.message).join(', ') };
    }
    
    try {
        const allProjects = await readProjects();
        let savedProject: Project;

        if (!data.id) { // Create new
            let newProjectNo = projectData.projectNo;
            if (isAutoProjectNo || !newProjectNo) {
                newProjectNo = await getNextProjectNumber();
            }
            const newProject = { ...validation.data, projectNo: newProjectNo, id: `PROJ-${Date.now()}` };
            allProjects.push(newProject);
            savedProject = newProject;
        } else { // Update
            const index = allProjects.findIndex(p => p.id === data.id);
            if (index === -1) return { success: false, error: 'Project not found.' };
            allProjects[index] = { ...allProjects[index], ...validation.data };
            savedProject = allProjects[index];
        }

        await writeProjects(allProjects);
        revalidatePath('/project-management/projects');
        return { success: true, data: savedProject };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function deleteProject(id: string) {
    try {
        const allProjects = await readProjects();
        const updatedProjects = allProjects.filter(p => p.id !== id);
        if (allProjects.length === updatedProjects.length) {
            return { success: false, error: 'Project not found.' };
        }
        await writeProjects(updatedProjects);
        revalidatePath('/project-management/projects');
        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}
