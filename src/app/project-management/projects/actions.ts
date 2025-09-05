
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
// import { firestoreAdmin } from '@/lib/firebase/admin-config';
import { projectSchema, type Project } from './schema';

const formSchema = projectSchema.omit({ id: true });

async function getNextProjectNumber() {
    // const querySnapshot = await firestoreAdmin.collection("projects").get();
    // let maxNum = 0;
    // querySnapshot.docs.forEach(doc => {
    //     const project = doc.data() as Project;
    //     const match = project.projectNo.match(/^PROJ-(\d+)$/);
    //     if (match) {
    //         const num = parseInt(match[1], 10);
    //         if (num > maxNum) {
    //             maxNum = num;
    //         }
    //     }
    // });
    // return `PROJ-${(maxNum + 1).toString().padStart(4, '0')}`;
    return 'PROJ-0001';
}

export async function getAllProjects(): Promise<Project[]> {
    // const querySnapshot = await firestoreAdmin.collection("projects").get();
    // return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Project[];
    return [];
}

export async function saveProject(data: Omit<Project, 'id'> & { id?: string, isAutoProjectNo?: boolean }) {
    const { isAutoProjectNo, ...projectData } = data;
    const validation = formSchema.safeParse(projectData);
    if (!validation.success) {
        return { success: false, error: validation.error.errors.map(e => e.message).join(', ') };
    }

    try {
        let savedProject: Project;

        if (!data.id) { // Create new
            let newProjectNo = projectData.projectNo;
            if (isAutoProjectNo || !newProjectNo) {
                newProjectNo = await getNextProjectNumber();
            }
            const newProject = { ...validation.data, projectNo: newProjectNo };
            // const docRef = await firestoreAdmin.collection("projects").add(newProject);
            // savedProject = { ...newProject, id: docRef.id };
            savedProject = { ...newProject, id: 'mock-id' };
        } else { // Update
            // const docRef = firestoreAdmin.collection("projects").doc(data.id);
            // await docRef.update(validation.data);
            // const updatedDoc = await docRef.get();
            // savedProject = { ...updatedDoc.data(), id: updatedDoc.id } as Project;
            savedProject = { ...validation.data, id: data.id } as Project;
        }

        revalidatePath('/project-management/projects');
        return { success: true, data: savedProject };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function deleteProject(id: string) {
    try {
        // await firestoreAdmin.collection("projects").doc(id).delete();
        revalidatePath('/project-management/projects');
        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}
