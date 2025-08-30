
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import type { DocumentForApproval, ApprovalHistory } from './schema';
import { documentForApprovalSchema } from './schema';
import type { Role, Status } from '../types';

const documentsFilePath = path.join(process.cwd(), 'src/app/workflow/document-approval/documents-data.json');

async function readDocuments(): Promise<DocumentForApproval[]> {
    try {
        await fs.access(documentsFilePath);
        const data = await fs.readFile(documentsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

async function writeDocuments(data: DocumentForApproval[]) {
    await fs.writeFile(documentsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getDocumentsForApproval(user: { role: Role, name: string }): Promise<DocumentForApproval[]> {
    const allDocuments = await readDocuments();

    if (user.role === 'Super Admin') {
        return allDocuments;
    }
    if (user.role === 'Admin') {
        return allDocuments.filter(d => d.currentStatus !== 'DRAFT');
    }
    
    return allDocuments.filter(d => d.submittedBy === user.name);
}

const addDocumentSchema = documentForApprovalSchema.omit({ 
    id: true, 
    submittedBy: true, 
    currentStatus: true,
    approvalHistory: true 
});

export async function submitDocumentForApproval(data: z.infer<typeof addDocumentSchema>, submittedBy: string, actorRole: Role) {
    const validation = addDocumentSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: 'Invalid data provided.' };
    }

    const allDocuments = await readDocuments();
    const newDoc: DocumentForApproval = {
        ...validation.data,
        id: `DOC-${Date.now()}`,
        submittedBy: submittedBy,
        currentStatus: 'PENDING_ADMIN_APPROVAL',
        approvalHistory: [
            {
                action: 'Created & Submitted',
                actorId: submittedBy,
                actorRole: actorRole,
                timestamp: new Date().toISOString(),
                comments: data.description || 'Initial submission'
            }
        ]
    };

    allDocuments.push(newDoc);
    await writeDocuments(allDocuments);
    revalidatePath('/workflow/document-approval');

    return { success: true, data: newDoc };
}

const actionSchema = z.object({
    documentId: z.string(),
    actorId: z.string(),
    actorRole: z.string(),
    comment: z.string().optional(),
});

type ActionType = 'APPROVE' | 'REJECT' | 'ADD_COMMENT';

const performStateTransition = (currentStatus: Status, action: ActionType, actorRole: Role): Status => {
    if (action === 'REJECT') return 'REJECTED';
    if (action === 'ADD_COMMENT') return currentStatus;

    if (currentStatus === 'PENDING_ADMIN_APPROVAL' && actorRole === 'Admin') {
        return 'PENDING_SUPER_ADMIN_APPROVAL';
    }
    if (currentStatus === 'PENDING_SUPER_ADMIN_APPROVAL' && actorRole === 'Super Admin') {
        return 'POSTED'; // 'POSTED' here means fully approved
    }
    return currentStatus;
};

const getHistoryActionText = (action: ActionType, newStatus: Status, role: Role): string => {
    switch (action) {
       case 'APPROVE':
           if (newStatus === 'POSTED') return 'Final Approval';
           return `Approved by ${role}`;
       case 'REJECT': return `Rejected by ${role}`;
       case 'ADD_COMMENT': return 'Comment Added';
       default: return 'Action Performed';
   }
}

async function updateDocumentWorkflow(
    documentId: string,
    action: ActionType,
    actorId: string,
    actorRole: Role,
    comment?: string
) {
    const allDocuments = await readDocuments();
    const docIndex = allDocuments.findIndex(d => d.id === documentId);
    if (docIndex === -1) return { success: false, error: 'Document not found.' };

    const doc = allDocuments[docIndex];
    const previousStatus = doc.currentStatus;
    const newStatus = performStateTransition(previousStatus, action, actorRole);
    const historyActionText = getHistoryActionText(action, newStatus, actorRole);
    
    const newHistoryEntry: ApprovalHistory = {
        action: historyActionText,
        actorId,
        actorRole,
        timestamp: new Date().toISOString(),
        comments: comment || ''
    };

    doc.currentStatus = newStatus;
    doc.approvalHistory.push(newHistoryEntry);
    
    allDocuments[docIndex] = doc;
    await writeDocuments(allDocuments);
    revalidatePath('/workflow/document-approval');

    return { success: true };
}

export async function approveDocument(params: z.infer<typeof actionSchema>) {
    const { documentId, actorId, actorRole, comment } = params;
    return updateDocumentWorkflow(documentId, 'APPROVE', actorId, actorRole as Role, comment);
}

export async function rejectDocument(params: z.infer<typeof actionSchema>) {
    const { documentId, actorId, actorRole, comment } = params;
    return updateDocumentWorkflow(documentId, 'REJECT', actorId, actorRole as Role, comment);
}

export async function addCommentToDocument(params: z.infer<typeof actionSchema>) {
    const { documentId, actorId, actorRole, comment } = params;
    return updateDocumentWorkflow(documentId, 'ADD_COMMENT', actorId, actorRole as Role, comment);
}
