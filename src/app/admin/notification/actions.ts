
'use server';

import { z } from 'zod';
import { promises as fs } from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { parseISO, differenceInDays } from 'date-fns';

// This file contains a placeholder for email sending logic.
// In a real application, you would integrate a service like SendGrid, AWS SES, or similar.

async function readData(filePath: string) {
    try {
        await fs.access(filePath);
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

export async function getRecipients() {
    const tenants = await readData(path.join(process.cwd(), 'src/app/tenancy/tenants/tenants-data.json'));
    const landlords = await readData(path.join(process.cwd(), 'src/app/landlord/landlords-data.json'));
    const customers = await readData(path.join(process.cwd(), 'src/app/tenancy/customer/customers-data.json'));
    const vendors = await readData(path.join(process.cwd(), 'src/app/vendors/vendors-data.json'));
    const tenancyContracts = await readData(path.join(process.cwd(), 'src/app/tenancy/contract/contracts-data.json'));

    // Find the next due payment for each tenancy contract
    const duePaymentsMap = new Map();
    tenancyContracts.forEach((contract: any) => {
        if (!contract.paymentSchedule) return;
        const nextDue = contract.paymentSchedule
            .filter((p: any) => p.status === 'unpaid')
            .sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
            [0];
        
        if (nextDue) {
            duePaymentsMap.set(contract.contractNo, nextDue);
        }
    });

    const recipientList = [
        ...tenants.map((t: any) => {
            const contract = tenancyContracts.find((c: any) => c.tenantCode === t.tenantData.code);
            const duePayment = contract ? duePaymentsMap.get(contract.contractNo) : null;
            return { 
                value: t.tenantData.email, 
                label: `${t.tenantData.name} (Tenant)`,
                data: {
                    name: t.tenantData.name,
                    propertyAddress: contract?.property || '[Property Address]',
                    contractEndDate: contract?.endDate || '[End Date]',
                    dueAmount: duePayment?.amount || '[Amount]',
                    dueDate: duePayment?.dueDate || '[Due Date]',
                }
            }
        }),
        ...landlords.map((l: any) => ({ 
            value: l.landlordData.email, 
            label: `${l.landlordData.name} (Landlord)`,
            data: { name: l.landlordData.name } 
        })),
        ...customers.map((c: any) => ({ 
            value: c.customerData.email, 
            label: `${c.customerData.name} (Customer)`,
            data: { name: c.customerData.name } 
        })),
        ...vendors.map((v: any) => ({ 
            value: v.vendorData.email, 
            label: `${v.vendorData.name} (Vendor)`,
            data: { name: v.vendorData.name } 
        })),
    ];
    
    // Filter out recipients without a valid email and remove duplicates
    const uniqueRecipients = Array.from(new Map(recipientList.filter(r => r.value).map(item => [item.value, item])).values());

    return uniqueRecipients;
}


const formSchema = z.object({
  recipient: z.string().email(),
  subject: z.string(),
  body: z.string(),
});


export async function sendNotificationEmail(data: z.infer<typeof formSchema>) {
    const validation = formSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: 'Invalid data provided.' };
    }
    
    // Check if communication settings are configured
    try {
        const settingsPath = path.join(process.cwd(), 'src/app/admin/communication/settings.json');
        const settingsData = await fs.readFile(settingsPath, 'utf-8');
        const settings = JSON.parse(settingsData);
        if (!settings.gmailUser || !settings.gmailAppPassword) {
            return { success: false, error: 'Gmail user and App Password are not configured. Please add them in Communication Settings.' };
        }

        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: settings.gmailUser,
            pass: settings.gmailAppPassword,
          },
        });

        const mailOptions = {
          from: settings.gmailUser,
          to: validation.data.recipient,
          subject: validation.data.subject,
          html: validation.data.body.replace(/\n/g, '<br>'),
        };

        await transporter.sendMail(mailOptions);

        return { success: true };

    } catch (error) {
        console.error("Email sending failed:", error);
        return { success: false, error: (error as Error).message || 'Failed to send email.' };
    }
}
