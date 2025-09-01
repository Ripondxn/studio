
import { z } from 'zod';

export const projectSchema = z.object({
  id: z.string(),
  projectNo: z.string().min(1, 'Project number is required.'),
  projectName: z.string().min(1, 'Project name is required.'),
  projectType: z.enum(['Main Contractor', 'Subcontractor']),
  partyType: z.enum(['Customer', 'Vendor']),
  partyCode: z.string().min(1, 'A customer or vendor is required.'),
  partyName: z.string(),
  status: z.enum(['Planning', 'In Progress', 'Completed', 'On Hold', 'Cancelled']),
  startDate: z.string(),
  endDate: z.string(),
  contractValue: z.number().min(0),
  retentionPercentage: z.number().min(0).max(100).optional().default(0),
  retentionReleaseDate: z.string().optional(),
  notes: z.string().optional(),
});

export type Project = z.infer<typeof projectSchema>;
