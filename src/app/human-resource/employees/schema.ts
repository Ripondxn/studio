
import { z } from 'zod';

export const attachmentSchema = z.object({
  id: z.number(),
  name: z.string(),
  file: z.string().nullable(),
  remarks: z.string(),
  isLink: z.boolean()
});

export const visaDetailsSchema = z.object({
    number: z.string().optional(),
    type: z.string().optional(),
    expiryDate: z.string().optional(),
});

export const medicalCardSchema = z.object({
    number: z.string().optional(),
    provider: z.string().optional(),
    expiryDate: z.string().optional(),
});

export const insuranceDetailsSchema = z.object({
    policyNumber: z.string().optional(),
    provider: z.string().optional(),
    expiryDate: z.string().optional(),
    coverageDetails: z.string().optional(),
});

export const salaryScaleSchema = z.object({
    grade: z.string().optional(),
    level: z.string().optional(),
    amount: z.number().optional(),
});

export const employeeSchema = z.object({
  id: z.string(),
  employeeId: z.string().min(1, "Employee ID is required."),
  name: z.string().min(1, "Name is required."),
  dateOfBirth: z.string().optional(),
  
  // Document Details
  nationalId: z.string().optional(),
  nationalIdExpiry: z.string().optional(),
  passportNo: z.string().optional(),
  passportExpiry: z.string().optional(),
  visaDetails: visaDetailsSchema.optional(),
  medicalCard: medicalCardSchema.optional(),
  insuranceDetails: insuranceDetailsSchema.optional(),
  
  // Professional Details
  profession: z.string().optional(),
  department: z.string().optional(),
  joiningDate: z.string().optional(),
  
  // Contact
  mobile: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().optional(),
  
  // Compensation
  salaryScale: salaryScaleSchema.optional(),

  // Attachments & Photo
  attachments: z.array(attachmentSchema).optional(),
  photo: z.string().nullable().optional(),
});

export type Employee = z.infer<typeof employeeSchema>;
